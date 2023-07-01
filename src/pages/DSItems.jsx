import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Search, Toolbar, Inject, Edit } from '@syncfusion/ej2-react-grids';
import { format, parseISO } from 'date-fns'
import axios from 'axios';
import { TabComponent, TabItemDirective, TabItemsDirective, TreeViewComponent } from '@syncfusion/ej2-react-navigations';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { dsItemsGrid, todolistsDoneGrid } from '../data/dtTransaction';
import { DialogTodolists, DialogTodolistsDone, DialogDSItem } from '.'
import { Header } from '../components';

import { useStateContext } from '../contexts/ContextProvider';

const DSItems = () => {

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

    const getDSItems = () => {
        axios
            .get(`http://localhost:5000/api/dsitemsubcategory/getDSItemsCategoryWithSubV2`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                setdsItemsData(response.data)
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

    const addDSItemAndSubCategory = (req) => {
        axios.post('http://localhost:5000/api/dsitemcategory/createDSItemAndSubCategory', req, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response);
                refreshData();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const addDSItemSubCategory = (req) => {
        axios.post('http://localhost:5000/api/dsitemsubcategory', req, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response);
                refreshData();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const editDSItemCategory = (id, req) => {
        axios.put(`http://localhost:5000/api/dsitemcategory/${id}`, req, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response);
                refreshData();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const editDSItemSubCategory = (id, req) => {
        axios.put(`http://localhost:5000/api/dsitemsubcategory/${id}`, req, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response);
                refreshData();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const deleteDSItemCategory = (id) => {
        axios.delete(`http://localhost:5000/api/dsitemcategory/${id}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response);
                refreshData();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const deleteDSItemSubCategory = (id) => {
        axios.delete(`http://localhost:5000/api/dsitemsubcategory/${id}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response);
                refreshData();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const refreshData = () => {
        console.log("refreshData")
        getDSItems();
    }

    const gridCreated = () => {
        console.log('gridCreated');
        if (!dsItemsData) {
            getDSItems();
        }
    }

    // useEffect(() => {
    //     setdsItemsTvData(null);
    //     setdsItemsData(null);
    // });

    let fields = { dataSource: dsItemsTvData, id: 'id', text: 'name', child: 'dsItemSubCategories' };

    const tvCreated = () => {
        console.log('tvCreated');
        if (!dsItemsTvData) {
            getDSTvItems();
        }
    }

    const dialogTemplate = (props) => {
        return (<DialogDSItem props={props} />);
    };

    const actionBegin = (args) => {
        var data = args.data

        if (args.requestType === 'save' && args.form) {
            if (args.action == 'add') {
                console.log('ADD');
                if (data.dsItemCatId) { //is sub
                    var req = {
                        name: data.dsSubItemName,
                        dsItemCategoryId: data.dsItemCatId
                    }
                    addDSItemSubCategory(req);
                }
                else { //is main
                    var req = {
                        name: data.dsitemName,
                        subName: data.dsSubItemName
                    }
                    addDSItemAndSubCategory(req);
                }
            }
            else if (args.action == 'edit') {
                console.log('EDIT');
                if (data.subId) { //is sub
                    var req = {
                        name: data.dsSubItemName,
                        dsItemCategoryId: data.dsItemCatId
                    }
                    editDSItemSubCategory(data.subId, req)
                }
                else { //is main
                    var req = {
                        name: data.dsitemName,
                    }
                    editDSItemCategory(data.id, req);
                }
            }
        }
        else if (args.requestType == 'delete') {
            console.log('DELETE');
            if (args.data[0].subId) { // is sub
                deleteDSItemSubCategory(args.data[0].subId);
            }
            else { //is main
                deleteDSItemCategory(args.data[0].id);
            }
        }
    };

    const actionComplete = (args) => {
        // if (args.form) {
        //     if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
        //         args.form.ej2_instances[0].addRules('dsitemName', { required: [true, '* Please enter your name'] });
        //         args.form.ej2_instances[0].addRules('dsSubItemName', { required: [true, '* Please enter sub your name'] });
        //     }
        // }
    }

    const toolbarOptions = ['Add', 'Edit', 'Delete'];
    const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog', template: dialogTemplate };
    //<TreeViewComponent fields={fields} created={tvCreated} />
    const pageSettings = { pageCount: 5 };

    return (
        <div>
            <div>
                <GridComponent
                    dataSource={dsItemsData}
                    toolbar={toolbarOptions}
                    allowPaging={true}
                    editSettings={editSettings}
                    pageSettings={pageSettings}
                    actionBegin={actionBegin}
                    actionComplete={actionComplete}
                    created={gridCreated}
                >
                    <ColumnsDirective>
                        {dsItemsGrid.map((item, index) => (
                            <ColumnDirective editType='dropdownedit' key={index} {...item} />
                        ))}
                    </ColumnsDirective>
                    <Inject services={[Page, Search, Toolbar, Edit]} />
                </GridComponent>
            </div>
            <div>

            </div>
        </div>
    );
}

export default DSItems