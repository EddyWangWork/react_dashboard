import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { ColumnDirective, ColumnsDirective, GridComponent } from '@syncfusion/ej2-react-grids';
import { Query } from '@syncfusion/ej2-data';
import { ToastUtility } from '@syncfusion/ej2-react-notifications';
import axios from "axios";
import * as React from 'react';
import { useState } from "react";

function App() {
  const [data, setData] = useState("");

  function successShow() {
    ToastUtility.show('Load successfully', 'Success', 2000);
  }

  function dangerShow(e) {
    ToastUtility.show(e, 'Error', 2000);
  }

  function getRecords() {
    const SERVICE_URI = 'https://localhost:7069/DS/GetDSTransaction';

    axios
      .get(`${SERVICE_URI}`)
      .then((response) => {
        console.log(response);
        setData(response.data);
        successShow();
      })
      .catch(error => {
        dangerShow(error.response.data);
      });
  }

  function callApi() {
    const SERVICE_URI = 'https://localhost:7069/DS';

    const req = {
      DSTypeID: 3,
      DSAccountID: 2,
      DSAccountToID: 1,
      DSItemID: 0,
      DSItemSubID: 0,
      Description: 'Year',
      Amount: 750,
    };

    axios
      .put(`${SERVICE_URI}?id=${3}`, req)
      .then((response) => {
        setData(response.data);
        successShow();
      })
      .catch(error => {
        dangerShow(error.response.data);
        getRecords();
      });
  }

  React.useEffect(() => {
    callApi();
  }, [])

  return <GridComponent dataSource={data}>
    <ColumnsDirective>
      <ColumnDirective field='id' headerText='Order ID' width='50' textAlign="Right" />
      <ColumnDirective field='dsTypeName' headerText='Customer ID' width='100' />
      <ColumnDirective field='dsAccountName' headerText='Ship City' width='100' />
      <ColumnDirective field='dsItemName' headerText='Ship Name' width='100' />
      <ColumnDirective field='description' headerText='Description' width='100' />
      <ColumnDirective field='amount' headerText='Amount' width='100' />
    </ColumnsDirective>
  </GridComponent>;
}
;
export default App;