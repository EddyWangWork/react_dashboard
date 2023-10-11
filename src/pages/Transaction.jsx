import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {
    GridComponent, ColumnsDirective, ColumnDirective,
    AggregateColumnDirective, AggregateColumnsDirective, AggregateDirective, AggregatesDirective, Aggregate,
    Page, Search, Toolbar, Inject, Edit
} from '@syncfusion/ej2-react-grids';
import { format, parseISO } from 'date-fns'
import axios from 'axios';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { createElement, getValue } from '@syncfusion/ej2-base';
import { dsAccGrid, todolistsDoneGrid } from '../data/dtTransaction';
import { DSItems, DSItemsTreeview, DSTransaction, DialogDSAccount } from '../pages'
import { Header } from '../components';

import { useStateContext } from '../contexts/ContextProvider';

const Transaction = () => {

    const { handleClearToken, isLogin, token, handleLogin, urldsAccont } = useStateContext();
    const navigate = useNavigate();

    const [bankAccData, setBankAccData] = useState(null);

    const getdsaccounts = () => {
        axios
            .get(`${urldsAccont}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)

                response.data.map((data, index) => {
                    data.createdDateTime = new Date(data.createdDateTime);
                });

                var activeAcc = response.data.filter(x => x.isActive == true)

                const sortActiveAcc = activeAcc.sort((a, b) => b.balance - a.balance)
                console.log(sortActiveAcc)

                setBankAccData(sortActiveAcc)
            })
            .catch((err) => {
                console.log(err);
                console.log(err.response.status);
                if (err.response.status == 401) {
                    handleClearToken();
                    navigate('/login', { replace: true });
                    window.location.reload();
                }
            });
    }

    const adddsaccount = (req) => {
        axios.post('http://localhost:5000/api/dsaccounts', req, {
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

    const editdsaccount = (id, req) => {
        axios.put(`http://localhost:5000/api/dsaccounts/${id}`, req, {
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

    const deletedsaccount = (id) => {
        axios.delete(`http://localhost:5000/api/dsaccounts/${id}`, {
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
        getdsaccounts();
    }

    const gridCreated = () => {
        console.log('gridCreated');
        if (!bankAccData) {
            getdsaccounts();
        }
    }

    const dialogTemplate = (props) => {
        return (<DialogDSAccount props={props} />);
    };

    const actionBegin = (args) => {
        var data = args.data

        if (args.requestType === 'save' && args.form) {
            if (args.action == 'add') {
                console.log('ADD');
                var req = { name: data.dsaccount }
                console.log(req);
                adddsaccount(req);
            }
            else if (args.action == 'edit') {
                console.log('EDIT');
                var req = {
                    name: data.dsaccount,
                    isActive: data.dsisactive
                }
                console.log(req);
                console.log(data.id);
                editdsaccount(data.id, req);
            }
        }
        else if (args.requestType == 'delete') {
            console.log('DELETE');
            console.log(args.data[0].id);
            deletedsaccount(args.data[0].id);
        }
    };

    const footerAmount = (props) => {
        return (<span>Sum: {props.Sum}</span>);
    };

    const rowDataBound = (args) => {
        if (args.row) {
            var td = args.row.children[2];

            if (getValue('balance', args.data) > 0) {
                td.style.color = 'green'
            }
            else {
                td.style.color = 'red'
            }
        }
    };

    const toolbarOptions = ['Add', 'Edit', 'Delete'];
    const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog', template: dialogTemplate }
    const pageSettings = { pageCount: 5 };

    // let headerText = [{ text: "DS Account" }, { text: "DS Item" }, { text: "DS Item TV" }, { text: "Transaction" }];
    let headerText = [{ text: "DS Account" }, { text: "Transaction" }, { text: "DS Item" }];
    const content0 = () => {
        return <div>
            <GridComponent
                dataSource={bankAccData}
                toolbar={toolbarOptions}
                allowPaging={true}
                editSettings={editSettings}
                pageSettings={pageSettings}
                actionBegin={actionBegin}
                created={gridCreated}
                rowDataBound={rowDataBound}
            >
                <ColumnsDirective>
                    {dsAccGrid.map((item, index) => (
                        <ColumnDirective editType='dropdownedit' key={index} {...item} />
                    ))}
                </ColumnsDirective>

                <AggregatesDirective>
                    <AggregateDirective>
                        <AggregateColumnsDirective>
                            <AggregateColumnDirective
                                field='balance'
                                type='Sum'
                                format='C2'
                                footerTemplate={footerAmount}
                            />
                        </AggregateColumnsDirective>
                    </AggregateDirective>
                </AggregatesDirective>

                <Inject services={[Page, Search, Toolbar, Edit, Aggregate]} />
            </GridComponent>
        </div>;
    }
    const tabDSItem = () => {
        return <div>
            <DSItems>
            </DSItems>
        </div>;
    }
    const tabDSItemTV = () => {
        return <div>
            <DSItemsTreeview>
            </DSItemsTreeview>
        </div>;
    }
    const tabDSTrans = () => {
        return <div>
            <DSTransaction>
            </DSTransaction>
        </div>;
    }

    return (
        <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
            <Header category='Page' title='Todolists' />
            <TabComponent heightAdjustMode='Auto'>
                <TabItemsDirective>
                    <TabItemDirective header={headerText[0]} content={content0} />
                    <TabItemDirective header={headerText[1]} content={tabDSTrans} />
                    <TabItemDirective header={headerText[2]} content={tabDSItem} />
                    {/* <TabItemDirective header={headerText[3]} content={tabDSTrans} /> */}
                </TabItemsDirective>
            </TabComponent>
        </div >
    )
}

export default Transaction