import {
    EuiCard,
    EuiIcon,
    EuiSelect,
    EuiText
} from '@elastic/eui';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';

function ALine2() {

    const {
        handleClearToken, token, handleLogin, localhostUrl,
        urlgetDSYearExpenses
    } = useStateContext();

    const [dsYearExpenses, setdsYearExpenses] = useState({});
    const [dsYearExpensesItems, setdsYearExpensesItems] = useState([]);
    const [dsYearExpensesDetail, setdsYearExpensesDetail] = useState([{ name: '', data: [] }]);

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
                var ssss = [];
                response.data.dsYearDetails.map(x => ssss.push({ name: x.yearMonth, data: x.amount }));
                setdsYearExpensesDetail(ssss);
                setdsYearExpensesItems(response.data.dsItemNames);
                setdsYearExpenses(response.data);
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

    const options = [
        { value: 2020, text: '2020' },
        { value: 2021, text: '2021' },
        { value: 2022, text: '2022' },
        { value: 2023, text: '2023' },
    ];

    const [year, setyear] = useState(options[0].value);

    const onChange = (e) => {
        setyear(e.target.value);
        getDSYearExpenses(e.target.value);
    };

    const ecardLine2 = () => {
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
                {/* <div class="flex justify-center"> */}
                <div>
                    <Chart
                        options={chartOptions.options}
                        series={chartOptions.options.series}
                        type="line"
                        width="750"
                    />
                </div>
            </EuiCard>
        )
    }

    useEffect(() => {
        getDSYearExpenses(options[0].value);
    }, []);

    return (
        ecardLine2()
    );
}
;
export default ALine2;

