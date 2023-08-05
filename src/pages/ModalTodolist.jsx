import React, { useEffect, useState, ChangeEvent } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { useStateContext } from '../contexts/ContextProvider';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { DialogTodolists } from '../pages'

const ModalTodolist = ({ props }) => {

    const {
        token,
        urlTodolistDone
    } = useStateContext();

    let dialogInstance;
    let checkboxObj;
    let animationSettings;
    let buttons;
    let buttonEle;
    const [display, setDisplay] = useState('none');
    const [status, setStatus] = useState({ hideDialog: false });
    const [dContent, setDcontent] = useState();

    const addTodolistDone = (req) => {
        axios.post(`${urlTodolistDone}`, req, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response);
                props.Todolistsss(props.trigger);
                dialogClose();
            })
            .catch(error => {
                console.log(error);
            });
    }

    animationSettings = { effect: 'None' };
    buttons = [
        {
            // Click the footer buttons to hide the Dialog
            click: () => {
                setStatus({ hideDialog: false });
                console.log('buttons');
            },
            // Accessing button component properties by buttonModel property
            buttonModel: {
                //Enables the primary button
                isPrimary: true,
                content: 'OK',
            },
        },
    ];
    // function to handle the CheckBox change event
    function onChange(args) {
        if (args.checked) {
            dialogInstance.overlayClick = () => {
                setStatus({ hideDialog: false });
            };
        }
        else {
            dialogInstance.overlayClick = () => {
                setStatus({ hideDialog: true });
            };
        }
    }
    // To Open dialog
    function buttonClick() {
        setStatus({ hideDialog: true });
        console.log('buttonClick');

        dialogInstance.overlayClick = () => {
            setStatus({ hideDialog: false });
        };
    }
    function dialogClose() {
        setStatus({ hideDialog: false });
        setDisplay('inline-block');
    }
    function dialogOpen() {
        // setStatus({ hideDialog: true });
        // setDisplay('none');
        console.log('dialogOpen');
    }

    const [response, setResponse] = useState({});

    const handleClick = obj => {
        // 👇️ take the parameter passed from the Child component
        // setResponse(emp => ({ ...emp, ...obj }));

        console.log('argument from Child: ', obj);
        console.log('argument from ROW: ', props);

        addTodolistAction(props, obj);
    };

    function addTodolistAction(props, obj) {
        var req = {
            TodolistId: props.id,
            UnixUpdateTime: obj.doneDate.getTime(),
            remark: obj.remark
        }
        console.log("req: ", req);
        addTodolistDone(req);
    }

    function content() {
        return (
            <DialogTodolists
                props={props}
                isTodolistDone={true}
                handleClick={handleClick}
            />
        )
    }

    useEffect(() => {
        console.log("ModalTodolist.jsx: useEffect");
    }, []);

    return (
        <div className="control-pane">
            <button className="e-control e-btn dlgbtn dlgbtn-position" onClick={buttonClick}>
                Open
            </button>
            {/* Rendering modal Dialog by enabling 'isModal' as true */}
            <DialogComponent
                id="modalDialog"
                isModal={true}
                //buttons={buttons}
                header="Software Update"
                width="335px"
                // content="Your current software version is up to date."
                content={content}
                ref={(dialog) => (dialogInstance = dialog)}
                // target="#target"
                visible={status.hideDialog}
                // open={dialogOpen}
                // close={dialogClose}
                animationSettings={animationSettings}>
            </DialogComponent>
            {/* </div> */}
        </div>
    );
};

export default ModalTodolist;