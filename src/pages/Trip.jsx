import {
    EuiButtonIcon,
    EuiComboBox,
    EuiInlineEditText,
    EuiLink,
    EuiPanel,
    EuiText,
    EuiCard,
    EuiListGroup,
    EuiDatePicker
} from '@elastic/eui';
import axios from 'axios';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { DialogTrip } from '../pages';

const Trip = ({ }) => {

    const {
        handleClearToken, token,
        urlgetTrips, urlupdatetripdetailtype,
        addToastHandler, getToastReq, removeToast, setToasts
    } = useStateContext();
    const navigate = useNavigate();

    const textColors = ['text-[#166534]', 'text-[#3f6212]', 'text-[#854d0e]', 'text-[#92400e]', 'text-[#9a3412]']

    const [cbTrips, setcbTrips] = useState([]);
    const [selectedTrip, setselectedTrip] = useState([{ id: 1, label: 'No Data' }]);
    const ocSelectedTrip = (v) => setselectedTrip(v);

    const [data, setData] = useState([]);
    const [actionDone, setactionDone] = useState(false);
    const [actionDoneRes, setactionDoneRes] = useState({});
    const [isLoading, setisLoading] = useState(true);
    const [isInit, setisInit] = useState(true);
    const [isRefresh, setisRefresh] = useState(false);

    const [currentPage, setcurrentPage] = useState(1);
    const [totalEvents, settotalEvents] = useState(0);
    const [totalEventsPage, settotalEventsPage] = useState(0);
    const [dlEvents, setdlEvents] = useState([]);
    const [dataIncomingEvents, setdataIncomingEvents] = useState([]);

    const [isTypeNameReadonly, setisTypeNameReadonly] = useState(true);

    const [startDate, setStartDate] = useState(moment());

    const dataSelectedTrip = data?.find(x => x.id == selectedTrip[0]?.id);
    const dataSelectedTripDateFrom = moment(dataSelectedTrip?.tripDtos[0]?.date).format('YYYY/MM/DD');
    const dataSelectedTripDateTo = moment(dataSelectedTrip?.tripDtos[dataSelectedTrip?.tripDtos?.length - 1]?.date).format('YYYY/MM/DD');

    const CBTripsOnChange = useMemo(
        () => {
            if (cbTrips.length != 0 || actionDoneRes?.id > 0) {
                setselectedTrip([actionDoneRes.id > 0 ? cbTrips.find(x => x.id == actionDoneRes.id) : cbTrips[0]])
                setactionDoneRes({ id: 0 })
            }
        },
        [cbTrips]
    )

    const getTrips = () => {
        axios
            .get(`${urlgetTrips}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data);
                var dataSorted = response.data.sort((a, b) => a.tripDtos[0].date < b.tripDtos[0].date ? 1 : -1)
                var cbData = [];
                dataSorted.map((v, i) => {
                    cbData.push({ 'id': v.id, 'label': v.name })
                })

                var dataIncomingEvents = dataSorted.filter(x => moment(x.tripDtos[0].date) > new Date());
                setdataIncomingEvents(dataIncomingEvents);

                setcbTrips(cbData);
                setData(dataSorted);
                getInitEvents(dataIncomingEvents);
                addToastHandler(getToastReq(1, 'Trip', ['Loaded'], 'check'));
            })
            .catch((err) => {
                console.log(err);
                if (err.code = 'ERR_NETWORK' || err?.response?.status == 401) {
                    addToastHandler(getToastReq(3, err.code, (err?.response?.data?.Message ?? err.code)));
                    handleClearToken();
                    navigate('/login', { replace: true });
                }
            });
    }

    const updatetripdetailtype = (id, req) => {
        axios
            .put(`${urlupdatetripdetailtype}/${id}`, req, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data);
                addToastHandler(getToastReq(1, 'Update DetailType', [response.data.name], 'wrench'));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getTypeInfoRowData = (tripID, tripDetailTypeID, tripDate, typeValueID, typeInfoName, typeInfoLink) => ({
        tripID, tripDetailTypeID, tripDate, typeValueID, typeInfoName, typeInfoLink
    })

    const getRowDataTrip = {
        tripID: selectedTrip[0]?.id,
        tripName: selectedTrip[0]?.label,
        fromDate: dataSelectedTripDateFrom,
        toDate: dataSelectedTripDateTo
    }

    const getRowDataTripDetailType = (typeID, typeName) => ({
        typeID, typeName
    })

    const onSaveTripTypeName = (v, id) => {
        var req = { name: v }
        updatetripdetailtype(id, req);
        setactionDoneRes({ id: selectedTrip[0]?.id })
        setisTypeNameReadonly(true);
        setactionDone(true);
    }

    const onRefresh = () => {
        setisRefresh(true)
        addToastHandler(getToastReq(1, 'Trip', ['Refreshing'], 'refresh'));
    }

    React.useEffect(() => {
        if (isInit || actionDone || isRefresh) {
            setcurrentPage(1);
            setData([]);

            setTimeout(() => {
                getTrips();
                setisInit(false);
                setactionDone(false);
                setisRefresh(false);
            }, actionDone ? 1000 : 0);
        }
        // }, [actionDone, actionDoneRes])
    }, [actionDone, isRefresh])

    const viewCalendar = () => (
        <EuiDatePicker inline selected={startDate} onChange={() => { }} />
    )

    const viewSelectTrip = () => (
        <div className='gap-1'>
            <div className='flex flex-row gap-2'>
                <EuiComboBox
                    aria-label="Accessible screen reader label"
                    placeholder="Select a single option"
                    singleSelection={{ asPlainText: true }}
                    options={cbTrips}
                    selectedOptions={selectedTrip}
                    onChange={ocSelectedTrip}
                    isClearable={false}
                />
                <DialogTrip
                    buttonProp={{ mode: 1, iconType: 'plus', label: 'plus', color: 'accent', bColor: 'border-fuchsia-900/75' }}
                    setactionDone={setactionDone}
                />
                <DialogTrip
                    rowData={getRowDataTrip}
                    buttonProp={{ mode: 2, iconType: 'wrench', label: 'wrench', color: 'primary', bColor: 'border-indigo-500/75' }}
                    setactionDone={setactionDone}
                    setactionDoneRes={setactionDoneRes}
                />
                <DialogTrip
                    rowData={getRowDataTrip}
                    buttonProp={{ mode: 3, iconType: 'cross', label: 'cross', color: 'danger', bColor: 'border-rose-400/75' }}
                    setactionDone={setactionDone}
                    setactionDoneRes={setactionDoneRes}
                />
                <EuiButtonIcon
                    display="empty"
                    iconType={'refresh'}
                    aria-label={'refresh'}
                    color={'success'}
                    onClick={() => { onRefresh() }}
                />
            </div>
            <div>
                <EuiPanel>
                    {`${dataSelectedTripDateFrom} - ${dataSelectedTripDateTo}`}
                </EuiPanel>
            </div>
        </div>
    )

    const getPanels = () => (
        data.find(x => x.id == selectedTrip[0]?.id)?.tripDtos.map((v, i) => (
            <div key={i}>
                <EuiPanel color='primary'>
                    <h1 className={textColors[i]}>{moment(v.date).format('YYYY/MM/DD dddd')}</h1>
                    <div className='flex flex-row gap-2'>
                        <h1 className='text-[#292524]'><span className='italic'>{selectedTrip[0]?.label} (Day {i + 1})</span></h1>
                        <DialogTrip
                            buttonProp={{ mode: 11, iconType: 'plus', label: 'plus', color: 'accent', bColor: 'border-fuchsia-900/75' }}
                            setactionDone={setactionDone}
                        />
                        <EuiButtonIcon
                            display="empty"
                            iconType={'wrench'}
                            aria-label={'wrench'}
                            color={'primary'}
                            onClick={() => { setisTypeNameReadonly(!isTypeNameReadonly) }}
                        />
                    </div>

                    <div className='grid grid-cols-3 gap-1 pt-2'>
                        {
                            v.tripDetailDto.tripDetailTypesInfo.map((vv, ii) => (
                                <EuiPanel key={ii}>
                                    <EuiText size="s">
                                        <div className='flex flex-row gap-2'>
                                            <EuiInlineEditText
                                                size='xs'
                                                inputAriaLabel="Edit text inline"
                                                defaultValue={vv.typeName}
                                                onSave={(x) => onSaveTripTypeName(x, vv.typeID)}
                                                isReadOnly={isTypeNameReadonly}
                                            />
                                            {!isTypeNameReadonly && <DialogTrip
                                                rowData={getTypeInfoRowData(selectedTrip[0]?.id, vv.typeID, moment(v.date).format('YYYY-MM-DD'))}
                                                buttonProp={{ mode: 111, iconType: 'plus', label: 'plus', color: 'accent', bColor: 'border-fuchsia-900/75' }}
                                                setactionDone={setactionDone}
                                            />}
                                            {!isTypeNameReadonly && <DialogTrip
                                                rowData={getRowDataTripDetailType(vv.typeID, vv.typeName)}
                                                buttonProp={{ mode: 33, iconType: 'cross', label: 'cross', color: 'danger', bColor: 'border-rose-400/75' }}
                                                setactionDone={setactionDone}
                                                setactionDoneRes={setactionDoneRes}
                                            />}
                                        </div>

                                    </EuiText>
                                    <EuiPanel>
                                        <EuiText size="xs" color="subdued">
                                            <ul>
                                                {vv.typeValues.map((vvv, iii) => (
                                                    <li key={iii}>
                                                        <div className='grid grid-cols-3 gap-1'>
                                                            <div className='col-span-2'>
                                                                {
                                                                    vvv.typeVTypeLink ?
                                                                        <EuiLink href={vvv.typeVTypeLink} target="_blank">
                                                                            {vvv.typeValue}
                                                                        </EuiLink> :
                                                                        vvv.typeValue

                                                                }
                                                            </div>
                                                            <div className='flex flex-row gap-1'>
                                                                {
                                                                    !isTypeNameReadonly && vvv.typeValue != '-' && <DialogTrip
                                                                        rowData={getTypeInfoRowData(selectedTrip[0]?.id, vv.typeID, moment(v.date).format('YYYY-MM-DD'), vvv.typeValueID, vvv.typeValue, vvv.typeVTypeLink)}
                                                                        buttonProp={{ mode: 222, iconType: 'pencil', label: 'wrench', color: 'primary', bColor: 'border-indigo-500/75' }}
                                                                        setactionDone={setactionDone}
                                                                        setactionDoneRes={setactionDoneRes}
                                                                    />
                                                                }
                                                                {
                                                                    !isTypeNameReadonly && vvv.typeValue != '-' && <DialogTrip
                                                                        rowData={getTypeInfoRowData(selectedTrip[0]?.id, vv.typeID, moment(v.date).format('YYYY-MM-DD'), vvv.typeValueID, vvv.typeValue, vvv.typeVTypeLink)}
                                                                        buttonProp={{ mode: 333, iconType: 'cross', label: 'cross', color: 'danger', bColor: 'border-rose-400/75' }}
                                                                        setactionDone={setactionDone}
                                                                        setactionDoneRes={setactionDoneRes}
                                                                    />
                                                                }
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </EuiText>
                                    </EuiPanel>
                                </EuiPanel>
                            ))
                        }
                    </div>
                </EuiPanel>
            </div>
        ))
    )

    const ViewNew3 = () => useMemo(
        () => (
            data && <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
                <Header category='Page' title='Trip' />
                <div className='flex flex-col gap-2'>
                    <EuiPanel>
                        <div className='flex flex-row gap-2'>
                            {viewCalendar()}
                            {cardEvent()}
                        </div>
                    </EuiPanel>
                    <EuiPanel>
                        <div>
                            {cbTrips.length != 0 && viewSelectTrip()}
                        </div>
                    </EuiPanel>
                    <EuiPanel>
                        <div className='flex flex-col gap-2 pt-2'>
                            {getPanels()}
                        </div>
                    </EuiPanel>
                </div>
            </div>
        ),
        [cbTrips, selectedTrip, actionDone, actionDoneRes, isTypeNameReadonly, currentPage]
    )

    const cardEvent = () => {
        return <EuiCard
            className='select-text'
            hasBorder
            title={`total: ${totalEvents}`}
            description={
                <div className='flex flex-col justify-items-center gap-2'>
                    {lgEvents()}
                    <div className='grid justify-items-center pt-4'>
                        {paginationEvent()}
                    </div>
                </div>
            }
            betaBadgeProps={{
                label: 'Incoming events',
                color: 'hollow',
            }}
        />

    }

    const lgEvents = () => {
        return <EuiListGroup listItems={dlEvents} color="primary" size="s" />
    }

    const paginationEvent = () => {
        return <div className='flex flex-row gap-2'>
            <EuiButtonIcon
                display="base"
                iconType="arrowLeft"
                iconSize="l"
                size="xs"
                aria-label="Previous"
                onClick={() => ocPageNumber(false)}

            />
            {currentPage}
            <EuiButtonIcon
                display="base"
                iconType="arrowRight"
                iconSize="l"
                size="xs"
                aria-label="Next"
                hidden={currentPage == 1}
                onClick={() => ocPageNumber(true)}
            />
            {`page: ${totalEventsPage}`}
        </div>
    }

    const ocPageNumber = (isNext) => {
        var pageCount = 2
        var resultPage = isNext ? currentPage + 1 : currentPage - 1;
        var skipNumber = (resultPage - 1) * pageCount;

        var ssssss = [];
        dataIncomingEvents.map((v) => {
            var aasdds = `${v.name}: (${moment(v.tripDtos[0].date).format("YYYY-MM-DD")})`
            ssssss.push({
                label: aasdds,
                href: '#/display/list-group',
                iconType: 'calendar',
            })
        })

        setdlEvents(ssssss.slice(skipNumber, skipNumber + pageCount));
        setcurrentPage(resultPage)
    }

    const getInitEvents = (dataIncomingEvents) => {

        settotalEvents(dataIncomingEvents.length);
        settotalEventsPage(Math.ceil(dataIncomingEvents.length / 2));

        var ssssss = [];
        dataIncomingEvents.map((v) => {
            var aasdds = `${v.name}: (${moment(v.tripDtos[0].date).format("YYYY-MM-DD")})`
            ssssss.push({
                label: aasdds,
                href: '#/display/list-group',
                iconType: 'calendar',
            })
        })

        setdlEvents(ssssss.slice(0, 2));
    }

    return (
        <div>
            {ViewNew3()}
        </div>
    );
};

export default Trip;