import React, { useEffect, useState, ChangeEvent, useRef, useReducer } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextBoxComponent, FormValidator, FormValidatorModel } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { format, parseISO } from 'date-fns'

import { useStateContext } from '../../contexts/ContextProvider';

const DialogDSItem = ({ props }) => {
    const {
        handleClearToken, token,
        urlDSItem
    } = useStateContext();
    const navigate = useNavigate();

    let refName;

    const [dsItems, setDSItems] = useState([]);
    const [dsItemName, setDSItemName] = useState(props.name);
    const [dsSubItemName, setDSSubItemName] = useState(props.subName);
    const [dsItemId, setDSItemId] = useState(props.id ?? 1);
    const [isDSMainItem, setIsDSMainItem] = useState(props.isAdd ? true : props.subID == 0);
    const [isEditDSMainItem] = useState(props.subID == 0);

    const dsItemfields = { text: 'name', value: 'id' };

    const getDSItemsCategory = () => {
        axios
            .get(`${urlDSItem}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                setDSItems(response.data);
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

    const dsItemNameTextChange = (e) => {
        setDSItemName(e.target.value);
    }

    const dsSubItemNameTextChange = (e) => {
        setDSSubItemName(e.target.value);
    }

    const initComponentColumns = () => {
        if (isDSMainItem) {
            refName.focusIn();
        }
    }

    const isMainItemChange = (e) => {
        console.log(e.checked);
        setIsDSMainItem(e.checked);
    }

    useEffect(() => {
        console.log(props);

        getDSItemsCategory();

        initComponentColumns();
    }, []);

    return (
        <div>
            {props.isAdd && <div className="row custom-margin custom-padding-5">
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <CheckBoxComponent
                        label="Checked State"
                        checked={true}
                        change={isMainItemChange}
                    />
                </div>
            </div>}
            <div className="row custom-margin custom-padding-5">
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    {isDSMainItem && <TextBoxComponent
                        ref={text => refName = text}
                        id='dsitemName'
                        value={dsItemName}
                        onChange={dsItemNameTextChange}
                        placeholder="Name"
                        floatLabelType="Auto"
                    />}
                    {!isDSMainItem && <DropDownListComponent
                        id='dsMainItemId'
                        dataSource={dsItems}
                        fields={dsItemfields}
                        placeholder="Item Name"
                        floatLabelType="Auto"
                        value={dsItemId}
                    />}
                </div>
            </div>
            {!isEditDSMainItem && <div className="row custom-margin custom-padding-5">
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <TextBoxComponent
                        id='dsSubItemName'
                        value={dsSubItemName}
                        onChange={dsSubItemNameTextChange}
                        placeholder="Sub Name"
                        floatLabelType="Auto"
                    />
                </div>
            </div>}

        </div>
    )
}

export default DialogDSItem