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
    EuiTextColor,
    EuiButtonEmpty,
    EuiCollapsibleNavGroup
} from '@elastic/eui';
import axios from 'axios';
import moment from 'moment';
import { React, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components';

import { useStateContext } from '../contexts/ContextProvider';

const Ecommerce3 = () => {

    const {
        screenSize, screenSizeBody,
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

    const isSmallScreen = screenSize <= 470;

    const query = `year=${date.year()}&month=${date.month() + 1}&monthDuration=${period}`
    const queryByItem = `name=commitment&year=${date.year()}&month=${date.month() + 1}`
    const getDSMonthlyPeriodCreditDebitReq = {
        year: date.year(),
        Month: date.month() + 1,
        MonthDuration: period,
        IsIncludeCredit: true,
        CreditIds: [19],
        IsIncludeDebit: true,
        DebitIds: []
    }
    const getDSMonthlyCommitmentAndOtherReq = {
        year: date.year(),
        Month: date.month() + 1,
        DebitIds: []
    }

    const getDSMonthlyPeriodCreditDebit = () => {
        axios
            .post(urlgetDSMonthlyPeriodCreditDebit, getDSMonthlyPeriodCreditDebitReq, {
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
            .post(urlgetDSMonthlyCommitmentAndOther, getDSMonthlyCommitmentAndOtherReq, {
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

    const selectionSection = () => (
        <EuiPanel hasBorder={true}>

            <div className='grid grid-cols-2 gap-2'>
                <EuiDatePicker preventOpenOnFocus={true} dateFormat="YYYY/MM" name="date" selected={date} onChange={(v) => { setdate(v); }} />

                <EuiFieldNumber
                    name="period"
                    placeholder="period"
                    value={period}
                    onChange={(e) => { setperiod(+e.target.value); }}
                    aria-label="Use aria labels when no actual label is in use"
                />

                <div className='flex flex-row gap-1'>
                    <EuiButtonEmpty onClick={() => { setdate(new moment(date).add(-1, 'months')) }}>Prev</EuiButtonEmpty>
                    <EuiButtonEmpty onClick={() => { setdate(new moment(date).add(1, 'months')) }}>Next</EuiButtonEmpty>
                    <EuiButtonEmpty onClick={() => { setdate(new moment()) }}>Today</EuiButtonEmpty>
                </div>

            </div>
        </EuiPanel >
    )

    const ViewSummarySection = () => useMemo(
        () => {
            return dataMonthlyPeriod.length > 0 && <EuiPanel hasBorder={true}>
                <div className={`${isSmallScreen ? 'flex flex-col' : 'flex flex-row'} gap-2`}>
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

    const ViewMainStatSection = () => useMemo(
        () => {
            return dataMonthlyCurrent && dataMonthlyExpenses != {} && <div>
                <EuiPanel hasBorder={true}>
                    <div className={`${isSmallScreen ? 'flex flex-col gap-7' : 'flex flex-row gap-10'}`}>
                        {statCredit()}
                        {statDebit()}
                        {statCommitment()}
                    </div>
                </EuiPanel>
            </div>
        },
        [dataMonthlyCurrent, dataMonthlyExpenses],
    );

    const statCredit = () => (
        <EuiStat
            title={dataMonthlyCurrent.credit?.toLocaleString()}
            titleSize='s'
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
            titleSize='s'
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

    const statCommitment = () => {
        var dataMonthlyExpensesCommitment = dataMonthlyExpenses?.dsMonthlyItems?.find(x => x.itemName == 'Commitment');

        return dataMonthlyExpensesCommitment && <EuiStat
            title={dataMonthlyExpensesCommitment.amount?.toLocaleString()}
            titleSize='s'
            description=
            {
                <span className='text-[#ef4444]'>Commitment</span>
            }
            textAlign="left"
        >
            <EuiTextColor color={getStatColor(dataMonthlyExpensesCommitment.amountComparePercentage, false)}>
                <span>
                    <EuiIcon type={getStatIcon(dataMonthlyExpensesCommitment.amountComparePercentage)} /> {removeMinus(dataMonthlyExpensesCommitment.amountComparePercentage)}%
                </span>
            </EuiTextColor>
        </EuiStat>
    }

    const ViewStatSectionItemExpensesAmount = () => useMemo(
        () => {
            return dataMonthlyExpenses?.dsMonthlyItems?.length > 0 &&
                <div className={`${getClassGrid2()} gap-2`}>
                    {statItemExpensesAmount()}
                </div>
        },
        [dataMonthlyExpenses],
    );

    const statItemExpensesAmount = () => {
        return dataMonthlyExpenses.dsMonthlyItems.filter(x => x.amount != 0).map((v, i) => (
            <EuiPanel hasBorder={true}>
                <EuiStat
                    title={navItemsDetail(v.amount.toLocaleString(), v.itemsDetail)}
                    description={v.itemName}
                    textAlign="left"
                >
                </EuiStat>
            </EuiPanel>
        ))
    }

    const navItemsDetail = (amount, itemsDetail) => {
        return <EuiCollapsibleNavGroup
            title={amount}
            titleSize="s"
            isCollapsible={true}
            initialIsOpen={false}
        >
            <>
                {cardItemsDetail(itemsDetail)}
            </>
        </EuiCollapsibleNavGroup>
    }

    const cardItemsDetail = (dataItemsDetail) => {
        return <EuiBasicTable
            tableCaption="Demo of EuiBasicTable"
            items={dataItemsDetail}
            rowHeader="firstName"
            columns={columnsItemsDetail}
            compressed={true}
        />
    }

    const ViewStatSectionItemExpenses = () => useMemo(
        () => {
            return dataMonthlyExpenses?.dsMonthlyItems?.length > 0 && <div className={`${getClassGrid2()} gap-2`}>
                {statItemExpenses()}
            </div>
        },
        [dataMonthlyExpenses],
    );

    const statItemExpenses = () => {
        return dataMonthlyExpenses.dsMonthlyItems.filter(x => x.amountComparePercentage != '0.00').map((v, i) => (
            <EuiPanel hasBorder={true}>
                <EuiStat
                    title={removeMinus(v.diff.toLocaleString())}
                    titleSize='s'
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

    const ViewStatSectionSubItemExpenses = () => useMemo(
        () => {
            return dataMonthlyExpenses?.dsMonthlySubItems?.length > 0 && <div className={`${getClassGrid2()} gap-2`}>
                {statSubItemExpenses()}
            </div>
        },
        [dataMonthlyExpenses],
    );

    const statSubItemExpenses = () => {
        return dataMonthlyExpenses.dsMonthlySubItems.filter(x => x.amountComparePercentage != '0.00').map((v, i) => (
            <EuiPanel hasBorder={true}>
                <EuiStat
                    title={removeMinus(v.diff.toLocaleString())}
                    titleSize='s'
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

    const ViewCardTableSection = () => useMemo(
        () => {
            return dataCommitmentAndOther?.items?.length > 0 && <div className={`${screenSizeBody >= 900 ? 'grid grid-cols-2' : 'grid grid-cols'} gap-2`}>
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

    const getClassGrid = () => {
        console.log(screenSizeBody)
        switch (true) {
            case screenSizeBody >= 1475:
                return 'grid grid-cols-3'
            case screenSizeBody >= 975:
                return 'grid grid-cols-2'
            default:
                return 'grid grid-cols'
        }
    }

    const getClassGrid2 = () => {
        console.log(screenSizeBody)
        switch (true) {
            case screenSizeBody >= 1000:
                return 'grid grid-cols-3'
            case screenSizeBody >= 500:
                return 'grid grid-cols-2'
            default:
                return 'grid grid-cols'
        }
    }

    const columnsCommitment = [
        {
            field: 'itemName',
            name: 'Name',
            align: 'center',
            truncateText: true,
            width: '100%',
            mobileOptions: {
                header: false,
                enlarge: true,
                render: (dataList) => {
                    return <span>{`${dataList.itemName}  ${dataList.desc != '' ? `(${dataList.desc})` : ``}`}</span>
                }
            },
        },
        {
            field: 'desc',
            name: 'Desc',
            align: 'center',
            truncateText: true,
            width: '100%',
            mobileOptions: {
                show: false
            },
        },
        {
            field: 'amount',
            name: 'Amount',
            align: 'center',
            truncateText: true,
            width: '100%',
            render: (amount) =>
                amount.toFixed(2),
            footer: (data) => {
                return (
                    <span>{data.items.reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
                );
            }
        },
    ]

    const columnsCommitmentOther = [
        {
            field: 'itemName',
            name: 'Name',
            align: 'center',
            truncateText: true,
            width: '100%',
            mobileOptions: {
                header: false,
                enlarge: true,
            }
        },
        {
            field: 'amount',
            name: 'Amount',
            align: 'center',
            truncateText: true,
            width: '100%',
            mobileOptions: {
                // header: false,
            },
            render: (amount) =>
                amount.toFixed(2),
            footer: (asd) => {
                return (
                    <span>{asd.items.reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
                );
            },
        },
    ]

    const columnsItemsDetail = [
        {
            field: 'itemName',
            name: 'Name',
            truncateText: true,
            width: '100%',
            mobileOptions: {
                header: false,
                enlarge: true,
                render: (dataList) => {
                    return <span>{`${dataList.itemName}  ${dataList.desc != '' ? `(${dataList.desc})` : ``}`}</span>
                }
            },
        },
        {
            field: 'desc',
            name: 'Desc',
            truncateText: true,
            width: '100%',
            mobileOptions: {
                show: false
            },
        },
        {
            field: 'amount',
            name: 'Amount',
            align: 'center',
            truncateText: true,
            width: '100%',
            render: (amount) =>
                amount.toFixed(2),
            footer: (asd) => {
                return (
                    <span>{asd.items.reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
                );
            }
        }
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
        setdataMonthlyPeriod([]);
        setdataMonthlyCurrent({});
        setdataMonthlyExpenses({});
        setdataCommitmentAndOther({});
        setdataTodolist([]);
        getDSMonthlyPeriodCreditDebit();
        getDSMonthlyItemExpenses();
        getDSMonthlyCommitmentAndOther();
        getTodolist();
    }, [date]);

    return (
        <div className='dark:bg-secondary-dark-bg m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl'>
            <Header category='Page' title='Dashboard' />
            <div className='flex flex-col justify-center'>
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