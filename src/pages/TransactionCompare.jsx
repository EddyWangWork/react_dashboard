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

    const { handleClearToken, isLogin, token, handleLogin, urldsAccont, dsTransactions } = useStateContext();
    const navigate = useNavigate();

    const [countA, setcountA] = useState(0);
    const [countB, setcountB] = useState(0);
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
    }, [dsA])

    let fields = { text: "dsItemName" };
    let toolbar = { items: ["moveTo", "moveFrom", "moveAllTo", "moveAllFrom"] };

    const getAmount = () => {
        console.log(refA.current.listData);
        console.log(refB);

        var arrayA = dsTransactions.filter((x) => refA.current.listData.some(y => y.rowID === x.rowID));
        var arrayB = dsTransactions.filter((x) => refB.current.listData.some(y => y.rowID === x.rowID));

        var totalA = arrayA.reduce((a, v) => a = a + v.amount, 0)
        var totalB = arrayB.reduce((a, v) => a = a + v.amount, 0)

        setcountA(arrayA.length);
        setamountA(totalA);

        setcountB(arrayB.length);
        setamountB(totalB);
    }

    const listboxA = () => {
        return (
            <div className="listbox1 pl-10">
                <ListBoxComponent sortOrder='Ascending' ref={refA} height={250} dataSource={dsA} fields={fields} scope="#listbox" toolbarSettings={toolbar} />
            </div>
        )
    }

    const listboxB = () => {
        return (
            <div className="listbox2 listbox1 pr-10">
                <ListBoxComponent sortOrder='Ascending' ref={refB} height={250} id="listbox" dataSource={dsB} fields={fields} />
            </div>
        )
    }

    const box3 = () => {
        return (
            <div class="relative overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-2xl text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Category
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Value
                            </th>
                        </tr>
                    </thead>
                    <tbody class="text-xl">
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Item
                            </th>
                            <td class="px-6 py-4">
                                {countA}
                            </td>
                        </tr>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Total
                            </th>
                            <td class="px-6 py-4">
                                {amountA}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    const box4 = () => {
        return (
            <div class="relative overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-2xl text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Category
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Value
                            </th>
                        </tr>
                    </thead>
                    <tbody class="text-xl">
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Item
                            </th>
                            <td class="px-6 py-4">
                                {countB}
                            </td>
                        </tr>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Total
                            </th>
                            <td class="px-6 py-4">
                                {amountB}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    const box5 = () => {
        return (
            <div href="#" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technology acquisitions 2021</h5>
                <p class="font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
            </div>
        )
    }

    const getFilterTransactions = (s, e, dsAll) => {
        dsAll.map((data, index) => {
            data.unixcreatedDateTime = +(new Date(data.createdDateTime));
        });
        var dsTransFilterA = dsAll.filter(x => (+(x.unixcreatedDateTime) >= s && +(x.unixcreatedDateTime) <= e) && x.dsTypeID == 2
            && x.dsItemName.includes('Commitment'));
        var dsTransFilterB = dsAll.filter(x => (+(x.unixcreatedDateTime) >= s && +(x.unixcreatedDateTime) <= e) && x.dsTypeID == 2
            && !x.dsItemName.includes('Commitment'));
        setdsA(dsTransFilterA);
        setdsB(dsTransFilterB);
    }

    const dateChange = (e) => {
        if (e.startDate) {
            getFilterTransactions(+(e.startDate), +(e.endDate), dsTransactions);
        } else {
            // setDSTrans(dsTransAll);
        }
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
                <div>{listboxA()}</div>
                <div>{listboxB()}</div>
                <div class="pl-10 pr-24">{box3()}</div>
                <div class="pr-10">{box4()}</div>
            </div>
        </div>
    );
}

export default TransactionCompare