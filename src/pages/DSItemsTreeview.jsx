import * as ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import { DataManager, Query, Predicate } from '@syncfusion/ej2-data';
import { MaskedTextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { TreeViewComponent } from '@syncfusion/ej2-react-navigations';

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

    let localData = [
        { id: 1, name: "Australia", hasChild: true },
        { id: 2, pid: 1, name: "New South Wales" },
        { id: 3, pid: 1, name: "Victoria" },
        { id: 4, pid: 1, name: "South Australia" },
        { id: 6, pid: 1, name: "Western Australia" },
        { id: 7, name: "Brazil", hasChild: true },
        { id: 8, pid: 7, name: "Paraná" },
        { id: 9, pid: 7, name: "Ceará" },
        { id: 10, pid: 7, name: "Acre" },
        { id: 11, name: "China", hasChild: true },
        { id: 12, pid: 11, name: "Guangzhou" },
        { id: 13, pid: 11, name: "Shanghai" },
        { id: 14, pid: 11, name: "Beijing" },
        { id: 15, pid: 11, name: "Shantou" },
        { id: 16, name: "France", hasChild: true },
        { id: 17, pid: 16, name: "Pays de la Loire" },
        { id: 18, pid: 16, name: "Aquitaine" },
        { id: 19, pid: 16, name: "Brittany" },
        { id: 20, pid: 16, name: "Lorraine" },
        { id: 21, name: "India", hasChild: true },
        { id: 22, pid: 21, name: "Assam" },
        { id: 23, pid: 21, name: "Bihar" },
        { id: 24, pid: 21, name: "Tamil Nadu" },
        { id: 25, pid: 21, name: "Punjab" }
    ];
    // Mapping TreeView fields property with data source properties
    //let field = { dataSource: localData, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild', expanded: "expanded" };
    let field = { dataSource: dsItemsTvData, id: 'id', text: 'name', child: 'dsItemSubCategories' };
    let treeObj;
    let maskObj;
    //Change the dataSource for TreeView
    function changeDataSource(data) {
        treeObj.fields = {
            //dataSource: data, id: 'id', text: 'name', parentID: 'pid', hasChildren: 'hasChild'
            dataSource: data, id: 'id', text: 'name', child: 'dsItemSubCategories'
        };
    }
    //Filtering the TreeNodes
    function searchNodes(args) {
        let _text = maskObj.element.value;
        let predicats = [], _array = [], _filter = [];
        if (_text == "") {
            changeDataSource(dsItemsTvData);
        }
        else {
            let predicate = new Predicate('name', 'startswith', _text, true);
            let filteredList = new DataManager(dsItemsTvData).executeLocal(new Query().where(predicate));
            console.log(filteredList);
            for (let j = 0; j < filteredList.length; j++) {
                _filter.push(filteredList[j]["id"]);
                let filters = getFilterItems(filteredList[j], dsItemsTvData);
                for (let i = 0; i < filters.length; i++) {
                    if (_array.indexOf(filters[i]) == -1 && filters[i] != null) {
                        _array.push(filters[i]);
                        predicats.push(new Predicate('id', 'equal', filters[i], false));
                    }
                }
            }
            if (predicats.length == 0) {
                changeDataSource([]);
            }
            else {
                let query = new Query().where(Predicate.or(predicats));
                let newList = new DataManager(dsItemsTvData).executeLocal(query);
                changeDataSource(newList);
                let proxy = treeObj;
                setTimeout(function () {
                    proxy.expandAll();
                }, 100);
            }
        }
    }
    //Find the Parent Nodes for corresponding childs
    function getFilterItems(fList, list) {
        let nodes = [];
        nodes.push(fList["id"]);
        let query2 = new Query().where('id', 'equal', fList["dsItemSubCategories"], false);
        let fList1 = new DataManager(list).executeLocal(query2);
        if (fList1.length != 0) {
            let pNode = getFilterItems(fList1[0], list);
            for (let i = 0; i < pNode.length; i++) {
                if (nodes.indexOf(pNode[i]) == -1 && pNode[i] != null)
                    nodes.push(pNode[i]);
            }
            return nodes;
        }
        return nodes;
    }

    const tvCreated = () => {
        console.log('tvCreated');
        if (!dsItemsTvData) {
            getDSTvItems();
        }
    }

    const tvSelecting = (e) => {
        console.log(e);
    }

    return (
        <div>
            <div className="row custom-margin custom-padding-5">
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <MaskedTextBoxComponent ref={(mask) => { maskObj = mask; }} change={searchNodes.bind(this)} />
                    {/* Render TreeView */}
                    <TreeViewComponent
                        fields={field}
                        ref={(treeview) => { treeObj = treeview; }}
                        created={tvCreated}
                        nodeSelecting={tvSelecting}
                    />
                </div>
            </div>

        </div>
    );
}

export default DSItemsTreeview