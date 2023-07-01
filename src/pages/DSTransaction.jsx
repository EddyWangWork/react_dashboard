import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { DataManager } from '@syncfusion/ej2-data';
import { createElement, getValue } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';
import {
    GridComponent, ColumnsDirective, ColumnDirective,
    AggregateColumnDirective, AggregateColumnsDirective, AggregateDirective, AggregatesDirective,
    Page, Search, Toolbar, Inject, Edit, Filter, Group, Sort, Aggregate
} from '@syncfusion/ej2-react-grids';
import { format, parseISO } from 'date-fns'
import axios from 'axios';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { dsTransGrid, todolistsDoneGrid } from '../data/dtTransaction';
import { DSItems, DSItemsTreeview } from '../pages'
import { Header } from '../components';

import { useStateContext } from '../contexts/ContextProvider';

const DSTransaction = () => {
    const { handleClearToken, isLogin, token, handleLogin } = useStateContext();
    const navigate = useNavigate();

    const [dsTrans, setDSTrans] = useState(null);

    const getDSTransactionsLast30Days = () => {
        axios
            .get(`http://localhost:5000/api/dstransactions/getDSTransactionsLast30Days`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                response.data.map((data, index) => {
                    var date = new Date(data.updateDate);
                    data.updateDate = format(date, 'dd/MM/yyyy');
                    data.amount = data.amount.toFixed(2);
                    data.balance = Number(data.balance.toFixed(2));
                });
                console.log(response.data)
                setDSTrans(response.data)
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

    const getdstransactions = () => {
        axios
            .get(`http://localhost:5000/api/dstransactions/getdstransactions`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                response.data.map((data, index) => {
                    data.updateDate = new Date(data.updateDate);
                });
                console.log(response.data)
                setDSTrans(response.data)
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

    const getDSTransactionsByDate = (req) => {
        axios.post('http://localhost:5000/api/dstransactions/getDSTransactionsByDate', req, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.data)
                response.data.map((data, index) => {
                    data.updateDate = new Date(data.updateDate);
                });
                console.log(response.data)
                setDSTrans(response.data)
            })
            .catch(error => {
                console.log(error);
            });
    }

    const gridCreated = () => {
        if (!dsTrans) {
            getdstransactions();
        }
    }

    const filterOptions = {
        type: 'Menu'
    };

    const sortingOptions = {
        columns: [{ field: 'updateDate', direction: 'Descending' }]
    };

    const groupOptions = {
        columns: ['updateDate']
    };

    const toolbarOptions = ['Add', 'Edit', 'Delete'];
    const pageSettings = { pageCount: 5 };

    const dateChange = (e) => {
        console.log(e);
        console.log(e.startDate);
        console.log(e.endDate);
        console.log(+e.startDate);
        console.log(+e.endDate);

        const req =
        {
            UnixStartDate: +e.startDate,
            UnixEndDate: +e.endDate
        }

        getDSTransactionsByDate(req);
    }

    const rowDataBound = (args) => {
        if (args.row) {
            var tdAmount = args.row.children.length == 10 ? args.row.children[5] : args.row.children[6];

            if (getValue('type', args.data) == 1) {
                tdAmount.style.color = 'green'
            }
            else if (getValue('type', args.data) == 2) {
                tdAmount.style.color = 'red'
            }
            else {
                tdAmount.style.color = 'blue'
            }
        }
    };

    const customDebitG = (props) => {
        return props.items.filter(x => x.type == 2).map(x => x.amount).reduce((a, b) => a + b, 0)
    };

    const footerDebitG = (props) => {
        return (
            <span>Debit: <span style={styleRed}>{props.Custom}</span></span>);
    };

    const customCreditG = (props) => {
        return props.items.filter(x => x.type == 1).map(x => x.amount).reduce((a, b) => a + b, 0)
    };

    const footerCreditG = (props) => {
        return (
            <span>Credit: <span style={styleGreen}>{props.Custom}</span></span>);
    };

    const customCurrentCredit = (props) => {
        if (!props.result.GroupGuid) {
            return props.result.filter(x => x.type == 1).map(x => x.amount).reduce((a, b) => a + b, 0)
        }
        else {
            var sum = 0;
            props.result.map((d, i) => {
                d.items.map((dd, ii) => {
                    if (dd.type == 1) {
                        sum += dd.amount;
                    }
                })
            })
            return sum;
        }
    };

    const footerCurrentCredit = (props) => {
        return (<span>Credit(C): <span style={styleGreen}>{props.Custom}</span></span>);
    };

    const customCurrentDebit = (props) => {
        if (!props.result.GroupGuid) {
            return props.result.filter(x => x.type == 2).map(x => x.amount).reduce((a, b) => a + b, 0)
        }
        else {
            var sum = 0;
            props.result.map((d, i) => {
                d.items.map((dd, ii) => {
                    if (dd.type == 2) {
                        sum += dd.amount;
                    }
                })
            })
            return sum;
        }
    };

    const footerCurrentDebit = (props) => {
        return (<span>Debit(C): <span style={styleRed}>{props.Custom}</span></span>);
    };

    const customDebit = () => {
        return dsTrans.filter(x => x.type == 2).map(x => x.amount).reduce((a, b) => a + b, 0).toFixed(2)
    };

    const footerDebit = (props) => {
        return (<span>Debit(S): <span style={styleRed}>{props.Custom}</span></span>);
    };

    const customCredit = () => {
        return dsTrans.filter(x => x.type == 1).map(x => x.amount).reduce((a, b) => a + b, 0).toFixed(2)
    };

    const footerCredit = (props) => {
        return (<span>Credit(S): <span style={styleGreen}>{props.Custom}</span></span>);
    };

    const styleRed = {
        color: 'red'
    };

    const styleGreen = {
        color: 'green'
    };

    return (
        <div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                <DateRangePickerComponent
                    id="daterangepicker"
                    placeholder='Select a range'
                    change={dateChange}
                />
            </div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                <GridComponent
                    dataSource={dsTrans}
                    toolbar={toolbarOptions}
                    allowPaging={true}
                    allowFiltering={true}
                    pageSettings={pageSettings}
                    filterSettings={filterOptions}
                    allowGrouping={true}
                    allowSorting={true}
                    sortSettings={sortingOptions}
                    groupSettings={groupOptions}
                    rowDataBound={rowDataBound}
                    created={gridCreated}
                >
                    <ColumnsDirective>
                        {dsTransGrid.map((item, index) => (
                            <ColumnDirective editType='dropdownedit' key={index} {...item} />
                        ))}
                    </ColumnsDirective>

                    <AggregatesDirective>
                        <AggregateDirective>
                            <AggregateColumnsDirective>
                                <AggregateColumnDirective
                                    field='amount'
                                    type='Custom'
                                    format='C2'
                                    customAggregate={customDebitG}
                                    groupCaptionTemplate={footerDebitG}
                                />
                                <AggregateColumnDirective
                                    field='balance'
                                    type='Custom'
                                    format='C2'
                                    customAggregate={customCreditG}
                                    groupCaptionTemplate={footerCreditG}
                                />
                            </AggregateColumnsDirective>
                        </AggregateDirective>
                        <AggregateDirective>
                            <AggregateColumnsDirective>
                                <AggregateColumnDirective
                                    field='amount'
                                    format='C2'
                                    type='Custom'
                                    customAggregate={customCurrentDebit}
                                    footerTemplate={footerCurrentDebit}
                                />
                                <AggregateColumnDirective
                                    field='balance'
                                    format='C2'
                                    type='Custom'
                                    customAggregate={customCurrentCredit}
                                    footerTemplate={footerCurrentCredit}
                                />
                            </AggregateColumnsDirective>
                        </AggregateDirective>
                        <AggregateDirective>
                            <AggregateColumnsDirective>
                                <AggregateColumnDirective
                                    field='amount'
                                    format='C2'
                                    type='Custom'
                                    customAggregate={customDebit}
                                    footerTemplate={footerDebit}
                                />
                                <AggregateColumnDirective
                                    field='balance'
                                    format='C2'
                                    type='Custom'
                                    customAggregate={customCredit}
                                    footerTemplate={footerCredit}
                                />
                            </AggregateColumnsDirective>
                        </AggregateDirective>
                    </AggregatesDirective>

                    <Inject services={[Page, Search, Toolbar, Edit, Filter, Group, Sort, Aggregate]} />
                </GridComponent>
            </div>
        </div>
    )
}

export default DSTransaction