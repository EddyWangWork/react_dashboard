import React, { useEffect, useState, ChangeEvent, useRef, useReducer } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextBoxComponent, FormValidator, FormValidatorModel } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';

import { useStateContext } from '../contexts/ContextProvider';

let formObject;

const DialogTodolists = ({ props }) => {
    const { handleClearToken, isLogin, token, handleLogin } = useStateContext();

    const [name, setName] = useState(props.name);
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState(props.categoryId);
    const [updatedate, setUpdatedate] = useState(props.updateDate);

    const [categoryData, setCategoryData] = useState([]);

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
                console.log(response.data)
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

    const fields = { text: 'name', value: 'id' };

    useEffect(() => {
        console.log(props);
        getTodolistsCategory();
        setUpdatedate(updatedate);
    }, []);

    return (
        <div className="row custom-margin custom-padding-5">
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                <TextBoxComponent
                    id='tdlName'
                    value={name}
                    onChange={handleNameTextChange}
                    placeholder="Name"
                    floatLabelType="Auto" />
            </div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                <TextBoxComponent
                    id='tdlDesc'
                    value={description}
                    onChange={handleDescTextChange}
                    placeholder="Description"
                    floatLabelType="Auto" />
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
                // value={props.categoryId || 0}
                />
            </div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                <DatePickerComponent
                    id='tdlUpdateDate'
                    strictMode={false}
                    value={updatedate}
                    onChange={handleUpdateDateTextChange}
                    // onFocus={handleOnFocus}
                    // onBlur={handleOnBlur}
                    format='dd/MM/yyyy'
                    floatLabelType="Auto"
                    placeholder="Date"
                >
                </DatePickerComponent>
            </div>
        </div>
    );
};

export default DialogTodolists;