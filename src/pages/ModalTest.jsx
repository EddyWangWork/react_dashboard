import React, { useEffect, useState, ChangeEvent } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { useStateContext } from '../contexts/ContextProvider';

const ModalTest = ({ props }) => {
    const { handleClearToken, isLogin, token, handleLogin } = useStateContext();
    const [itemName, setItemName] = useState(props.name);
    const [description, setDescription] = useState('');
    const [typeId, setTypeId] = useState('');

    const handleItemNameTextChange = (e) => {
        setItemName(e.target.value);
    }
    const handleDescriptionTextChange = (e) => {
        setDescription(e.target.value);
    }
    const handleTypeIdTextChange = (e) => {
        setTypeId(e.target.value);
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

    let buttons = [{
        buttonModel: {
            content: 'OK',
            cssClass: 'e-flat',
            isPrimary: true,
        },
        'click': () => {
            console.log(`${itemName} ${description} ${typeId}`);
        }
    },
    {
        buttonModel: {
            content: 'Cancel',
            cssClass: 'e-flat'
        },
        'click': () => {
            console.log('aaa');
        }
    }];

    // const sportsData = [
    //     { Id: 'game1', Game: 'Badminton' },
    //     { Id: 'game2', Game: 'Football' },
    //     { Id: 'game3', Game: 'Tennis' }
    // ];
    // const fields = { text: 'Game', value: 'Id' };

    const sportsData = [
        { Id: 'game1', Game: 'Badminton' },
        { Id: 'game2', Game: 'Football' },
        { Id: 'game3', Game: 'Tennis' }
    ];
    const fields = { text: 'Game', value: 'Id' };

    useEffect(() => {
        console.log(props);
        getTodolistsCategory();
    }, []);

    return (
        <div className="row custom-margin custom-padding-5">
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                <TextBoxComponent value={itemName} onChange={handleItemNameTextChange}
                    placeholder="First Name"
                    floatLabelType="Auto" />
                <p>The current value is: {itemName}</p>
            </div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                <TextBoxComponent onChange={handleDescriptionTextChange} placeholder="Description" floatLabelType="Auto" />
            </div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                <DropDownListComponent id="ddlelement" onChange={handleTypeIdTextChange} dataSource={sportsData} fields={fields} placeholder="Select a game" />
            </div>
        </div>
        // <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        //     <DialogComponent
        //         visible={showModal}
        //         header={'Modal Title'}
        //         width={'800px'}
        //         isModal={true}
        //         showCloseIcon={true}
        //         animationSettings={{ effect: 'Fade' }}
        //         onClose={onHideModal}
        //         buttons={buttons}
        //     >
        //         <div>
        //             <div className="row custom-margin custom-padding-5">
        //                 <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
        //                     <TextBoxComponent value={itemName} onChange={handleItemNameTextChange} placeholder="First Name" floatLabelType="Auto" />
        //                     <p>The current value is: {itemName}</p>
        //                 </div>
        //                 <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
        //                     <TextBoxComponent onChange={handleDescriptionTextChange} placeholder="Description" floatLabelType="Auto" />
        //                 </div>
        //                 <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
        //                     <DropDownListComponent id="ddlelement" onChange={handleTypeIdTextChange} dataSource={sportsData} fields={fields} placeholder="Select a game" />
        //                 </div>
        //             </div>
        //         </div>
        //     </DialogComponent>
        // </div>
    );
};

export default ModalTest;