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
    const {
        handleClearToken, token,
        urlgetDSItemWithSubV3,
        urlgetDSTransTypes,
        urldsAccont
    } = useStateContext();
    const navigate = useNavigate();

    const [dsItemsACData, setdsItemsACData] = useState(null);
    const [dsTransTypeData, setdsTransTypeData] = useState(null);
    const [dsAccData, setdsAccData] = useState(null);
    const [dsAccToData, setdsAccToData] = useState(null);

    const [updateDate, setupdateDate] = useState(props.createdDateTime ?? new Date());
    const [name, setname] = useState(props.dsItemName);
    const [desc, setdesc] = useState(props.description);
    const [accId, setaccId] = useState(props.dsAccountID);
    const [accToId, setaccToId] = useState(props.dsAccountToID);
    const [typeId, settypeId] = useState(props.dsTypeID);
    const [amount, setamount] = useState(props.amount);

    const [isTransfer, setisTransfer] = useState(props.dsTypeID == 3);

    const getDSACItems = () => {
        axios
            .get(`${urlgetDSItemWithSubV3}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                let nameList = [];
                response.data.map((v) => {
                    nameList.push(v.name);
                })
                setdsItemsACData(nameList)
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
            .get(`${urlgetDSTransTypes}`, {
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
            .get(`${urldsAccont}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                var activeAcc = response.data.filter(x => x.isActive == true)
                setdsAccData(activeAcc)
                setdsAccToData(activeAcc.filter(x => x.id != accId));
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

    const handleName2 = (e) => {
        setname(e.target.value);
    }

    const handleDesc = (e) => {
        setdesc(e.target.value);
    }

    const handleTypeId = (e) => {
        settypeId(e.target.value);
        setisTransfer(e.target.value == 3)
        // refAccId.value = null;

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

    let refAccId;
    let refTypeId;
    let refUpdateDate;

    useEffect(() => {
        console.log(props);
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
                        value={accToId}
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