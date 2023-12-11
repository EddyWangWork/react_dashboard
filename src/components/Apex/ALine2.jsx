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

    const dataValue = {
        name: [
            "Accessory",
            "Aeon",
            "Beauty",
            "Car",
            "Cleaner",
            "Commitment",
            "Computer",
            "Daiso",
            "DIY",
            "Entertainment",
            "EWallet",
            "Family",
            "Food",
            "Friends",
            "Government",
            "Grocery",
            "Ikea",
            "Jnt",
            "Kitchen",
            "Lazada",
            "Medicine",
            "Motor",
            "Muji",
            "Other",
            "Petrol",
            "Shopee",
            "Sport",
            "Transport",
            "Unknown",
            "Watson",
            "Withdraw"
        ],
        jan: [
            33.90,
            0.00,
            59.00,
            0.00,
            179.00,
            3563.83,
            0.00,
            11.80,
            0.00,
            55.00,
            500.00,
            2549.99,
            516.55,
            0.00,
            0.00,
            220.35,
            0.00,
            3000.00,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00,
            357.40,
            140.47,
            0.00,
            0.00,
            0.00,
            0.00,
            91.05,
            2300.00
        ],
        feb: [
            98.00,
            120.50,
            0.00,
            0.00,
            0.00,
            2750.88,
            298.00,
            17.70,
            0.00,
            55.00,
            1100.00,
            100.00,
            221.10,
            0.00,
            0.00,
            200.30,
            0.00,
            2560.62,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00,
            409.37,
            105.78,
            230.80,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00
        ],
        mar: [
            799.00,
            404.95,
            0.00,
            0.00,
            0.00,
            2605.09,
            0.00,
            123.90,
            0.00,
            55.00,
            2200.00,
            1007.25,
            70.90,
            0.00,
            0.00,
            85.90,
            632.40,
            4314.45,
            0.00,
            280.81,
            0.00,
            0.00,
            0.00,
            246.61,
            73.51,
            0.00,
            0.00,
            0.00,
            0.00,
            46.05,
            0.00
        ],
        apr: [
            74.00,
            180.05,
            219.60,
            0.00,
            0.00,
            3370.98,
            0.00,
            0.00,
            0.00,
            55.00,
            1850.00,
            199.00,
            596.95,
            1000.00,
            0.00,
            298.40,
            0.00,
            1500.00,
            0.00,
            0.00,
            0.00,
            1220.00,
            0.00,
            498.50,
            231.18,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00
        ],
        may: [
            0.00,
            0.00,
            243.00,
            0.00,
            0.00,
            2676.53,
            0.00,
            0.00,
            0.00,
            492.88,
            2104.00,
            1721.50,
            385.78,
            0.00,
            0.00,
            49.05,
            0.00,
            4500.00,
            0.00,
            0.00,
            149.60,
            120.00,
            0.00,
            115.80,
            170.64,
            596.96,
            0.00,
            794.24,
            0.00,
            0.00,
            0.00
        ],
        jun: [
            0.00,
            0.00,
            148.00,
            0.00,
            0.00,
            3573.03,
            0.00,
            29.50,
            63.70,
            55.00,
            1697.25,
            3188.66,
            809.25,
            0.00,
            275.60,
            499.05,
            0.00,
            0.00,
            0.00,
            0.00,
            115.95,
            0.00,
            0.00,
            223.60,
            132.59,
            92.30,
            40.00,
            0.00,
            0.00,
            70.10,
            0.00
        ],
        jul: [
            0.00,
            0.00,
            0.00,
            0.00,
            0.00,
            3168.72,
            0.00,
            0.00,
            21.60,
            55.00,
            600.00,
            906.42,
            345.90,
            0.00,
            0.00,
            878.60,
            114.30,
            0.00,
            12.00,
            0.00,
            0.00,
            0.00,
            0.00,
            151.55,
            171.74,
            89.71,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00
        ],
        aug: [
            640.00,
            0.00,
            0.00,
            355.00,
            0.00,
            4725.91,
            0.00,
            0.00,
            51.50,
            55.00,
            700.00,
            594.00,
            707.55,
            0.00,
            0.00,
            539.05,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00,
            318.70,
            82.44,
            128.15,
            0.00,
            0.00,
            0.30,
            0.00,
            0.00
        ],
        sep: [
            937.90,
            0.00,
            304.69,
            0.00,
            0.00,
            4023.83,
            0.00,
            0.00,
            11.30,
            2241.94,
            900.00,
            888.88,
            1149.25,
            0.00,
            275.60,
            66.80,
            0.00,
            0.00,
            0.00,
            0.00,
            99.00,
            0.00,
            0.00,
            164.90,
            116.67,
            94.13,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00
        ],
        oct: [
            0.00,
            0.00,
            38.00,
            0.00,
            0.00,
            4212.31,
            0.00,
            17.70,
            23.50,
            55.00,
            1100.00,
            189.00,
            279.05,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00,
            546.00,
            116.80,
            62.75,
            178.33,
            182.06,
            0.00,
            0.00,
            0.00,
            0.00,
            700.00
        ],
        nov: [
            0.00,
            0.00,
            0.00,
            762.80,
            0.00,
            3516.31,
            0.00,
            0.00,
            0.00,
            0.00,
            200.00,
            210.00,
            59.00,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00,
            8.00,
            6.33,
            0.00,
            0.00,
            0.00,
            0.00,
            0.00,
            200.00
        ]
    }

    let chartOptions = {
        options: {
            // series: [
            //     {
            //         name: "jan",
            //         data: dataValue.jan
            //     },
            //     {
            //         name: "feb",
            //         data: dataValue.feb
            //     },
            //     {
            //         name: "mar",
            //         data: dataValue.mar
            //     },
            //     {
            //         name: "apr",
            //         data: dataValue.apr
            //     },
            //     {
            //         name: "may",
            //         data: dataValue.may
            //     },
            //     {
            //         name: "jun",
            //         data: dataValue.jun
            //     },
            //     {
            //         name: "jul",
            //         data: dataValue.jul
            //     },
            //     {
            //         name: "aug",
            //         data: dataValue.aug
            //     },
            //     {
            //         name: "sep",
            //         data: dataValue.sep
            //     },
            //     {
            //         name: "oct",
            //         data: dataValue.oct
            //     },
            //     {
            //         name: "nov",
            //         data: dataValue.nov
            //     }
            // ],
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
                // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
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

