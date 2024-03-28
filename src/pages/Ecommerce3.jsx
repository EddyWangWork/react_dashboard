import {
    EuiBadge,
    EuiBasicTable,
    EuiCard,
    EuiDatePicker,
    EuiFieldNumber,
    EuiIcon,
    EuiPanel,
    EuiProgress,
    EuiStat,
    EuiTextColor
} from '@elastic/eui';
import axios from 'axios';
import moment from 'moment';
import { React, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components';

import { useStateContext } from '../contexts/ContextProvider';

const Ecommerce3 = () => {

    const {
        handleClearToken, token,
        urlTodolist, //todolist
        urlgetDSMonthlyPeriodCreditDebit, urlgetDSMonthlyItemExpenses, urlgetDSMonthlyCommitmentAndOther
    } = useStateContext();

    const navigate = useNavigate();

    const [date, setdate] = useState(new moment());
    const [period, setperiod] = useState(3);

    const [dataMonthlyPeriod, setdataMonthlyPeriod] = useState([]);
    const [dataMonthlyCurrent, setdataMonthlyCurrent] = useState({});
    const [dataMonthlyExpenses, setdataMonthlyExpenses] = useState({});
    const [dataCommitmentAndOther, setdataCommitmentAndOther] = useState({});
    const [dataTodolist, setdataTodolist] = useState([]);

    const query = `year=${date.year()}&month=${date.month() + 1}&monthDuration=${period}`
    const queryByItem = `name=commitment&year=${date.year()}&month=${date.month() + 1}`

    const getDSMonthlyPeriodCreditDebit = () => {
        axios
            .get(`${urlgetDSMonthlyPeriodCreditDebit}?${query}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                setdataMonthlyPeriod(response.data);
                setdataMonthlyCurrent(response.data[0]);
            })
            .catch((err) => {
                console.log(err);
                console.log(err?.response?.status);
                if (err?.response?.status == 401) {
                    handleClearToken();
                    navigate('/login', { replace: true });
                    window.location.reload();
                }
            });
    }

    const getDSMonthlyItemExpenses = () => {
        axios
            .get(`${urlgetDSMonthlyItemExpenses}?${query}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                response.data.map((v, i) => {
                    v.dsMonthlyItems = v.dsMonthlyItems.sort(function (a, b) { return b.amount - a.amount });
                    v.dsMonthlySubItems = v.dsMonthlySubItems.sort(function (a, b) { return b.amountComparePercentage - a.amountComparePercentage });
                })
                setdataMonthlyExpenses(response.data[0]);
            })
            .catch((err) => {
                console.log(err);
                console.log(err?.response?.status);
                if (err?.response?.status == 401) {
                    handleClearToken();
                    navigate('/login', { replace: true });
                    window.location.reload();
                }
            });
    }

    const getDSMonthlyCommitmentAndOther = () => {
        axios
            .get(`${urlgetDSMonthlyCommitmentAndOther}?${queryByItem}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                setdataCommitmentAndOther(response.data);
            })
            .catch((err) => {
                console.log(err);
                console.log(err?.response?.status);
                if (err?.response?.status == 401) {
                    handleClearToken();
                    navigate('/login', { replace: true });
                    window.location.reload();
                }
            });
    }

    const getTodolist = () => {
        axios
            .get(`${urlTodolist}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                setdataTodolist(response.data);
            })
            .catch((err) => {
                console.log(err);
                console.log(err?.response?.status);
                if (err?.response?.status == 401) {
                    handleClearToken();
                    navigate('/login', { replace: true });
                    window.location.reload();
                }
            });
    }

    const ViewCardTableSection = () => useMemo(
        () => {
            console.log(dataCommitmentAndOther)
            return dataCommitmentAndOther?.items?.length > 0 && <div className='flex flex-row gap-2'>
                {cardCommitment()}
                {cardCommitmentOther()}
                {cardTodo()}
            </div>
        },
        [dataCommitmentAndOther],
    );

    const cardCommitment = () => {
        return <EuiCard
            className='select-text'
            hasBorder
            title='-'
            description={
                <>
                    <EuiBasicTable
                        tableCaption="Demo of EuiBasicTable"
                        items={dataCommitmentAndOther.items}
                        rowHeader="firstName"
                        columns={columnsCommitment}
                    />
                </>
            }
            betaBadgeProps={{
                label: 'Commitment',
                color: 'hollow',
                tooltipContent:
                    'You can change the badge color using betaBadgeProps.color.',
            }}
        />
    }

    const cardCommitmentOther = () => {
        return <EuiCard
            className='select-text'
            hasBorder
            title='-'
            description={
                <>
                    <EuiBasicTable
                        tableCaption="Demo of EuiBasicTable"
                        items={dataCommitmentAndOther.itemsOther}
                        rowHeader="firstName"
                        columns={columnsCommitmentOther}
                    />
                </>
            }
            betaBadgeProps={{
                label: 'Normal',
                color: 'hollow',
                tooltipContent:
                    'You can change the badge color using betaBadgeProps.color.',
            }}
        />

    }

    const cardTodo = () => {
        return <EuiCard
            className='select-text'
            hasBorder
            title='-'
            description={
                <>
                    <EuiBasicTable
                        tableCaption="Demo of EuiBasicTable"
                        items={dataTodolist}
                        rowHeader="firstName"
                        columns={columnsTodo}
                    />
                </>
            }
            betaBadgeProps={{
                label: 'Todo Pending',
                color: 'hollow',
                tooltipContent:
                    'You can change the badge color using betaBadgeProps.color.',
            }}
        />

    }

    const statItemExpensesAmount = () => {
        return dataMonthlyExpenses.dsMonthlyItems.filter(x => x.amount != 0).map((v, i) => (
            <EuiPanel hasBorder={true}>
                <EuiStat
                    title={removeMinus(v.amount.toLocaleString())}
                    description={v.itemName}
                    textAlign="left"
                >
                </EuiStat>
            </EuiPanel>
        ))
    }

    const statItemExpenses = () => {
        return dataMonthlyExpenses.dsMonthlyItems.filter(x => x.amountComparePercentage != '0.00').map((v, i) => (
            <EuiPanel hasBorder={true}>
                <EuiStat
                    title={removeMinus(v.diff.toLocaleString())}
                    description={v.itemName}
                    textAlign="left"
                >
                    <EuiTextColor color={getStatColor(v.amountComparePercentage, false)}>
                        <span>
                            <EuiIcon type={getStatIcon(v.diff)} /> {removeMinus(v.amountComparePercentage)}%
                        </span>
                    </EuiTextColor>
                </EuiStat>
            </EuiPanel>
        ))
    }

    const statSubItemExpenses = () => {
        return dataMonthlyExpenses.dsMonthlySubItems.filter(x => x.amountComparePercentage != '0.00').map((v, i) => (
            <EuiPanel hasBorder={true}>
                <EuiStat
                    title={removeMinus(v.diff.toLocaleString())}
                    description={v.itemName}
                    textAlign="left"
                >
                    <EuiTextColor color={getStatColor(v.amountComparePercentage, false)}>
                        <span>
                            <EuiIcon type={getStatIcon(v.diff)} /> {removeMinus(v.amountComparePercentage)}%
                        </span>
                    </EuiTextColor>
                </EuiStat>
            </EuiPanel>
        ))
    }

    const ViewStatSectionItemExpensesAmount = () => useMemo(
        () => {
            return dataMonthlyExpenses?.dsMonthlyItems?.length > 0 && <div className='grid grid-cols-3 gap-2'>
                {statItemExpensesAmount()}
            </div>
        },
        [dataMonthlyExpenses],
    );

    const ViewStatSectionItemExpenses = () => useMemo(
        () => {
            return dataMonthlyExpenses?.dsMonthlyItems?.length > 0 && <div className='grid grid-cols-3 gap-2'>
                {statItemExpenses()}
            </div>
        },
        [dataMonthlyExpenses],
    );

    const ViewStatSectionSubItemExpenses = () => useMemo(
        () => {
            return dataMonthlyExpenses?.dsMonthlySubItems?.length > 0 && <div className='grid grid-cols-3 gap-2'>
                {statSubItemExpenses()}
            </div>
        },
        [dataMonthlyExpenses],
    );

    const statCredit = () => (
        <EuiStat
            title={dataMonthlyCurrent.credit?.toLocaleString()}
            description=
            {
                <span className='text-[#22c55e]'>Credit</span>
            }
            textAlign="left"
        >
            <EuiTextColor color={getStatColor(dataMonthlyCurrent.creditCompare, true)}>
                <span>
                    <EuiIcon type={getStatIcon(dataMonthlyCurrent.creditCompare)} /> {removeMinus(dataMonthlyCurrent.creditCompare)}%
                </span>
            </EuiTextColor>
        </EuiStat>
    )

    const statDebit = () => (
        <EuiStat
            title={dataMonthlyCurrent.debit?.toLocaleString()}
            description=
            {
                <span className='text-[#ef4444]'>Debit</span>
            }
            textAlign="left"
        >
            <EuiTextColor color={getStatColor(dataMonthlyCurrent.debitCompare, false)}>
                <span>
                    <EuiIcon type={getStatIcon(dataMonthlyCurrent.debitCompare)} /> {removeMinus(dataMonthlyCurrent.debitCompare)}%
                </span>
            </EuiTextColor>
        </EuiStat>
    )

    const ViewMainStatSection = () => useMemo(
        () => {
            return dataMonthlyCurrent && <div>
                <EuiPanel hasBorder={true}>
                    <div className='flex flex-row gap-20'>
                        {statCredit()}
                        {statDebit()}
                    </div>
                </EuiPanel>
            </div>
        },
        [dataMonthlyCurrent],
    );

    const selectionSection = () => (
        <EuiPanel hasBorder={true}>

            <div className='flex flex-row gap-2'>
                <EuiDatePicker preventOpenOnFocus={true} dateFormat="YYYY/MM" name="date" selected={date} onChange={(v) => { setdate(v); }} />

                <EuiFieldNumber
                    name="period"
                    placeholder="period"
                    value={period}
                    onChange={(e) => { setperiod(+e.target.value); }}
                    aria-label="Use aria labels when no actual label is in use"
                />
            </div>
        </EuiPanel >
    )

    const ViewSummarySection = () => useMemo(
        () => {
            return dataMonthlyPeriod.length > 0 && <EuiPanel hasBorder={true}>
                <div className='flex flex-row gap-2'>
                    {summaryCards()}
                </div>
            </EuiPanel>
        },
        [dataMonthlyPeriod],
    );

    const summaryCards = () => (
        dataMonthlyPeriod.map((v, i) => (
            <EuiCard
                icon={< EuiIcon size="xl" type="logoLogging" />}
                title={v.yearMonth}
                display="plain"
                hasBorder
                description={
                    <>
                        <p>
                            <div className='flex flex-col gap-1 whitespace-break-spaces'>
                                <span className='text-[#22c55e]'>{<EuiIcon type="importAction" />} {v.credit.toLocaleString()}</span>
                                <span className='text-[#ef4444]'>{<EuiIcon type="exportAction" />} {v.debit.toLocaleString()}</span>
                                <span className='text-[#eab308]'>{<EuiIcon type="grab" />} {v.remain.toLocaleString()}</span>

                                <span className={`text-[${getUsageCompareColor(v.usageCompare)}] pt-2`}>
                                    {<EuiIcon type={getUsageCompareIcon(v.usageCompare)} />} {removeMinus(v.usageCompare)}%
                                </span>
                            </div>
                        </p>
                        <EuiProgress
                            valueText={true}
                            color={getUsageColor(v.usage)}
                            value={v.usage}
                            max={100}
                            size="m"
                        />
                    </>
                }
            />
        ))
    )

    const getStatColor = (value, isCredit) => {
        if (isCredit)
            return value > 0 ? 'success' : 'danger'
        else
            return value > 0 ? 'danger' : 'success'
    }

    const getStatIcon = (value) => {
        return value > 0 ? 'sortUp' : 'sortDown'
    }

    const removeMinus = (value) => {
        if (value == null) return;
        return value.toString().replace('-', '');
    }

    const getUsageCompareColor = (usageCompare) => {
        return usageCompare > 0 ? '#ef4444' : '#22c55e'
    }

    const getUsageCompareIcon = (usageCompare) => {
        return usageCompare > 0 ? 'arrowUp' : 'arrowDown'
    }

    const getUsageColor = (usage) => {
        if (usage >= 0 && usage <= 50)
            return '#22c55e'
        else if (usage >= 51 && usage <= 75)
            return '#eab308'
        else if (usage >= 76 && usage <= 99)
            return '#f97316'
        else
            return '#ef4444'
    }

    const columnsCommitment = [
        {
            field: 'itemName',
            name: 'Name',
            align: 'center',
            truncateText: true,
            mobileOptions: {
                show: false,
                align: 'center'
            },
        },
        {
            field: 'desc',
            name: 'Desc',
            align: 'center',
            truncateText: true,
            mobileOptions: {
                show: false,
                align: 'center'
            },
        },
        {
            field: 'amount',
            name: 'Amount',
            align: 'center',
            truncateText: true,
            render: (amount) =>
                amount.toFixed(2),
            footer: (data) => {
                return (
                    <span>{data.items.reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
                );
            },
            mobileOptions: {
                show: false,
                align: 'right'
            },
        },
    ]

    const columnsCommitmentOther = [
        {
            field: 'itemName',
            name: 'Name',
            align: 'center',
            truncateText: true,
            mobileOptions: {
                show: false,
                align: 'center'
            },
        },
        {
            field: 'amount',
            name: 'Amount',
            align: 'center',
            truncateText: true,
            render: (amount) =>
                amount.toFixed(2),
            footer: (asd) => {
                return (
                    <span>{asd.items.reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
                );
            },
            mobileOptions: {
                show: false,
                align: 'right'
            },
        },
    ]

    const columnsTodo = [
        {
            field: 'name',
            name: 'Name',
            truncateText: true,
            mobileOptions: {
                show: false,
            },
        },
        {
            field: 'description',
            name: 'Desc',
            truncateText: true,
            mobileOptions: {
                show: false,
            },
        },
        {
            id: 'status',
            name: 'Status',
            mobileOptions: {
                show: false,
            },
            render: (v) => (
                <EuiBadge color={v.status == 1 ? 'success' : 'warning'}>{v.status == 1 ? 'Done' : 'Pending'}</EuiBadge>

            ),
        }
    ]

    useEffect(() => {
        getDSMonthlyPeriodCreditDebit();
        getDSMonthlyItemExpenses();
        getDSMonthlyCommitmentAndOther();
        getTodolist();
    }, [date]);

    return (
        <div className='dark:bg-secondary-dark-bg m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl'>
            <Header category='Page' title='Dashboard' />

            <div className='flex flex-col'>
                <EuiPanel>
                    {selectionSection()}
                </EuiPanel>

                <EuiPanel>
                    {ViewSummarySection()}
                </EuiPanel>

                <EuiPanel>
                    {ViewMainStatSection()}
                </EuiPanel>

                <EuiPanel>
                    {ViewStatSectionItemExpensesAmount()}
                </EuiPanel>

                <EuiPanel>
                    {ViewStatSectionItemExpenses()}
                </EuiPanel>

                <EuiPanel>
                    {ViewStatSectionSubItemExpenses()}
                </EuiPanel>

                <EuiPanel>
                    {ViewCardTableSection()}
                </EuiPanel>
            </div>
        </div>

    );
}

export default Ecommerce3