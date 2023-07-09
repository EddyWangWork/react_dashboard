import { AccumulationChartComponent, AccumulationSeriesCollectionDirective, PieSeries, AccumulationSeriesDirective, Inject, AccumulationDataLabel } from '@syncfusion/ej2-react-charts';
import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { ColumnDirective, ColumnsDirective, GridComponent } from '@syncfusion/ej2-react-grids';
import { Query } from '@syncfusion/ej2-data';
import { ToastUtility } from '@syncfusion/ej2-react-notifications';
import axios from "axios";
import * as React from 'react';
import { useState } from "react";

function App() {
  const [data, setData] = useState("");

  const datalabel = {
    visible: true, position: 'Inside', maxWidth: 100, textWrap: 'Wrap',
    name: 'dsItemName', enableRotation: true
  };

  function successShow() {
    ToastUtility.show('Load successfully', 'Success', 2000);
  }

  function dangerShow(e) {
    ToastUtility.show(e, 'Error', 2000);
  }

  function getTransactionGroupStat(dstypeid) {
    const SERVICE_URI = `https://localhost:7069/DS/GetTransactionGroupStat?dstypeid=${dstypeid}`;

    axios
      .get(`${SERVICE_URI}`)
      .then((response) => {
        console.log(response);
        setData(response.data);
        successShow();
      })
      .catch(error => {
        console.log(error);
        dangerShow(`${error.message}: ${error.response?.data}`);
      });
  }

  React.useEffect(() => {
    //callApiPost();
    //callApiPut(9);
    //getRecords();
    getTransactionGroupStat(2);
  }, [])

  const data2 = [
    { x: 'Chrome', y: 100, text: 'Chrome (100M)', tooltipMappingName: '40%' },
    { x: 'UC Browser', y: 40, text: 'UC Browser (40M)<br>16%', tooltipMappingName: '16%' },
    { x: 'Opera', y: 30, text: 'Opera (30M)<br>12%', tooltipMappingName: '12%' },
    { x: 'Safari', y: 30, text: 'Safari (30M)<br>12%', tooltipMappingName: '12%' },
    { x: 'Firefox', y: 25, text: 'Firefox (25M)<br>10%', tooltipMappingName: '10%' },
    { x: 'Others', y: 25, text: 'Others (25M)<br>10%', tooltipMappingName: '10%' }
  ];

  const data3 = [
    { dsItemName: 'foods|lunch', amount: 146 },
    { dsItemName: 'petrol', amount: 50 },
    { dsItemName: 'foods|dinner', amount: 15 }
  ];

  return <AccumulationChartComponent id='charts' enableSmartLabels='true'>
    <Inject services={[AccumulationDataLabel, PieSeries]} />
    <AccumulationSeriesCollectionDirective>
      <AccumulationSeriesDirective dataSource={data} xName='dsItemName' yName='amount' dataLabel={datalabel}>
      </AccumulationSeriesDirective>
    </AccumulationSeriesCollectionDirective>
  </AccumulationChartComponent>;
}
;
export default App;