import {
    EuiCard,
    EuiIcon,
    EuiSelect,
    EuiText
} from '@elastic/eui';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';

function ADonut() {

    const { handleClearToken, token, dsTrans, urlgetDSMonthlyExpenses, screenSize, activeMenu } = useStateContext();

    const [dsMonthlyExpenses, setdsMonthlyExpenses] = useState([]);
    const [options, setoptions] = useState([]);
    const [yearMonth, setyearMonth] = useState(options[0]?.value);

    const navigate = useNavigate();

    const getDSMonthlyExpenses = (req) => {
        var vYearMonth = req.split('-');

        axios
            .get(`${urlgetDSMonthlyExpenses}?&year=${vYearMonth[0]}&month=${vYearMonth[1]}`, {
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

    const getOptions = () => {
        var optionsDSYear = [...new Set(dsTrans.map(q => new moment(q.createdDateTime).format('YYYY-MM')))];
        optionsDSYear = optionsDSYear.sort((a, b) => b - a);
        console.log(optionsDSYear);
        var optionList = [];
        optionsDSYear.map((v) => {
            optionList.push({ value: v, text: v })
        })

        setoptions(optionList);
        getDSMonthlyExpenses(optionList[0].value);
    }

    const onChange = (e) => {
        setyearMonth(e.target.value);
        getDSMonthlyExpenses(e.target.value);
    };

    let chartOptions = {
        options: {
            series: dsMonthlyExpenses.map(x => x.amount),
            labels: dsMonthlyExpenses.map(x => x.dsItemName),
            legend: {
                position: "left",
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

    const ecardDonut = () => {
        return (
            <EuiCard
                icon={<EuiIcon size="xxl" type="dashboardApp" />}
                title=
                {
                    <div class="flex justify-center ...">
                        <EuiSelect
                            options={options}
                            value={yearMonth}
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
                            width={!activeMenu ? (screenSize - 120) : (screenSize - 600)}
                        />
                    </div>
                </EuiText>
            </EuiCard>
        )
    }

    useEffect(() => {
        if (dsTrans.length > 0)
            getOptions();
    }, [dsTrans]);

    return (
        ecardDonut()
    );
}
;
export default ADonut;

