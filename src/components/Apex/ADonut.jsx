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

function ADonut() {

    const {
        handleClearToken, token, handleLogin, localhostUrl,
        urlgetDSMonthlyExpenses
    } = useStateContext();

    const [dsMonthlyExpenses, setdsMonthlyExpenses] = useState([]);

    const navigate = useNavigate();

    const getDSMonthlyExpenses = (month) => {
        axios
            .get(`${urlgetDSMonthlyExpenses}?&year=2023&month=${month}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                setdsMonthlyExpenses(response.data);
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
            series: dsMonthlyExpenses.map(x => x.amount),
            labels: dsMonthlyExpenses.map(x => x.dsItemName),
            legend: {
                position: "left",
                // horizontalAlign: 'center',
                fontFamily: "Inter, sans-serif",
                fontSize: '11%',
                formatter: function (val, opts) {
                    return val + " - " + opts.w.globals.series[opts.seriesIndex]
                }
            },
            stroke: {
                colors: ["transparent"],
                lineCap: "",
            },
            dataLabels: {
                enabled: true
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontFamily: "Inter, sans-serif",
                                offsetY: 20,
                            },
                            total: {
                                showAlways: true,
                                show: true,
                                label: "Expenses",
                                fontFamily: "Inter, sans-serif",
                                formatter: function (w) {
                                    const sum = w.globals.seriesTotals.reduce((a, b) => {
                                        return a + b
                                    }, 0)
                                    const sum2 = sum.toFixed(2);
                                    return `${sum2}`
                                },
                            },
                            value: {
                                show: true,
                                fontFamily: "Inter, sans-serif",
                                offsetY: -20,
                                formatter: function (value) {
                                    return value
                                },
                            },
                        },
                        size: "80%",
                    },
                },
            }
        },
    };

    const options = [
        { value: '1', text: 'Jan' },
        { value: '2', text: 'Feb' },
        { value: '3', text: 'Mar' },
        { value: '4', text: 'Apr' },
        { value: '5', text: 'May' },
        { value: '6', text: 'Jun' },
        { value: '7', text: 'Jul' },
        { value: '8', text: 'Aug' },
        { value: '9', text: 'Sep' },
        { value: '10', text: 'Oct' },
        { value: '11', text: 'Nov' },
        { value: '12', text: 'Dec' },
    ];

    const [month, setmonth] = useState(options[0].value);

    const onChange = (e) => {
        setmonth(e.target.value);
        getDSMonthlyExpenses(e.target.value);
    };

    const ecardDonut = () => {
        return (
            <EuiCard
                icon={<EuiIcon size="xxl" type="dashboardApp" />}
                title=
                {
                    <div class="flex justify-center ...">
                        <EuiSelect
                            options={options}
                            value={month}
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
                <EuiText size="s">
                    <div class="flex justify-center ...">
                        <Chart
                            options={chartOptions.options}
                            series={chartOptions.options.series}
                            type="donut"
                            width="500"
                        />
                    </div>
                </EuiText>
            </EuiCard>
        )
    }

    useEffect(() => {
        getDSMonthlyExpenses(options[0].value);
    }, []);

    return (
        ecardDonut()
        // <Chart
        //     options={chartOptions.options}
        //     series={chartOptions.options.series}
        //     type="donut"
        //     width="500"
        // />
    );
}
;
export default ADonut;

