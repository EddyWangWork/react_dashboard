import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { default as $, default as jQuery } from 'jquery';
import React, { useState } from 'react';
window.jQuery = jQuery;
window.$ = $;

const TransactionCompare2 = ({ dsTrans, dsTransCredit, dialogOpen }) => {

    const [result, setresult] = useState([]);
    const [dlstatus, setdlstatus] = useState(false);

    const [totalbudget, settotalbudget] = useState([]);
    const [totalexpenses, settotalexpenses] = useState([]);
    const [totalresult, settotalresult] = useState([]);

    const [dsTransList, setdsTransList] = useState([]);

    React.useEffect(() => {
        if (dsTrans) {
            processCredit();
            getAmount();
        }
    }, [dsTrans])

    const processCredit = () => {
        const yearMonths = [];
        var budgetList = [];

        dsTransCredit.sort((a, b) => a.createdDateTime > b.createdDateTime ? 1 : -1).map((v) => {
            var dateValue = `${new Date(v.createdDateTime).getFullYear()}-${new Date(v.createdDateTime).getMonth() + 1}`;
            v.yearMonth = dateValue;
            var findItem = yearMonths.find((x) => x === dateValue);
            if (!findItem) yearMonths.push(dateValue);
        });
        yearMonths.map((v) => {
            var dataFilter = dsTransCredit.filter((x) => x.yearMonth == v);
            var totalIncome = dataFilter.reduce((a, v) => a = a + v.amount, 0);
            budgetList.push({ 'date': v, 'amount': totalIncome })
        });
        return budgetList;
    }

    const getAmount = () => {
        dsTrans.map((v, k) => {
            v.yearMonth = `${new Date(v.createdDateTime).getFullYear()}-${new Date(v.createdDateTime).getMonth() + 1}`
        })

        var dataBudget = processCredit();

        let result = [];
        dataBudget.map((v, k) => {
            var dataFilter = dsTrans.filter((x) => x.yearMonth == v.date);
            var expenses = dataFilter.reduce((a, v) => a = a + v.amount, 0);
            var total = v.amount - expenses;

            result.push({ 'date': v.date, 'budget': v.amount, 'expenses': expenses, 'total': total })
        })
        console.log(result);
        setresult(result);

        var totalbudget = result.reduce((a, v) => a = a + v.budget, 0);
        var totalexpenses = result.reduce((a, v) => a = a + v.expenses, 0);
        var totalresult = result.reduce((a, v) => a = a + v.total, 0);

        settotalbudget(totalbudget);
        settotalexpenses(totalexpenses);
        settotalresult(totalresult);
    }

    const tableC = () => {
        return (
            <div class="relative overflow-x-auto">
                <table class="w-full text-xs text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr className='text-center'>
                            <th scope="col" class="px-6 py-3 rounded-l-lg">
                                Detail
                            </th>
                            <th scope="col" class="px-6 py-3 rounded-l-lg">
                                Month
                            </th>
                            <th scope="col" class="px-6 py-3 rounded-r-lg">
                                Budget
                            </th>
                            <th scope="col" class="px-6 py-3 rounded-l-lg">
                                Expenses
                            </th>
                            <th scope="col" class="px-6 py-3 rounded-l-lg">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {result.map((v, k) => {
                            return (
                                <tr key={k} class="bg-white dark:bg-gray-800">
                                    <th scope="row" class="w-0.5 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <button id={v.date} onClick={dialogOpen} type="button" class="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2">
                                            <svg id={v.date} class="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" />
                                            </svg>
                                        </button>
                                    </th>
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {v.date}
                                    </th>
                                    <td class="px-6 py-4">
                                        {v.budget.toFixed(2)}
                                    </td>
                                    <td class="px-6 py-4">
                                        {v.expenses.toFixed(2)}
                                    </td>
                                    <td class="px-6 py-4">
                                        {v.total.toFixed(2)}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <tfoot className='text-center'>
                        <tr class="font-semibold text-gray-900 dark:text-white">
                            <th scope="row" class="px-6 py-3 text-xl">Total</th>
                            <td></td>
                            <td class="px-6 py-3">{totalbudget.toFixed(2)}</td>
                            <td class="px-6 py-3">{totalexpenses.toFixed(2)}</td>
                            <td class="px-6 py-3">{totalresult.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        )
    }

    return (
        tableC()
    );
}

export default TransactionCompare2