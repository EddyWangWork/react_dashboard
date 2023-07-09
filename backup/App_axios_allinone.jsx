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
        console.log(error);
        dangerShow(`${error.message}: ${error.response?.data}`);
      });
  }

  function callApiPost() {
    const SERVICE_URI = 'https://localhost:7069/DS';

    const reqC = {
      DSTypeID: 1,
      DSAccountID: 1,
      DSAccountToID: 0,
      DSItemID: 0,
      DSItemSubID: 1,
      Description: 'reward',
      Amount: 200,
    };

    const reqD = {
      DSTypeID: 2,
      DSAccountID: 1,
      DSAccountToID: 0,
      DSItemID: 0,
      DSItemSubID: 2,
      Description: 'steamboat',
      Amount: 55,
    };

    const reqT = {
      DSTypeID: 3,
      DSAccountID: 2,
      DSAccountToID: 1,
      DSItemID: 0,
      DSItemSubID: 0,
      Description: 'month',
      Amount: 150,
    };

    axios
      .post(`${SERVICE_URI}`, reqD)
      .then((response) => {
        console.log(response);
        setData(response.data);
        successShow();
      })
      .catch(error => {
        dangerShow(error.response.data);
        getRecords();
      });
  }

  function callApiPut(id) {
    const SERVICE_URI = 'https://localhost:7069/DS';

    const reqD = {
      DSTypeID: 2,
      DSAccountID: 2,
      DSAccountToID: 0,
      DSItemID: 1,
      DSItemSubID: 0,
      Description: 'kfccc',
      Amount: 28,
    };

    const reqTptm = {
      DSTypeID: 3,
      DSAccountID: 2,
      DSAccountToID: 1,
      DSItemID: 0,
      DSItemSubID: 0,
      Description: 'pbe to may',
      Amount: 250,
    };

    const reqTmtp = {
      DSTypeID: 3,
      DSAccountID: 1,
      DSAccountToID: 2,
      DSItemID: 0,
      DSItemSubID: 0,
      Description: 'may to pbe',
      Amount: 350,
    };

    axios
      .put(`${SERVICE_URI}?id=${id}`, reqTmtp)
      .then((response) => {
        setData(response.data);
        successShow();
      })
      .catch(error => {
        dangerShow(error.response.data);
        getRecords();
      });
  }

  function getTransactionGroupStat(dstypeid) {
    const SERVICE_URI = `https://localhost:7069/DS/GetTransactionGroupStat?dstypeid=${dstypeid}`;

    axios
      .get(`${SERVICE_URI}`)
      .then((response) => {
        console.log(response);
        //setData(response.data);
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