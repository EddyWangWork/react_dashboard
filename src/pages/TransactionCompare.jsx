import React, { useEffect, useState, useRef } from 'react';
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
import { DateRangePickerComponent, DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { ListBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import { useStateContext } from '../contexts/ContextProvider';
import $ from 'jquery';
import jQuery from 'jquery';
window.jQuery = jQuery;
window.$ = $;



const TransactionCompare = () => {

    const { handleClearToken, isLogin, token, handleLogin, urldsAccont, dsTrans } = useStateContext();
    const navigate = useNavigate();

    const [amountA, setamountA] = useState(0);
    const [amountB, setamountB] = useState(0);

    const [dsA, setdsA] = useState([]);
    const [dsB, setdsB] = useState([]);

    let refA = useRef(null);
    let refB = useRef(null);

    React.useEffect(() => {
        getAmount();
        $('.e-listbox-tool').on("click", function () {
            getAmount();
        });
    }, [])

    let fields = { text: "dsItemName" };
    let toolbar = { items: ["moveTo", "moveFrom", "moveAllTo", "moveAllFrom"] };

    const getAmount = () => {
        console.log(refA.current.listData);
        console.log(refB);

        var dsTransFilterA = dsTrans.filter((x) => refA.current.listData.some(y => y.rowID === x.rowID));
        var dsTransFilterB = dsTrans.filter((x) => refB.current.listData.some(y => y.rowID === x.rowID));

        var dsTransFilterAA = structuredClone(dsTransFilterA);
        dsTransFilterAA.map((data, index) => {
            data.dsItemName = `${data.dsItemName} ${data.description != null ? `(${data.description})` : ''}`
        });
        var dsTransFilterBB = structuredClone(dsTransFilterB);
        dsTransFilterBB.map((data, index) => {
            data.dsItemName = `${data.dsItemName} ${data.description != null ? `(${data.description})` : ''}`
        });

        setdsA(dsTransFilterAA.sort((a, b) => a.amount - b.amount));
        setdsB(dsTransFilterBB.sort((a, b) => a.amount - b.amount));

        var totalA = dsTransFilterAA.reduce((a, v) => a = a + v.amount, 0)
        var totalB = dsTransFilterBB.reduce((a, v) => a = a + v.amount, 0)

        setamountA(totalA);
        setamountB(totalB);
    }

    const getFilterTransactions = (s, e, dsAll) => {
        dsAll.map((data, index) => {
            data.unixcreatedDateTime = +(new Date(data.createdDateTime));
        });
        console.log('getFilterTransactions');
        console.log(dsAll);
        var dsTransFilterA = dsAll.filter(x => (+(x.unixcreatedDateTime) >= s && +(x.unixcreatedDateTime) <= e) && x.dsTypeID == 2
            && x.dsItemName.includes('Commitment'));
        var dsTransFilterB = dsAll.filter(x => (+(x.unixcreatedDateTime) >= s && +(x.unixcreatedDateTime) <= e) && x.dsTypeID == 2
            && !x.dsItemName.includes('Commitment'));

        var dsTransFilterAA = structuredClone(dsTransFilterA);
        dsTransFilterAA.map((data, index) => {
            data.dsItemName = `${data.dsItemName} ${data.description != null ? `(${data.description})` : ''}`
        });
        var dsTransFilterBB = structuredClone(dsTransFilterB);
        dsTransFilterBB.map((data, index) => {
            data.dsItemName = `${data.dsItemName} ${data.description != null ? `(${data.description})` : ''}`
        });

        setdsA(dsTransFilterAA.sort((a, b) => a.amount - b.amount));
        setdsB(dsTransFilterBB.sort((a, b) => a.amount - b.amount));

        var totalA = dsTransFilterAA.reduce((a, v) => a = a + v.amount, 0)
        var totalB = dsTransFilterBB.reduce((a, v) => a = a + v.amount, 0)

        setamountA(totalA);
        setamountB(totalB);
    }

    const dateChange = (e) => {
        if (e.startDate) {
            getFilterTransactions(+(e.startDate), +(e.endDate), dsTrans);
        } else {
            // setDSTrans(dsTransAll);
        }
    }

    const listboxA = () => {
        return (
            <div className="listbox1">
                <ListBoxComponent sortOrder='Ascending' ref={refA} height={250} dataSource={dsA} fields={fields} scope="#listbox" toolbarSettings={toolbar} />
            </div>
        )
    }

    const listboxB = () => {
        return (
            <div className="listbox2 listbox1">
                <ListBoxComponent sortOrder='Ascending' ref={refB} height={250} id="listbox" dataSource={dsB} fields={fields} />
            </div>
        )
    }

    const tableA = () => {
        return (
            <div class="relative overflow-x-auto">
                <table class="w-full text-xs text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3 rounded-l-lg text-center">
                                Product name
                            </th>
                            <th scope="col" class="px-6 py-3 rounded-r-lg text-center">
                                Price
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {dsA.map((v, k) => {
                            return (
                                <tr key={k} class="bg-white dark:bg-gray-800">
                                    <th scope="row" class="text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {v.dsItemName}
                                    </th>
                                    <td class="px-6 py-4 text-center">
                                        {dsTrans.find(x => x.rowID == v.rowID)?.amount.toFixed(2) ?? 0}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <tfoot>
                        <tr class="font-semibold text-gray-900 dark:text-white">
                            <th scope="row" class="px-6 py-3 text-xs text-center">Total</th>
                            <td class="px-6 py-3 text-center">{amountA.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        )
    }

    const tableB = () => {
        return (
            <div class="relative overflow-x-auto">
                <table class="w-full text-xs text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3 rounded-l-lg text-center">
                                Product name
                            </th>
                            <th scope="col" class="px-6 py-3 rounded-r-lg text-center">
                                Price
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {dsB.map((v, k) => {
                            return (
                                <tr key={k} class="bg-white dark:bg-gray-800">
                                    <th scope="row" class="text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {v.dsItemName}
                                    </th>
                                    <td class="px-6 py-4 text-center">
                                        {dsTrans.find(x => x.rowID == v.rowID)?.amount.toFixed(2) ?? 0}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <tfoot>
                        <tr class="font-semibold text-gray-900 dark:text-white">
                            <th scope="row" class="px-6 py-3 text-xs text-center">Total</th>
                            <td class="px-6 py-3 text-center">{amountB.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        )
    }

    const dateFilter = () => {
        return (
            <div>
                <div href="#" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <div>
                        <div> FILTER </div>
                    </div>
                    <div className='flex flex-wrap lg:flex-nowrap'>
                        <DateRangePickerComponent
                            id="daterangepicker"
                            width={500}
                            floatLabelType="Auto"
                            placeholder='Transaction date'
                            change={dateChange}
                        />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div class="grid grid-cols-2 gap-6 py-5">
                <div class="pl-10 col-span-2">{dateFilter()}</div>
                <div className='pl-10'>{listboxA()}</div>
                <div className='pr-10'>{listboxB()}</div>
                <div class="pl-10">{tableA()}</div>
                <div class="pr-10">{tableB()}</div>
            </div>
        </div>
    );
}

export default TransactionCompare