import React, { useEffect, useState, ChangeEvent } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { useStateContext } from '../contexts/ContextProvider';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';

const ModalTest = ({ }) => {

    let dialogInstance;
    let checkboxObj;
    let animationSettings;
    let buttons;
    let buttonEle;
    const [display, setDisplay] = useState('none');
    const [status, setStatus] = useState({ hideDialog: false });
    let buttonRef = (element) => {
        buttonEle = element;
    };
    animationSettings = { effect: 'None' };
    buttons = [
        {
            // Click the footer buttons to hide the Dialog
            click: () => {
                setStatus({ hideDialog: false });
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
    }
    function dialogClose() {
        setStatus({ hideDialog: false });
        setDisplay('inline-block');
    }
    function dialogOpen() {
        setStatus({ hideDialog: true });
        setDisplay('none');
    }

    useEffect(() => {

    }, []);

    return (
        <div className="control-pane">
            <div className="control-section modal-dialog-target">
                <div id="target" className="col-lg-8">
                    <button className="e-control e-btn dlgbtn dlgbtn-position" ref={buttonRef} onClick={buttonClick} style={{ display: display }}>
                        Open
                    </button>
                    {/* Rendering modal Dialog by enabling 'isModal' as true */}
                    <DialogComponent
                        id="modalDialog"
                        isModal={true}
                        buttons={buttons}
                        header="Software Update"
                        width="335px"
                        content="Your current software version is up to date."
                        ref={(dialog) => (dialogInstance = dialog)}
                        target="#target"
                        visible={status.hideDialog}
                        open={dialogOpen}
                        close={dialogClose}
                        animationSettings={animationSettings}>
                    </DialogComponent>
                </div>
                <div className="col-lg-4 property-section">
                </div>
            </div>
        </div>
    );
};

export default ModalTest;