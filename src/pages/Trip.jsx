import React, { useEffect, useState, ChangeEvent } from 'react';
import {
    EuiCard,
    EuiDragDropContext,
    EuiDraggable,
    EuiDroppable,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSkeletonLoading,
    EuiSkeletonRectangle,
    euiDragDropMove,
    euiDragDropReorder,
    htmlIdGenerator,
    EuiPanel,
    EuiText,
    EuiTitle,
    EuiLink
} from '@elastic/eui';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { useStateContext } from '../contexts/ContextProvider';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { ToastUtility } from '@syncfusion/ej2-react-notifications';
import {
    ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, DateTime,
    Tooltip, DataLabel, LineSeries, Crosshair
} from '@syncfusion/ej2-react-charts';
import { Chrono } from "react-chrono";
import Slider from "react-slick";
import Moment from 'moment';
import { Header } from '../components';
import moment from 'moment';

const Trip = ({ }) => {

    const { handleClearToken, isLogin, token, handleLogin, urlgetTrips } = useStateContext();

    const [data1, setData] = useState([]);
    const [data2, setData2] = useState([]);

    function successShow() {
        ToastUtility.show('Load successfully', 'Success', 2000);
    }

    function dangerShow(e) {
        ToastUtility.show(e, 'Error', 2000);
    }

    const getTitlesApi = async () => {
        axios
            .get(`${urlgetTrips}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data);
                let titles = []
                var firstTrip = response.data[0]
                firstTrip.tripDtos.map((v, i) => {
                    let title = (Moment(v.date).format('DD-MM-yyyy dddd'));
                    let cardTitle = `day:${i + 1}`;
                    titles.push({ title: title, cardTitle: cardTitle })
                })
                setData2(titles);
            })
            .catch(error => {
                dangerShow(error.response.data)
            });
    }

    function getCardInfo() {
        axios
            .get(`${urlgetTrips}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data);
                var firstTrip = response.data[0]
                console.log(firstTrip.tripDtos);
                setData(firstTrip.tripDtos);
                successShow();
            })
            .catch(error => {
                dangerShow(error.response.data)
            });
    }

    React.useEffect(() => {
        // getCardInfo();
        // getTitlesApi();
    }, [])

    //-----DATA AREA-------------------------------//

    const dummyData = [
        {
            "name": "Langkawi",
            "tripDtos": [
                {
                    "date": "2023-08-31T00:00:00",
                    "tripDetailDtos": [
                        {
                            "tripDetailTypesInfo": [
                                {
                                    "typeName": "Flight",
                                    "typeValues": [
                                        {
                                            "typeValue": "depart: 08:00",
                                            "typeVTypeLink": "https://www.google.com.my/"
                                        }
                                    ]
                                },
                                {
                                    "typeName": "Breakfast",
                                    "typeValues": [
                                        {
                                            "typeValue": "ABC Sdn Bhd",
                                            "typeVTypeLink": ""
                                        },
                                        {
                                            "typeValue": "FFF Sdn Bhd",
                                            "typeVTypeLink": "https://www.google.com.my/"
                                        },
                                        {
                                            "typeValue": "WRDS Sdn Bhd",
                                            "typeVTypeLink": ""
                                        },
                                        {
                                            "typeValue": "ABC Sdn Bhd",
                                            "typeVTypeLink": ""
                                        },
                                        {
                                            "typeValue": "FFF Sdn Bhd",
                                            "typeVTypeLink": "https://www.google.com.my/"
                                        },
                                        {
                                            "typeValue": "WRDS Sdn Bhd",
                                            "typeVTypeLink": ""
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "date": "2023-09-01T00:00:00",
                    "tripDetailDtos": [
                        {
                            "tripDetailTypesInfo": [
                                {
                                    "typeName": "Flight",
                                    "typeValues": [
                                        {
                                            "typeValue": "-",
                                            "typeVTypeLink": ""
                                        }
                                    ]
                                },
                                {
                                    "typeName": "Breakfast",
                                    "typeValues": [
                                        {
                                            "typeValue": "-",
                                            "typeVTypeLink": ""
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "date": "2023-09-02T00:00:00",
                    "tripDetailDtos": [
                        {
                            "tripDetailTypesInfo": [
                                {
                                    "typeName": "Flight",
                                    "typeValues": [
                                        {
                                            "typeValue": "-",
                                            "typeVTypeLink": ""
                                        }
                                    ]
                                },
                                {
                                    "typeName": "Breakfast",
                                    "typeValues": [
                                        {
                                            "typeValue": "-",
                                            "typeVTypeLink": ""
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]

    //-----END-------------------------------//

    const getcard3 = () => {
        return data1.map((v, i) => (
            <div key={i}>
                {v.tripDetailDtos.map((v2, i) => (
                    <div key={i} style={{ margin: `10px`, display: `flex`, flexDirection: `row`, justifyContent: `center` }}>
                        <div className="e-card e-card-horizontal" style={{ width: `900px` }}>
                            {v2.tripDetailTypesInfo.map((v3, i) => (
                                <div key={i} className="e-card-stacked">
                                    <div className="e-card-header">
                                        <div className="e-card-header-caption">
                                            <div className="e-card-header-title">{v3.typeName}</div>
                                        </div>
                                    </div>
                                    <div className="e-card-content">
                                        <ul className='ul2'>
                                            {v3.typeValues.map((v4, i) => {
                                                // <li key={i}><a href={v4.typeVTypeLink} target='self'>{v4.typeValue}</a></li>
                                                if (v4.typeVTypeLink != '') {
                                                    return <li key={i}><a href={v4.typeVTypeLink} target='self'>{v4.typeValue}</a></li>
                                                }
                                                else {
                                                    return <li key={i}>{v4.typeValue}</li>
                                                }
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        ))
    }

    const viewOld = () => (
        <div className="App">
            {
                data2.length > 0 ?
                    <Chrono
                        items={data2}
                        mode="VERTICAL"
                        slideShow
                    >
                        {
                            getcard3()
                        }
                    </Chrono>
                    :
                    <h3>no data</h3>
            }
        </div>
    )

    const getPanels = () => (
        dummyData[0].tripDtos.map((v, i) => (
            <div>
                <EuiPanel color='primary'>
                    <EuiTitle size="xs">
                        <h1>{moment(v.date).format('YYYY/MM/DD')} - <span className='italic'>{dummyData[0].name}</span></h1>
                    </EuiTitle>
                    <div className='grid grid-cols-3 gap-1 pt-2'>
                        {
                            v.tripDetailDtos[0].tripDetailTypesInfo.map((vv, ii) => (
                                <EuiPanel>
                                    <EuiText size="s">
                                        {vv.typeName}
                                    </EuiText>
                                    <EuiPanel>
                                        <EuiText size="xs" color="subdued">
                                            <ul>
                                                {vv.typeValues.map((vvv, iii) => (
                                                    <li>
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
                    </div>
                </EuiPanel>
            </div>
        ))
    )

    const viewNew2 = () => (
        <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
            <Header category='Page' title='Trip' />
            <div className='flex flex-col gap-2'>
                <EuiPanel>

                </EuiPanel>
                <EuiPanel>
                    <div className='flex flex-col gap-2 pt-2'>
                        {getPanels()}
                    </div>
                </EuiPanel>
            </div>
        </div>

    )

    const viewNew = () => (
        <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
            <Header category='Page' title='Trip' />
            <div>
                <EuiPanel color='primary'>
                    <EuiTitle size="xs">
                        <h1>2024-02-09</h1>
                    </EuiTitle>
                    <div className='grid grid-cols-3 gap-1 pt-2'>
                        <EuiPanel>
                            <EuiText size="s">
                                Flight
                            </EuiText>
                            <EuiPanel>
                                <EuiText size="s">
                                    <ul>
                                        <li>List item one</li>
                                        <li>List item two</li>
                                        <li>Dolphins</li>
                                    </ul>
                                </EuiText>
                            </EuiPanel>
                        </EuiPanel>
                        <EuiPanel>
                            <EuiText size="s">
                                Breakfast
                            </EuiText>
                            <EuiPanel>
                                <EuiText size="s">
                                    <ul>
                                        <li>List item one</li>
                                        <li>List item two</li>
                                        <li>Dolphins</li>
                                    </ul>
                                </EuiText>
                            </EuiPanel>
                        </EuiPanel>
                        <EuiPanel>
                            <EuiText size="s">
                                Breakfast
                            </EuiText>
                            <EuiPanel>
                                <EuiText size="s">
                                    <ul>
                                        <li>List item one</li>
                                        <li>List item two</li>
                                        <li>Dolphins</li>
                                    </ul>
                                </EuiText>
                            </EuiPanel>
                        </EuiPanel>
                        <EuiPanel>
                            <EuiText size="s">
                                Breakfast
                            </EuiText>
                            <EuiPanel>
                                <EuiText size="s">
                                    <ul>
                                        <li>List item one</li>
                                        <li>List item two</li>
                                        <li>Dolphins</li>
                                    </ul>
                                </EuiText>
                            </EuiPanel>
                        </EuiPanel>
                    </div>
                </EuiPanel>
            </div>
            <div className='pt-2'>
                <EuiPanel color='primary'>
                    <EuiTitle size="xs">
                        <h1>2024-02-09</h1>
                    </EuiTitle>
                    <div className='grid grid-cols-3 gap-1 pt-2'>
                        <EuiPanel>
                            <EuiText size="s">
                                Flight
                            </EuiText>
                            <EuiPanel>
                                <EuiText size="s">
                                    <ul>
                                        <li>List item one</li>
                                        <li>List item two</li>
                                        <li>Dolphins</li>
                                    </ul>
                                </EuiText>
                            </EuiPanel>
                        </EuiPanel>
                        <EuiPanel>
                            <EuiText size="s">
                                Breakfast
                            </EuiText>
                            <EuiPanel>
                                <EuiText size="s">
                                    <ul>
                                        <li>List item one</li>
                                        <li>List item two</li>
                                        <li>Dolphins</li>
                                    </ul>
                                </EuiText>
                            </EuiPanel>
                        </EuiPanel>
                        <EuiPanel>
                            <EuiText size="s">
                                Breakfast
                            </EuiText>
                            <EuiPanel>
                                <EuiText size="s">
                                    <ul>
                                        <li>List item one</li>
                                        <li>List item two</li>
                                        <li>Dolphins</li>
                                    </ul>
                                </EuiText>
                            </EuiPanel>
                        </EuiPanel>
                        <EuiPanel>
                            <EuiText size="s">
                                Breakfast
                            </EuiText>
                            <EuiPanel>
                                <EuiText size="s">
                                    <ul>
                                        <li>List item one</li>
                                        <li>List item two</li>
                                        <li>Dolphins</li>
                                    </ul>
                                </EuiText>
                            </EuiPanel>
                        </EuiPanel>
                    </div>
                </EuiPanel>
            </div>
        </div>

    )

    return (
        <div>
            {viewNew2()}
        </div>
    );
};

export default Trip;