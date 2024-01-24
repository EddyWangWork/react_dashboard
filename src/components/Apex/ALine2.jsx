import {
    EuiCard,
    EuiIcon,
    EuiSelect
} from '@elastic/eui';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';

function ALine2() {

    const {
        handleClearToken, token, dsTrans, urlgetDSYearExpenses
    } = useStateContext();

    const [dsYearExpensesItems, setdsYearExpensesItems] = useState([]);
    const [dsYearExpensesDetail, setdsYearExpensesDetail] = useState([{ name: '', data: [] }]);
    const [options, setoptions] = useState([]);
    const [year, setyear] = useState(options[0]?.value);

    const navigate = useNavigate();

    const getDSYearExpenses = (year) => {
        axios
            .get(`${urlgetDSYearExpenses}?&year=${year}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                var yearExpensesDetailList = [];
                response.data.dsYearDetails.map(x => yearExpensesDetailList.push({ name: x.yearMonth, data: x.amount }));
                setdsYearExpensesDetail(yearExpensesDetailList);
                setdsYearExpensesItems(response.data.dsItemNames);
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

    const getOptions = () => {
        var optionsDSYear = [...new Set(dsTrans.map(q => new moment(q.createdDateTime).format('YYYY')))];
        optionsDSYear = optionsDSYear.sort((a, b) => b - a);
        var optionList = [];
        optionsDSYear.map((v) => {
            optionList.push({ value: +v, text: v })
        })

        setoptions(optionList);
        getDSYearExpenses(optionList[0].value);
    }

    const onChange = (e) => {
        setyear(e.target.value);
        getDSYearExpenses(e.target.value);
    };

    let chartOptions = {
        options: {
            series: dsYearExpensesDetail,
            chart: {
                height: 350,
                type: 'line',
                dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                },
                toolbar: {
                    show: false
                }
            },
            // colors: ['#3ffc00', '#ff0019'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth'
            },
            title: {
                text: 'Average High & Low Temperature',
                align: 'left'
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
            },
            markers: {
                size: 1
            },
            xaxis: {
                categories: dsYearExpensesItems,
                title: {
                    text: 'Month'
                }
            },
            yaxis: {
                title: {
                    text: 'Temperature'
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
            }
        },
    };

    useEffect(() => {
        if (dsTrans.length > 0)
            getOptions();

    }, [dsTrans]);

    return (
        <EuiCard
            icon={<EuiIcon size="xxl" type="dashboardApp" />}
            title=
            {
                <div class="flex justify-center">
                    <EuiSelect
                        options={options}
                        value={year}
                        onChange={(e) => onChange(e)}
                        aria-label="Use aria labels when no actual label is in use"
                    />
                </div>
            }
            betaBadgeProps={{
                label: 'Beta',
                tooltipContent:
                    'This module is not GA. Please help us by reporting any bugs.',
            }}
        >
            <div class="flex justify-center">
                <Chart
                    options={chartOptions.options}
                    series={chartOptions.options.series}
                    type="line"
                    width="750"
                />
            </div>
        </EuiCard>
    );
}
;
export default ALine2;

