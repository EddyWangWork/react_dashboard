import React, { useEffect, useState, ChangeEvent, useRef, useReducer } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextBoxComponent, FormValidator, FormValidatorModel } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { format, parseISO } from 'date-fns'

import { useStateContext } from '../contexts/ContextProvider';

let remarkText;
let refName;

const DialogTodolists = ({ props, isTodolistDone, handleClick }) => {
    const { handleClearToken, isLogin, token, handleLogin } = useStateContext();

    const [name, setName] = useState(props.name);
    const [description, setDescription] = useState(props.description);
    const [categoryId, setCategoryId] = useState(props.categoryId ?? 1);
    const [updatedate, setUpdatedate] = useState(props.updateDate ?? new Date());

    const [remark, setRemark] = useState();
    const [doneDate, setDonedate] = useState(new Date());
    const [response, setResponse] = useState({});

    const [categoryData, setCategoryData] = useState([]);
    const fields = { text: 'name', value: 'id' };

    const handleNameTextChange = (e) => {
        setName(e.target.value);
    }
    const handleDescTextChange = (e) => {
        setDescription(e.target.value);
    }
    const handleCatTextChange = (e) => {
        setCategoryId(e.target.value);
    }
    const handleUpdateDateTextChange = (e) => {
        setUpdatedate(e.target.value);
    }

    const handleRemarkChange = (e) => {
        setRemark(e.value);
        // setResponse({ remark, doneDate })
    }
    const handleDoneDateChange = (e) => {
        // debugger
        setDonedate(e.value);
        // debugger
        // console.log(doneDate);
        // setResponse({ remark, doneDate })
    }

    const navigate = useNavigate();
    const getTodolistsCategory = () => {
        axios
            .get(`http://localhost:5000/api/todolists/getTodolistsCategory`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                //console.log(response.data)
                setCategoryData(response.data);
                if (isTodolistDone) {
                    if (remarkText) {
                        remarkText.focusIn();
                    }
                }
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

    const initComponentColumns = () => {
        refName.focusIn();
        setUpdatedate(updatedate);
    }

    useEffect(() => {
        // console.log("dialogTdl.jsx:useEffect => ", props);
        getTodolistsCategory();
        setResponse({ remark, doneDate });

        initComponentColumns();

    }, [remark, doneDate]);

    return (
        <div>
            <div className="row custom-margin custom-padding-5">
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                    <TextBoxComponent
                        ref={text => refName = text}
                        id='tdlName'
                        value={name}
                        onChange={handleNameTextChange}
                        placeholder="Name"
                        floatLabelType="Auto"
                        enabled={!isTodolistDone} />
                </div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <TextBoxComponent
                        id='tdlDesc'
                        value={description}
                        onChange={handleDescTextChange}
                        placeholder="Description"
                        floatLabelType="Auto"
                        enabled={!isTodolistDone} />
                </div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <DropDownListComponent
                        id='tdlCategoryId'
                        onChange={handleCatTextChange}
                        dataSource={categoryData}
                        fields={fields}
                        placeholder="Category"
                        floatLabelType="Auto"
                        value={categoryId}
                        enabled={!isTodolistDone}
                    />
                </div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <DatePickerComponent
                        id='tdlUpdateDate'
                        strictMode={false}
                        value={updatedate}
                        onChange={handleUpdateDateTextChange}
                        format='dd/MM/yyyy'
                        floatLabelType="Auto"
                        placeholder="Date"
                        enabled={!isTodolistDone}
                    >
                    </DatePickerComponent>
                </div>
            </div>
            {isTodolistDone && <div className="row custom-margin custom-padding-5">
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <TextBoxComponent
                        ref={text => remarkText = text}
                        id='tdlRemark'
                        value={remark}
                        onChange={handleRemarkChange}
                        placeholder="Remark"
                        floatLabelType="Auto" />
                </div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <DatePickerComponent
                        id='tdlDoneDate'
                        strictMode={false}
                        value={doneDate}
                        onChange={handleDoneDateChange}
                        format='dd/MM/yyyy'
                        floatLabelType="Auto"
                        placeholder="Date">
                    </DatePickerComponent>
                </div>
            </div>}
            {isTodolistDone && <button
                type='button'
                onClick={event => handleClick(response)}
                // style={{ color }}
                className='relative text-xl rounded-full p-3 hover:bg-light-gray'
            >
                <span
                    // style={{ background: dotColor }}
                    className='absolute inline-flex rounded-full h-2 w-2 right-2 top-2'
                />
                DONE
            </button>}
        </div>

    );
};

export default DialogTodolists;