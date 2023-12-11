import Chart from "react-apexcharts";

function ALine() {

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
            0
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
        ]
    }

    let chartOptions = {
        options: {
            series: [
                {
                    name: "Credit",
                    data: dataValue.credit
                },
                {
                    name: "Debit",
                    data: dataValue.debit
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
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
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

    return (
        <Chart
            options={chartOptions.options}
            series={chartOptions.options.series}
            type="line"
            width="800"
        />
    );
}
;
export default ALine;

