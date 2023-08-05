import React, { useEffect, useState, ChangeEvent, useRef, useReducer } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextBoxComponent, FormValidator, FormValidatorModel } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { format, parseISO } from 'date-fns'

import { useStateContext } from '../contexts/ContextProvider';

let remarkText;

const DialogTodolistsDone = ({ props }) => {
    const {
        handleClearToken, token,
        urlgetTodolistTypes
    } = useStateContext();

    const [remark, setRemark] = useState();
    const [doneDate, setDonedate] = useState(new Date());
    const [response, setResponse] = useState({});

    const [categoryData, setCategoryData] = useState([]);
    const fields = { text: 'name', value: 'id' };

    const handleRemarkChange = (e) => {
        setRemark(e.value);
    }
    const handleDoneDateChange = (e) => {
        setDonedate(e.value);
    }

    const navigate = useNavigate();
    const getTodolistsCategory = () => {
        axios
            .get(`${urlgetTodolistTypes}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                setCategoryData(response.data);
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

    useEffect(() => {
        console.log("DialogTodolistsDone.jsx:useEffect => ", props);
        getTodolistsCategory();
        console.log(doneDate);

        setResponse({ remark, doneDate });
    }, [remark, doneDate]);

    return (
        <div>
            <div className="row custom-margin custom-padding-5">
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                    <TextBoxComponent
                        id='tdlName'
                        value={props.todolistName}
                        placeholder="Name"
                        floatLabelType="Auto"
                        enabled={false}
                    />
                </div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <TextBoxComponent
                        id='tdlDesc'
                        value={props.todolistDescription}
                        placeholder="Description"
                        floatLabelType="Auto"
                        enabled={false}
                    />
                </div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <TextBoxComponent
                        value={props.todolistCategory}
                        placeholder="Category"
                        floatLabelType="Auto"
                        enabled={false}
                    />
                </div>
                {/* <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <DatePickerComponent
                        id='tdlUpdateDate'
                        strictMode={false}
                        value={props.updateDate}
                        format='dd/MM/yyyy'
                        floatLabelType="Auto"
                        placeholder="Date"
                        enabled={false}
                    >
                    </DatePickerComponent>
                </div> */}
            </div>
            <div className="row custom-margin custom-padding-5">
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <TextBoxComponent
                        ref={text => remarkText = text}
                        id='tdlRemark'
                        value={props.remark}
                        onChange={handleRemarkChange}
                        placeholder="Remark"
                        floatLabelType="Auto" />
                </div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <DatePickerComponent
                        id='tdlDoneDate'
                        strictMode={false}
                        value={props.updateDate}
                        onChange={handleDoneDateChange}
                        format='dd/MM/yyyy'
                        floatLabelType="Auto"
                        placeholder="Date">
                    </DatePickerComponent>
                </div>
            </div>
        </div>

    );
};

export default DialogTodolistsDone;