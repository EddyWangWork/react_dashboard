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

function ABar() {

    const {
        handleClearToken, token, handleLogin, localhostUrl,
        urlgetDSYearCreditDebitDiff
    } = useStateContext();

    const [dsYearCreditDebitDiff, setdsYearCreditDebitDiff] = useState([]);

    const navigate = useNavigate();

    const getDSYearCreditDebitDiff = (year) => {
        axios
            .get(`${urlgetDSYearCreditDebitDiff}?&year=${year}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                setdsYearCreditDebitDiff(response.data);
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

    const dataValue = {
        credit: [
            6266.95,
            12906.95,
            8123.63,
            10290.32,
            1614.87,
            16056.54,
            8003.77,
            7984.51,
            10921.45,
            9489.69,
            0.00
        ],
        debit: [
            13578.34,
            8268.05,
            12945.82,
            11293.66,
            14119.98,
            11013.58,
            6515.54,
            8897.60,
            11274.89,
            7700.50,
            4962.44
        ],
        cashflow: [
            -7311.39,
            4638.90,
            -4822.19,
            -1003.34,
            -12505.11,
            5042.96,
            1488.23,
            -913.09,
            -353.44,
            1789.19,
            -4962.44
        ]
    }

    let chartOptions = {
        options: {
            series: [{
                name: 'Credit',
                data: dsYearCreditDebitDiff.map(x => x.credit)
            }, {
                name: 'Debit',
                data: dsYearCreditDebitDiff.map(x => x.debit)
            }, {
                name: 'Free Cash Flow',
                data: dsYearCreditDebitDiff.map(x => x.diff)
            }],
            chart: {
                type: 'bar',
                height: 350
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Dec'],
                categories: dsYearCreditDebitDiff.map(x => x.yearMonth),
            },
            yaxis: {
                title: {
                    text: '$'
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return "$ " + val
                    }
                }
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
        getDSYearCreditDebitDiff(e.target.value);
    };

    const ecardBar = () => {
        return (
            <EuiCard
                icon={<EuiIcon size="xxl" type="dashboardApp" />}
                title=
                {
                    <div class="flex justify-center ...">
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
                <div class="flex justify-center ...">
                    <Chart
                        options={chartOptions.options}
                        series={chartOptions.options.series}
                        type="bar"
                        width="750"
                    />
                </div>
            </EuiCard>
        )
    }

    useEffect(() => {
        getDSYearCreditDebitDiff(options[0].value);
    }, []);

    return (
        ecardBar()
    );
}
;
export default ABar;

