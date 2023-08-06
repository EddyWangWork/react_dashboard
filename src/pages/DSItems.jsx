import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Search, Toolbar, Inject, Edit, Filter } from '@syncfusion/ej2-react-grids';
import axios from 'axios';
import { dsItemsGrid } from '../data/dtTransaction';
import { DialogDSItem } from '.'
import { Header } from '../components';

import { useStateContext } from '../contexts/ContextProvider';

const DSItems = () => {

    const {
        handleClearToken, token,
        urlDSItemSub, urlgetDSItemWithSub, urladdWithSubItem,
        urlDSItem
    } = useStateContext();
    const navigate = useNavigate();

    const [dsItemsTvData, setdsItemsTvData] = useState(null);
    const [dsItemsData, setdsItemsData] = useState(null);

    const getDSItems = () => {
        axios
            .get(`${urlgetDSItemWithSub}`, {
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

    const addDSItemAndSubItem = (req) => {
        axios.post(`${urladdWithSubItem}`, req, {
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

    const addDSItemSub = (req) => {
        axios.post(`${urlDSItemSub}`, req, {
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

    const editDSItem = (id, req) => {
        axios.put(`${urlDSItem}/${id}`, req, {
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

    const editDSItemSub = (id, req) => {
        axios.put(`${urlDSItemSub}/${id}`, req, {
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

    const deleteDSItem = (id) => {
        axios.delete(`${urlDSItem}/${id}`, {
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

    const deleteDSItemSub = (id) => {
        axios.delete(`${urlDSItemSub}/${id}`, {
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

    const dialogTemplate = (props) => {
        return (<DialogDSItem props={props} />);
    };

    const actionBegin = (args) => {
        var data = args.data

        if (args.requestType === 'save' && args.form) {
            if (args.action == 'add') {
                console.log('ADD');
                if (data.dsMainItemId) { //is sub
                    var req = {
                        name: data.dsSubItemName,
                        dsItemID: data.dsMainItemId
                    }
                    addDSItemSub(req);
                }
                else { //is main
                    var req = {
                        name: data.dsitemName,
                        subName: data.dsSubItemName
                    }
                    addDSItemAndSubItem(req);
                }
            }
            else if (args.action == 'edit') {
                console.log('EDIT');
                console.log(data);
                if (data.subID) { //is sub
                    var req = {
                        name: data.dsSubItemName,
                        dsItemID: data.dsMainItemId
                    }
                    editDSItemSub(data.subID, req)
                }
                else { //is main
                    var req = {
                        name: data.dsitemName,
                    }
                    editDSItem(data.id, req);
                }
            }
        }
        else if (args.requestType == 'delete') {
            console.log('DELETE');
            if (args.data[0].subID) { // is sub
                deleteDSItemSub(args.data[0].subID);
            }
            else { //is main
                deleteDSItem(args.data[0].id);
            }
        }
    };

    const actionComplete = (args) => {
    }

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
                    dataSource={dsItemsData}
                    toolbar={toolbarOptions}
                    allowPaging={true}
                    editSettings={editSettings}
                    pageSettings={pageSettings}
                    allowFiltering={true}
                    filterSettings={filterOptions}
                    actionBegin={actionBegin}
                    actionComplete={actionComplete}
                    created={gridCreated}
                >
                    <ColumnsDirective>
                        {dsItemsGrid.map((item, index) => (
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

export default DSItems