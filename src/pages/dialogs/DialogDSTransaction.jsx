import React, { useEffect, useState, ChangeEvent, useRef, useReducer } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextBoxComponent, FormValidator, FormValidatorModel, NumericTextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent, DropDownTreeComponent, AutoCompleteComponent } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { format, parseISO } from 'date-fns'

import { useStateContext } from '../../contexts/ContextProvider';

const DialogDSTransaction = ({ props }) => {
    const { handleClearToken, isLogin, token, handleLogin } = useStateContext();
    const navigate = useNavigate();

    const [dsItemsTvData, setdsItemsTvData] = useState(null);
    const [dsItemsACData, setdsItemsACData] = useState(null);
    const [dsTransTypeData, setdsTransTypeData] = useState(null);
    const [dsAccData, setdsAccData] = useState(null);


    const [updateDate, setupdateDate] = useState(props.updateDate ?? new Date());
    const [name, setname] = useState(props.name);
    const [desc, setdesc] = useState(props.description);
    const [accId, setaccId] = useState(props.dsAccountId);
    const [accToId, setaccToId] = useState(null);
    const [typeId, settypeId] = useState(props.type);
    const [amount, setamount] = useState(props.amount);

    const [isTransfer, setisTransfer] = useState(false);
    const [dsAccToData, setdsAccToData] = useState(null);

    const getDSTvItems = () => {
        axios
            .get(`http://localhost:5000/api/dsitemsubcategory/getDSItemsCategoryWithSubV3`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                setdsItemsTvData(response.data)
            })
            .catch((err) => {
                console.log(err);
                console.log(err.response.status);
                if (err.response.status == 401) {
                    handleClearToken();
                    navigate('/login', { replace: true });
                }
            });
    }

    const getDSACItems = () => {
        axios
            .get(`http://localhost:5000/api/dsitemsubcategory/getDSItemsCategoryWithSubV3`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)

                var lisss = [];

                response.data.map((d, i) => {
                    d.dsItemSubCategories.map((dd, ii) => {
                        lisss.push(`${d.name}|${dd.name}`);
                    })
                })

                setdsItemsACData(lisss)
            })
            .catch((err) => {
                console.log(err);
                console.log(err.response.status);
                if (err.response.status == 401) {
                    handleClearToken();
                    navigate('/login', { replace: true });
                }
            });
    }

    const GetDSTransactionTypes = () => {
        axios
            .get(`http://localhost:5000/api/dstransactions/GetDSTransactionTypes`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                var res = response.data.filter(x => x.id != 4)
                setdsTransTypeData(res)
            })
            .catch((err) => {
                console.log(err);
                console.log(err.response.status);
                if (err.response.status == 401) {
                    handleClearToken();
                    navigate('/login', { replace: true });
                }
            });
    }

    const getdsaccounts = () => {
        axios
            .get(`http://localhost:5000/api/dsaccounts/getdsaccounts`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                var activeAcc = response.data.filter(x => x.isActive == true)
                setdsAccData(activeAcc)
            })
            .catch((err) => {
                console.log(err);
                console.log(err.response.status);
                if (err.response.status == 401) {
                    handleClearToken();
                    navigate('/login', { replace: true });
                }
            });
    }

    const handleUpdateDate = (e) => {
        setupdateDate(e.target.value);
    }

    const handleName = (e) => {
        var name;
        if (e.itemData.parentID) {
            var parentName = dsItemsTvData.filter(x => x.id == e.itemData.parentID)[0].name
            var childName = `${e.itemData.text}`
            name = `${parentName}|${childName}`
        }
        else {
            var childName = `${e.itemData.text}`
            name = `${childName}`
        }
        console.log(name);
        setname(name);
    }

    const handleName2 = (e) => {
        setname(e.target.value);
    }

    const handleDesc = (e) => {
        setdesc(e.target.value);
    }

    const handleTypeId = (e) => {
        settypeId(e.target.value);
        setisTransfer(e.target.value == 3)
        refAccId.value = null;

        console.log(e.target.value == 1)
        setTypeColor(e.target.value);
    }

    const setTypeColor = (v) => {
        if (v == 1) {
            refTypeId.element.style.color = 'green';
        } else if (v == 2) {
            refTypeId.element.style.color = 'red';
        } else {
            refTypeId.element.style.color = 'blue';
        }
    }

    const handleAccId = (e) => {
        setaccId(e.target.value);
        if (isTransfer) {
            setdsAccToData(dsAccData.filter(x => x.id != e.target.value));
        }
    }

    const handleAccToId = (e) => {
        setaccToId(e.target.value);
    }

    const handleAmount = (e) => {
        setamount(e.target.value);
    }

    const dsTransTypefields = { text: 'name', value: 'id' };
    const dsAccfields = { text: 'name', value: 'id' };
    const dsItemfields = { dataSource: dsItemsTvData, value: 'id', text: 'name', child: 'dsItemSubCategories' };

    let refAccId;
    let refTypeId;
    let refUpdateDate;

    useEffect(() => {
        getDSTvItems();
        getDSACItems();
        getdsaccounts();
        GetDSTransactionTypes();
        setTypeColor(typeId);
        refUpdateDate.focusIn();
    }, []);

    return (
        <div>
            <div className="row custom-margin custom-padding-5">
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <DatePickerComponent
                        id='updateDate'
                        ref={(x) => { refUpdateDate = x; }}
                        placeholder="Date"
                        floatLabelType="Auto"
                        strictMode={false}
                        format='dd/MM/yyyy'
                        value={updateDate}
                        onChange={handleUpdateDate}
                    >
                    </DatePickerComponent>
                </div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <DropDownListComponent
                        id='typeId'
                        ref={(x) => { refTypeId = x; }}
                        placeholder="Type"
                        floatLabelType="Auto"
                        dataSource={dsTransTypeData}
                        fields={dsTransTypefields}
                        onChange={handleTypeId}
                        value={typeId}
                    />
                </div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <DropDownListComponent
                        id='accId'
                        ref={(x) => { refAccId = x; }}
                        placeholder="Account"
                        floatLabelType="Auto"
                        dataSource={dsAccData}
                        fields={dsAccfields}
                        onChange={handleAccId}
                        value={accId}
                    />
                </div>
                {isTransfer && <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <DropDownListComponent
                        id='accToId'
                        placeholder="To Account"
                        floatLabelType="Auto"
                        dataSource={dsAccToData}
                        fields={dsAccfields}
                        onChange={handleAccToId}
                    />
                </div>}
                {!isTransfer && <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <AutoCompleteComponent
                        id="nameFull"
                        dataSource={dsItemsACData}
                        placeholder="Name"
                        onChange={handleName2}
                        value={name}
                    />
                </div>}
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <TextBoxComponent
                        id='desc'
                        placeholder="Description"
                        floatLabelType="Auto"
                        onChange={handleDesc}
                        value={desc}
                    />
                </div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                    <NumericTextBoxComponent
                        id='amount'
                        placeholder="Amount"
                        floatLabelType="Auto"
                        onChange={handleAmount}
                        value={amount}
                    />
                </div>
            </div>
        </div>
    )
}

export default DialogDSTransaction