import {
    EuiComboBox,
    EuiLink,
    EuiPanel,
    EuiText,
    EuiPopover,
    EuiPopoverTitle,
    EuiButtonEmpty,
    EuiPopoverFooter,
    EuiButton,
    EuiButtonIcon
} from '@elastic/eui';
import axios from 'axios';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { DialogTrip } from '../pages';

const Trip = ({ }) => {

    const { handleClearToken, isLogin, token, handleLogin, urlgetTrips } = useStateContext();
    const navigate = useNavigate();

    const textColors = ['text-[#166534]', 'text-[#3f6212]', 'text-[#854d0e]', 'text-[#92400e]', 'text-[#9a3412]']

    const [cbTrips, setcbTrips] = useState([]);
    const [selectedTrip, setselectedTrip] = useState([{ id: 1, label: 'No Data' }]);
    const ocSelectedTrip = (v) => setselectedTrip(v);

    const [data, setData] = useState([]);
    const [actionDone, setactionDone] = useState(false);
    const [isLoading, setisLoading] = useState(true);

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
                    cbData.push({ 'id': v.name, 'label': v.name })
                })
                setcbTrips(cbData);
                setData(response.data);
            })
            .catch((err) => {
                console.log(err);
                console.log(err.response.status);
                if (err.response.status == 401) {
                    handleClearToken();
                    navigate('/login', { replace: true });
                }
            });
    }

    const CBTripsOnChange = useMemo(
        () => {
            if (cbTrips.length != 0) {
                setselectedTrip([cbTrips[0]])
            }
        },
        [cbTrips]
    )

    React.useEffect(() => {
        if (data.length == 0 || actionDone) {
            getTrips();
            setactionDone(false);
        }
    }, [actionDone])

    const viewSelectTrip = () => (
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
                setisLoading={setisLoading}
            />
        </div>
    )

    const getPanels = () => (
        data.find(x => x.name == selectedTrip[0].id)?.tripDtos.map((v, i) => (
            <div>
                <EuiPanel key={i} color='primary'>

                    <h1 className={textColors[i]}>{moment(v.date).format('YYYY/MM/DD dddd')}</h1>
                    <div className='flex flex-row gap-2'>
                        <h1 className='text-[#292524]'><span className='italic'>{selectedTrip[0].id} (Day {i + 1})</span></h1>
                        <DialogTrip
                            buttonProp={{ mode: 11, iconType: 'plus', label: 'plus', color: 'accent', bColor: 'border-fuchsia-900/75' }}
                            setactionDone={setactionDone}
                            setisLoading={setisLoading}
                        />
                    </div>

                    <div className='grid grid-cols-3 gap-1 pt-2'>
                        {
                            v.tripDetailDto.tripDetailTypesInfo.map((vv, ii) => (
                                <EuiPanel key={ii}>
                                    <EuiText size="s">
                                        {vv.typeName}
                                    </EuiText>
                                    <EuiPanel>
                                        <EuiText size="xs" color="subdued">
                                            <ul>
                                                {vv.typeValues.map((vvv, iii) => (
                                                    <li key={iii}>
                                                        {
                                                            vvv.typeVTypeLink && <EuiLink href={vvv.typeVTypeLink} target="_blank">
                                                                {vvv.typeValue}
                                                            </EuiLink>
                                                        }
                                                        {
                                                            !vvv.typeVTypeLink && vvv.typeValue
                                                        }
                                                    </li>
                                                ))}
                                            </ul>
                                        </EuiText>
                                    </EuiPanel>
                                </EuiPanel>
                            ))
                        }
                        {/* {
                            <EuiPanel>
                                <div class="flex justify-center">
                                    <DialogTrip
                                        buttonProp={{ mode: 11, iconType: 'plus', label: 'plus', color: 'accent', bColor: 'border-fuchsia-900/75' }}
                                        setactionDone={setactionDone}
                                        setisLoading={setisLoading}
                                    />
                                </div>
                            </EuiPanel>
                        } */}
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
        [cbTrips, selectedTrip, actionDone]
    )

    return (
        <div>
            {ViewNew3()}
        </div>
    );
};

export default Trip;