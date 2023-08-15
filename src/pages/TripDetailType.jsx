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
import { tripGrid } from '../data/dtTrip';
import { DialogTripDetailType } from '.'
import {
    GridComponent, ColumnsDirective, ColumnDirective,
    AggregateColumnDirective, AggregateColumnsDirective, AggregateDirective, AggregatesDirective, Aggregate,
    Page, Search, Toolbar, Edit, Filter
} from '@syncfusion/ej2-react-grids';

const TripDetailType = ({ }) => {

    const {
        handleClearToken, token,
        urlgetTripDetailTypes
    } = useStateContext();

    const navigate = useNavigate();

    const [tripDetailTypes, settripDetailTypes] = useState([]);

    function successShow() {
        ToastUtility.show('Load successfully', 'Success', 2000);
    }

    function dangerShow(e) {
        ToastUtility.show(e, 'Error', 2000);
    }

    const getTripDetailTypes = () => {
        axios
            .get(`${urlgetTripDetailTypes}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                successShow();
                console.log(response.data);
                settripDetailTypes(response.data);
            })
            .catch((err) => {
                console.log(err);
                dangerShow(err);
                console.log(err.response.status);
                if (err.response.status == 401) {
                    handleClearToken();
                    navigate('/login', { replace: true });
                }
            });
    }

    const dialogTemplate = (props) => {
        return (<DialogTripDetailType props={props} />);
    };

    const refreshData = () => {
        console.log("refreshData")
        getTripDetailTypes();
    }

    const gridCreated = () => {
        if (!tripDetailTypes) {
            getTripDetailTypes();
        }
    }

    useEffect(() => {
    }, [])

    const toolbarOptions = ['Add', 'Edit', 'Delete'];
    const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog', template: dialogTemplate };
    const pageSettings = { pageCount: 5 };

    const filterOptions = {
        type: 'Menu'
    };

    return (
        <div>
            <div>
                <GridComponent
                    dataSource={tripDetailTypes}
                    toolbar={toolbarOptions}
                    allowPaging={true}
                    editSettings={editSettings}
                    pageSettings={pageSettings}
                    allowFiltering={true}
                    filterSettings={filterOptions}
                    //actionBegin={actionBegin}
                    created={gridCreated}
                >
                    <ColumnsDirective>
                        {tripGrid.map((item, index) => (
                            <ColumnDirective editType='dropdownedit' key={index} {...item} />
                        ))}
                    </ColumnsDirective>
                    <Inject services={[Page, Search, Toolbar, Edit, Filter]} />
                </GridComponent>
            </div>
            <div>

            </div>
        </div>
    );
}

export default TripDetailType;