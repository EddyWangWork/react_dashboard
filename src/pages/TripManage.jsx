import React, { useEffect, useState, ChangeEvent } from 'react';
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
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { TripDetailType } from '../pages'
import { Header } from '../components';

const TripManage = ({ }) => {

    const { handleClearToken, isLogin, token, handleLogin, urlgetTrips } = useStateContext();

    const [data1, setData] = useState([]);
    const [data2, setData2] = useState([]);

    function successShow() {
        ToastUtility.show('Load successfully', 'Success', 2000);
    }

    function dangerShow(e) {
        ToastUtility.show(e, 'Error', 2000);
    }

    let headerText = [{ text: "Trip Detail Type" }, { text: "Transaction" }, { text: "DS Item" }];

    const tabTripDetailType = () => {
        return <div>
            <TripDetailType>
            </TripDetailType>
        </div>;
    }

    useEffect(() => {
    }, [])

    return (
        <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
            <Header category='Page' title='Trip' />
            <TabComponent heightAdjustMode='Auto'>
                <TabItemsDirective>
                    <TabItemDirective header={headerText[0]} content={tabTripDetailType} />
                </TabItemsDirective>
            </TabComponent>
        </div >
    );
}
    ;

export default TripManage;