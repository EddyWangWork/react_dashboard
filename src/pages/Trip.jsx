import {
    EuiButtonIcon,
    EuiComboBox,
    EuiInlineEditText,
    EuiLink,
    EuiPanel,
    EuiText
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
        addToastHandler, getToastReq
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

    const [isTypeNameReadonly, setisTypeNameReadonly] = useState(true);

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
                var cbData = [];
                response.data.map((v, i) => {
                    cbData.push({ 'id': v.id, 'label': v.name })
                })
                setcbTrips(cbData);
                setData(response.data);
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

    React.useEffect(() => {
        if (isInit || actionDone) {
            setData([]);
            getTrips();
            setisInit(false);
            setactionDone(false);
        }
    }, [actionDone, actionDoneRes])

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
                                                            <div>
                                                                {
                                                                    !isTypeNameReadonly && vvv.typeValue != '-' && <DialogTrip
                                                                        rowData={getTypeInfoRowData(selectedTrip[0]?.id, vv.typeID, moment(v.date).format('YYYY-MM-DD'), vvv.typeValueID, vvv.typeValue, vvv.typeVTypeLink)}
                                                                        buttonProp={{ mode: 222, iconType: 'pencil', label: 'wrench', color: 'primary', bColor: 'border-indigo-500/75' }}
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
        [cbTrips, selectedTrip, actionDone, isTypeNameReadonly]
    )

    return (
        <div>
            {ViewNew3()}
        </div>
    );
};

export default Trip;