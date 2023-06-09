import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { DataManager } from '@syncfusion/ej2-data';
import { createElement, getValue } from '@syncfusion/ej2-base';
import { DropDownListComponent, DropDownTreeComponent, AutoCompleteComponent } from '@syncfusion/ej2-react-dropdowns';
import { DateRangePickerComponent, DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import {
    GridComponent, ColumnsDirective, ColumnDirective,
    AggregateColumnDirective, AggregateColumnsDirective, AggregateDirective, AggregatesDirective,
    Page, Search, Toolbar, Inject, Edit, Filter, Group, Sort, Aggregate
} from '@syncfusion/ej2-react-grids';
import { format, parseISO } from 'date-fns'
import axios from 'axios';
import { TabComponent, TabItemDirective, TabItemsDirective, AccordionComponent, AccordionItemDirective, AccordionItemsDirective } from '@syncfusion/ej2-react-navigations';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { dsTransGrid, todolistsDoneGrid } from '../data/dtTransaction';
import { DialogDSTransaction } from '../pages'
import { Header, Button } from '../components';

import { useStateContext } from '../contexts/ContextProvider';

const DSTransaction = () => {
    const { handleClearToken, isLogin, token, handleLogin } = useStateContext();
    const navigate = useNavigate();

    const [dsTrans, setDSTrans] = useState(null);

    const [dsTransTypeData, setdsTransTypeData] = useState(null);
    const [dsAccData, setdsAccData] = useState(null);

    const [updateDateI, setupdateDateI] = useState(null);
    const [typeIdI, settypeIdI] = useState(null);
    const [accIdI, setaccIdI] = useState(null);

    const [updateDateI2, setupdateDateI2] = useState(null);

    const GetDSTransactionTypes = () => {
        axios
            .get(`http://localhost:5000/api/dstransactions/GetDSTransactionTypes`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                var res = response.data.filter(x => x.id != 4)
                setdsTransTypeData(res)
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

    const getdsaccounts = () => {
        axios
            .get(`http://localhost:5000/api/dsaccounts/getdsaccounts`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                var activeAcc = response.data.filter(x => x.isActive == true)
                setdsAccData(activeAcc)
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
                    data.updateDateDay = new Date(data.updateDate);
                });
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
                    data.updateDateDay = new Date(data.updateDate);
                });
                console.log(response.data)
                setDSTrans(response.data)
            })
            .catch(error => {
                console.log(error);
            });
    }

    const addDStransaction = (req) => {
        axios.post('http://localhost:5000/api/dstransactions', req, {
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

    const editDStransaction = (id, req) => {
        axios.put(`http://localhost:5000/api/dstransactions/${id}`, req, {
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

    const deleteDStransaction = (id) => {
        axios.delete(`http://localhost:5000/api/dstransactions/${id}`, {
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
        getdstransactions();
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

    const dateChange = (e) => {
        console.log(e);
        console.log(e.startDate);
        console.log(e.endDate);
        console.log(+e.startDate);
        console.log(+e.endDate);

        if (e.startDate) {
            const req =
            {
                UnixStartDate: +e.startDate,
                UnixEndDate: +e.endDate
            }

            getDSTransactionsByDate(req);
        } else {
            refreshData();
        }
    }

    const rowDataBound = (args) => {
        if (args.row) {
            var tdAmount = args.row.children.length == 12 ? args.row.children[7] : args.row.children[6];

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

    const dialogTemplate = (props) => {
        return (<DialogDSTransaction props={props} />);
    };

    const actionBegin = (args) => {
        var data = args.data

        if (args.data) {
            if (args.requestType === 'add') {
                args.data.updateDate = updateDateI
                args.data.type = typeIdI
                args.data.dsAccountId = accIdI
            }
        }

        if (args.requestType === 'save' && args.form) {
            if (args.action == 'add') {
                console.log('ADD');
                var req = {
                    name: data.nameFull,
                    description: data.desc,
                    amount: data.amount,
                    UnixUpdateTime: +data.updateDate,
                    type: data.typeId,
                    DSAccountId: data.accId,
                    DSAccountTransferId: data.accToId
                }
                console.log(req);
                addDStransaction(req);
            }
            else if (args.action == 'edit') {
                console.log('EDIT');
                var req = {
                    name: data.nameFull,
                    description: data.desc,
                    amount: data.amount,
                    UnixUpdateTime: +data.updateDate,
                    type: data.typeId,
                    DSAccountId: data.accId,
                    DSAccountTransferId: data.accToId
                }
                console.log(data.id);
                console.log(req);
                editDStransaction(data.id, req);
            }
        }
        else if (args.requestType == 'delete') {
            console.log('DELETE');
            console.log(args.data[0].id);
            deleteDStransaction(args.data[0].id);
        }
    };



    const actionComplete = (args) => {
        if (args.form) {
            if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
                args.form.ej2_instances[0].addRules('typeId', { required: [true, '* Please select type'] });
                args.form.ej2_instances[0].addRules('accId', { required: [true, '* Please select account'] });
                //args.form.ej2_instances[0].addRules('nameFull', { required: [true, '* Please enter name'] });
                args.form.ej2_instances[0].addRules('amount', { required: [true, '* Please enter amount'] });
            }
        }
    }

    const handleUpdateDate = (e) => {
        setupdateDateI(e.value);
    }

    const handleTypeId = (e) => {
        settypeIdI(e.value);
    }

    const handleAccId = (e) => {
        setaccIdI(e.value);
    }

    const rowSelected = () => {
        if (grid) {
            /** Get the selected row indexes */
            const selectedrowindex = grid.getSelectedRowIndexes();
            /** Get the selected records. */
            const selectedrecords = grid.getSelectedRecords();
            console.log(selectedrecords);
            preUpdateDate.value = selectedrecords[0].updateDate
            setupdateDateI(selectedrecords[0].updateDate);
            preAccId.value = selectedrecords[0].dsAccountId;
            setaccIdI(selectedrecords[0].dsAccountId);
        }
    };

    let grid;
    let preUpdateDate;
    let preAccId;

    const toolbarOptions = ['Add', 'Edit', 'Delete'];
    const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog', template: dialogTemplate };
    const pageSettings = { pageCount: 10 };

    const dsTransTypefields = { text: 'name', value: 'id' };
    const dsAccfields = { text: 'name', value: 'id' };

    useEffect(() => {
        getdsaccounts();
        GetDSTransactionTypes();
    }, []);

    return (
        <div>
            <AccordionComponent>
                <div>
                    <div>
                        <div> PRESET </div>
                    </div>
                    <div className='flex flex-wrap lg:flex-nowrap'>
                        <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl w-full m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center'>
                            <DatePickerComponent
                                ref={x => preUpdateDate = x}
                                id='updateDate'
                                placeholder="Date"
                                floatLabelType="Auto"
                                strictMode={false}
                                format='dd/MM/yyyy'
                                onChange={handleUpdateDate}
                            >
                            </DatePickerComponent>
                        </div>
                        <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl w-full m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center'>
                            <DropDownListComponent
                                id='typeId'
                                placeholder="Type"
                                floatLabelType="Auto"
                                dataSource={dsTransTypeData}
                                fields={dsTransTypefields}
                                onChange={handleTypeId}
                            />
                        </div>
                        <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl w-full m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center'>
                            <DropDownListComponent
                                ref={x => preAccId = x}
                                id='accId'
                                placeholder="Account"
                                floatLabelType="Auto"
                                dataSource={dsAccData}
                                fields={dsAccfields}
                                onChange={handleAccId}
                            />
                        </div>
                    </div>
                </div>
            </AccordionComponent>

            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                <DateRangePickerComponent
                    id="daterangepicker"
                    placeholder='Select a range'
                    change={dateChange}
                />
            </div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                <GridComponent
                    ref={g => grid = g}
                    dataSource={dsTrans}
                    toolbar={toolbarOptions}
                    editSettings={editSettings}
                    pageSettings={pageSettings}
                    actionBegin={actionBegin}
                    actionComplete={actionComplete}
                    allowPaging={true}
                    allowFiltering={true}
                    filterSettings={filterOptions}
                    allowGrouping={true}
                    allowSorting={true}
                    sortSettings={sortingOptions}
                    groupSettings={groupOptions}
                    rowDataBound={rowDataBound}
                    created={gridCreated}
                    rowSelected={rowSelected}
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