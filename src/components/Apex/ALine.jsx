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

function ALine() {

    const { handleClearToken, token, dsTrans, urlgetDSYearCreditDebitDiff } = useStateContext();

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
            series: [
                {
                    name: "Credit",
                    // data: dataValue.credit
                    data: dsYearCreditDebitDiff.map(x => x.credit)
                },
                {
                    name: "Debit",
                    // data: dataValue.debit
                    data: dsYearCreditDebitDiff.map(x => x.debit)
                }
            ],
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
            colors: ['#3ffc00', '#ff0019'],
            dataLabels: {
                enabled: true,
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
                // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                categories: dsYearCreditDebitDiff.map(x => x.yearMonth),
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
                    type="line"
                    width="800"
                />
            </div>
        </EuiCard>
    );
}
;
export default ALine;

