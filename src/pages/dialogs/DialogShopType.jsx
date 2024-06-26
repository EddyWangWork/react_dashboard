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
    EuiModalHeaderTitle
} from '@elastic/eui';
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';

const DialogShopType = ({ rowData, buttonProp, setactionDone }) => {

    const {
        token, urladdShopType, urlupdateShopType, urldeleteShopType
    } = useStateContext();

    let modal;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => setIsModalVisible(true)
    const closeModal = () => setIsModalVisible(false)

    const isModeDelete = [3].some(x => x == buttonProp.mode);
    const [borderColor, setborderColor] = useState(buttonProp.bColor ?? 'border-blue-900/75');

    const [name, setname] = useState('');

    const isSubmitError = () => name == '';

    const addShopType = (req) => {
        axios.post(`${urladdShopType}`, req, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response);
                setactionDone(true);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const updateShopType = (id, req) => {
        axios.put(`${urlupdateShopType}/${id}`, req, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response);
                setactionDone(true);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const deleteShopType = (id) => {
        axios.delete(`${urldeleteShopType}/${id}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response);
                setactionDone(true);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const modalName = () => {
        switch (buttonProp.mode) {
            case 1:
                return 'Add Shop Type'
            case 2:
                return 'Update Shop Type'
            case 3:
                return 'Delete Shop Type'
            default:
                return ''
        }
    }

    const setModalValue = () => {
        setname(rowData.original.name);
    }

    const clearValue = () => {
        setname('');
    }

    const completeAction = () => {
        switch (buttonProp.mode) {
            case 1:
                {
                    var req = { name: name }
                    addShopType(req);
                }; break;
            case 2:
                {
                    var req = {
                        name: name,
                    }
                    updateShopType(rowData.original.id, req);
                }; break;
            case 3:
                {
                    deleteShopType(rowData.original.id);
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
                    <EuiFieldText name="name" readOnly={isModeDelete} value={name} onChange={(e) => { setname(e.target.value) }} isInvalid={name == ''} />
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

export default DialogShopType