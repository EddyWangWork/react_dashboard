import {
    EuiButton,
    EuiButtonEmpty,
    EuiButtonIcon,
    EuiFieldText,
    EuiForm,
    EuiFormRow,
    EuiModal,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiModalHeaderTitle,
    EuiSwitch
} from '@elastic/eui';
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';

const DialogDSAccount2 = ({ rowData, buttonProp, setactionDone }) => {

    const {
        token, urldsAccont,
    } = useStateContext();

    let modal;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => setIsModalVisible(true)
    const closeModal = () => setIsModalVisible(false)

    const [borderColor, setborderColor] = useState(buttonProp.bColor ?? 'border-blue-900/75');

    const [name, setname] = useState('');
    const [isActive, setisActive] = useState(true);

    const isSubmitError = () => name == '';

    const adddsaccount = (req) => {
        axios.post(`${urldsAccont}`, req, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const modalName = () => {
        switch (buttonProp.mode) {
            case 1:
                return 'Add Account'
            case 2:
                return 'Edit Account'
            case 3:
                return 'Delete Account'
            default:
                return ''
        }
    }

    const ocName = (e) => {
        setname(e.target.value);
    };

    const ocIsActive = (e) => {
        setisActive(e.target.checked);
    };

    const setModalValue = () => {
        setname(rowData.original.name);
        setisActive(rowData.original.isActive);
    }

    const clearValue = () => {
        setname('');
    }

    const completeAction = () => {
        switch (buttonProp.mode) {
            case 1:
                {
                    var req = { name: name }
                    console.log(req);
                    adddsaccount(req);
                }; break;
            default:
                { };
        }

        closeModal();
    }

    useEffect(() => {
        if (rowData?.original) {
            setModalValue();
        }
        else {
            clearValue();
        }
    }, [isModalVisible]);

    const formSample = (
        <Fragment>
            <EuiForm component="form">
                <EuiFormRow label="Name" isInvalid={name == ''}>
                    <EuiFieldText name="name" value={name} onChange={ocName} isInvalid={name == ''} />
                </EuiFormRow>

                <EuiFormRow label="Status">
                    <EuiSwitch
                        label={isActive ? "Active" : "In-Active"}
                        checked={isActive}
                        onChange={(e) => ocIsActive(e)}
                    />
                </EuiFormRow>
            </EuiForm>
        </Fragment>
    );

    if (isModalVisible) {
        modal = (
            <EuiModal
                className={`border-double border-4 ${borderColor}`}
                onClose={closeModal}
                initialFocus="[name=name]"
            >
                <EuiModalHeader>
                    <EuiModalHeaderTitle>{modalName()}</EuiModalHeaderTitle>
                </EuiModalHeader>

                <EuiModalBody>{formSample}</EuiModalBody>

                <EuiModalFooter>
                    <EuiButtonEmpty onClick={closeModal}>Cancel</EuiButtonEmpty>
                    <EuiButton disabled={isSubmitError()} onClick={completeAction}>
                        Save
                    </EuiButton>
                </EuiModalFooter>
            </EuiModal>
        );
    }

    return (
        <div>
            <EuiButtonIcon
                display="base"
                iconType={buttonProp.iconType}
                aria-label={buttonProp.label}
                color={buttonProp.color}
                onClick={showModal}
            />
            {modal}
        </div>
    )
}

export default DialogDSAccount2