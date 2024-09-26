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

function ABar() {

    const { handleClearToken, token, dsTrans, urlgetDSYearCreditDebitDiff, screenSize, activeMenu } = useStateContext();

    const [dsYearCreditDebitDiff, setdsYearCreditDebitDiff] = useState([]);
    const [options, setoptions] = useState([]);
    const [year, setyear] = useState(options[0]?.value);

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

    const getOptions = () => {
        var optionsDSYear = [...new Set(dsTrans.map(q => new moment(q.createdDateTime).format('YYYY')))];
        optionsDSYear = optionsDSYear.sort((a, b) => b - a);
        var optionList = [];
        optionsDSYear.map((v) => {
            optionList.push({ value: +v, text: v })
        })

        setoptions(optionList);
        getDSYearCreditDebitDiff(optionList[0].value);
    }

    const onChange = (e) => {
        setyear(e.target.value);
        getDSYearCreditDebitDiff(e.target.value);
    };

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
            colors: ['#3ffc00', '#ff0019', '#eab308'],
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
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
                        width={!activeMenu ? (screenSize - 120) : (screenSize - 600)}
                    />
                </div>
            </EuiCard>
        )
    }

    useEffect(() => {
        if (dsTrans.length > 0)
            getOptions();
    }, [dsTrans]);

    return (
        ecardBar()
    );
}
;
export default ABar;

