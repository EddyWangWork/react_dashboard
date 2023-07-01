import * as ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import { DataManager, Query, Predicate } from '@syncfusion/ej2-data';
import { MaskedTextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { TreeViewComponent } from '@syncfusion/ej2-react-navigations';
import { DropDownTreeComponent } from '@syncfusion/ej2-react-dropdowns';

import { Route, Routes, useNavigate } from 'react-router-dom';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Search, Toolbar, Inject, Edit } from '@syncfusion/ej2-react-grids';
import { format, parseISO } from 'date-fns'
import axios from 'axios';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { dsItemsGrid, todolistsDoneGrid } from '../data/dtTransaction';
import { DialogTodolists, DialogTodolistsDone, DialogDSItem } from '.'
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

const DSItemsTreeview = () => {

    const { handleClearToken, isLogin, token, handleLogin } = useStateContext();
    const navigate = useNavigate();

    const [dsItemsTvData, setdsItemsTvData] = useState(null);
    const [dsItemsData, setdsItemsData] = useState(null);

    const getDSTvItems = () => {
        axios
            .get(`http://localhost:5000/api/dsitemsubcategory/getDSItemsCategoryWithSubV3`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                setdsItemsTvData(response.data)
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

    let fields = { dataSource: dsItemsTvData, value: 'id', text: 'name', child: 'dsItemSubCategories' };

    useEffect(() => {
        getDSTvItems();
    }, []);

    return (
        // specifies the tag for render the DropDownTree component
        <DropDownTreeComponent
            id="dropdowntree"
            fields={fields}
            allowFiltering={true}
            filterType='Contains'
            popupHeight='700px'
        />);
}

export default DSItemsTreeview