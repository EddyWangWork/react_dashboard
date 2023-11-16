import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent, ListBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { default as $, default as jQuery } from 'jquery';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import { TransactionCompare2 } from '../pages';
window.jQuery = jQuery;
window.$ = $;

const TransactionCompare = () => {

    const { dsTrans, getdstransactions, dsTransError, handleClearToken } = useStateContext();
    const navigate = useNavigate();

    const [mode, setmode] = useState(1);
    const [dsTransFilter, setdsTransFilter] = useState(null);

    const [amountA, setamountA] = useState(0);
    const [amountB, setamountB] = useState(0);

    const [dsA, setdsA] = useState([]);
    const [dsB, setdsB] = useState([]);

    const [dsTransList, setdsTransList] = useState([]);
    const [dlstatus, setdlstatus] = useState(false);

    const [dateFilterStart, setdateFilterStart] = useState(new Date());
    const [dateFilterEnd, setdateFilterEnd] = useState(new Date());

    let refA = useRef(null);
    let refB = useRef(null);

    React.useEffect(() => {
        if (dsTrans.length == 0) {
            getdstransactions();
        }

        console.log(dsTransError);

        if (dsTransError) {
            handleClearToken();
            navigate('/login', { replace: true });
            window.location.reload();
        }

        if (refA.current?.listData) {
            getAmount();
        }

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

        setdsA(dsTransFilterAA.sort((a, b) => b.amount - a.amount));
        setdsB(dsTransFilterBB.sort((a, b) => b.amount - a.amount));

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
        var dsTransFilterAll = dsAll.filter(x => (+(x.unixcreatedDateTime) >= s && +(x.unixcreatedDateTime) <= e) && x.dsTypeID == 2);

        var dsTransFilterAA = structuredClone(dsTransFilterA);
        dsTransFilterAA.map((data, index) => {
            data.dsItemName = `${data.dsItemName} ${data.description != null ? `(${data.description})` : ''}`
        });
        var dsTransFilterBB = structuredClone(dsTransFilterB);
        dsTransFilterBB.map((data, index) => {
            data.dsItemName = `${data.dsItemName} ${data.description != null ? `(${data.description})` : ''}`
        });

        setdsA(dsTransFilterAA.sort((a, b) => b.amount - a.amount));
        setdsB(dsTransFilterBB.sort((a, b) => b.amount - a.amount));
        setdsTransFilter(dsTransFilterAll);

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

    const modeChange = (e) => {
        setdateFilterStart(new Date());
        setdateFilterEnd(new Date());
        setmode(e.value);
    }

    let dataMode = [
        { 'name': 'Compare', 'id': 1 },
        { 'name': 'Month', 'id': 2 }
    ]
    const ddModeFields = { text: 'name', value: 'id' };

    const modeFilter = () => {
        return (
            <div href="#" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <div>
                    <div> MODE </div>
                </div>
                <div className='flex flex-wrap lg:flex-nowrap'>
                    <DropDownListComponent
                        onChange={modeChange}
                        dataSource={dataMode}
                        fields={ddModeFields}
                        placeholder="Mode"
                    // floatLabelType="Auto"
                    />
                </div>
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
                            start='Year'
                            depth='Year'
                            format='MM/yyyy'
                            startDate={dateFilterStart}
                            endDate={dateFilterEnd}
                            change={dateChange}
                        />
                    </div>
                </div>
            </div>
        )
    }

    /*Modal*/

    function onOverlayClick() {
        setdlstatus(false);
    }
    function dialogClose() {
        setdlstatus(false);
    }
    function dialogOpen(e) {
        console.log(e);
        console.log(e.target.id);
        console.log(e.target.id == '');
        console.log(e.target.parentElement.id);
        console.log(e.target.parentElement.id == '');

        dsTransFilter.map((v, k) => {
            v.yearMonth = `${new Date(v.createdDateTime).getFullYear()}-${new Date(v.createdDateTime).getMonth() + 1}`
        })
        var targetId = e.target.id != '' ? e.target.id : e.target.parentElement.id;
        var dsTransListFilter = dsTransFilter.filter(x => x.yearMonth == targetId);

        var totalsumup = 0;
        dsTransListFilter.sort((a, b) => b.amount - a.amount).map((v, k) => {
            totalsumup += v.amount;
            v.sumup = totalsumup;
        })
        setdsTransList(dsTransListFilter.sort((a, b) => b.amount - a.amount));
        setdlstatus(true);
    }

    const dlTrans = () => {
        return (
            <div className="App" id='dialog-target'>
                {/* <button className='e-control e-btn' id='targetButton1' role='button' onClick={handleClick.bind(this)}>Open</button> */}

                <DialogComponent width='550px' isModal={true} target='#dialog-target' visible={dlstatus} close={dialogClose} overlayClick={onOverlayClick}>
                    {dlTransList()}
                </DialogComponent>
            </div>
        )
    }

    const dlTransList = () => {
        return (
            <div class="relative overflow-x-auto">
                <table class="w-full text-xs text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr className='text-center'>
                            <th scope="col" class="px-6 py-3 rounded-l-lg">
                                ITEM
                            </th>
                            <th scope="col" class="px-6 py-3 rounded-l-lg">
                                AMOUNT
                            </th>
                            <th scope="col" class="px-6 py-3 rounded-l-lg">
                                SUM
                            </th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {dsTransList?.map((v, k) => {
                            return (
                                <tr key={k} class="bg-white dark:bg-gray-800">
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {v.dsItemName}
                                    </th>
                                    <td class="px-6 py-4">
                                        {v.amount.toFixed(2)}
                                    </td>
                                    <td class="px-6 py-4">
                                        {v.sumup.toFixed(2)}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    /*END Modal*/

    return (
        <div>
            <div clas>{dlTrans()}</div>
            <div class="grid grid-cols-2 gap-6 py-5">
                <div class="pl-10">{modeFilter()}</div>
                <div>{dateFilter()}</div>
                {mode == 1 &&
                    <>
                        <div className='pl-10'>{listboxA()}</div>
                        <div className='pr-10'>{listboxB()}</div>
                        <div class="pl-10">{tableA()}</div>
                        <div class="pr-10">{tableB()}</div>
                    </>
                }
                {mode == 2 &&
                    <div className='col-span-2 pl-10 pr-10'>
                        <TransactionCompare2
                            dsTrans={dsTransFilter}
                            dialogOpen={dialogOpen}
                        >
                        </TransactionCompare2>
                    </div>
                }
            </div>
        </div>
    );
}

export default TransactionCompare