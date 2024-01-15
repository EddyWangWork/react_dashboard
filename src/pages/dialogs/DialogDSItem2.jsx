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
    EuiSwitch,
    EuiComboBox
} from '@elastic/eui';
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';

const DialogDSItem2 = ({ rowData, buttonProp, setactionDone, cbDSItems }) => {

    const {
        token, urladdWithSubItem, urlDSItem, urlDSItemSub
    } = useStateContext();
    const navigate = useNavigate();

    let modal;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => setIsModalVisible(true)
    const closeModal = () => setIsModalVisible(false)

    const borderColor = buttonProp.bColor ?? 'border-blue-900/75';
    const isMainItem = [1, 2, 3].some(x => x == buttonProp.mode);
    const isModeDelete = [3, 23].some(x => x == buttonProp.mode);

    const [name, setname] = useState('');
    const [subName, setsubName] = useState('');
    const [selectedItemName, setselectedItemName] = useState([cbDSItems[0]]);

    const [isNameError, setisNameError] = useState(false);
    const [isSubNameError, setisSubNameError] = useState(false);

    const isSubmitError = () => name == '' || (!isMainItem && subName == '')

    const addDSItemAndSubItem = (req) => {
        axios.post(`${urladdWithSubItem}`, req, {
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

    const addDSItemSub = (req) => {
        axios.post(`${urlDSItemSub}`, req, {
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

    const editDSItem = (id, req) => {
        axios.put(`${urlDSItem}/${id}`, req, {
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

    const editDSItemSub = (id, req) => {
        axios.put(`${urlDSItemSub}/${id}`, req, {
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

    const deleteDSItem = (id) => {
        axios.delete(`${urlDSItem}/${id}`, {
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

    const deleteDSItemSub = (id) => {
        axios.delete(`${urlDSItemSub}/${id}`, {
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
                return 'Add Main Item'
            case 2:
                return 'Edit Main Item'
            case 21:
                return 'Add Sub Item'
            case 22:
                return 'Edit Sub Item'
            case 3:
                return 'Delete Main Item'
            case 23:
                return 'Delete Sub Item'
            default:
                return ''
        }
    }

    const ocName = (e) => {
        setname(e.target.value);
    };

    const ocsubName = (e) => {
        setsubName(e.target.value);
    };

    const ocSelectedItemName = (selectedOptions) => {
        setselectedItemName(selectedOptions);
    };

    const onBlurFunc = (e) => {
        switch (e.target.name) {
            case 'name':
                setisNameError(name == '');
                break;
            case 'subName':
                setisSubNameError(!isMainItem && subName == '')
                break;
            default:
                { };
        }
    }

    const setModalValue = () => {
        setname(rowData.original.name);
        setsubName(rowData.original.subName);
        if (!isMainItem)
            setselectedItemName([cbDSItems.find(x => x.id == rowData.original.id)]);
    }

    const setFieldsIsError = (v) => {
        setisNameError(v);
        setisSubNameError(v);
    }

    const clearValue = () => {
        setname('');
        setsubName('');
    }

    const completeAction = () => {
        switch (buttonProp.mode) {
            case 1:
                {
                    var req = {
                        name: name,
                        subName: subName
                    }
                    console.log(modalName());
                    console.log(req);
                    addDSItemAndSubItem(req);
                }; break;
            case 2:
                {
                    var req = {
                        name: name,
                    }
                    console.log(modalName());
                    console.log(rowData.original.id);
                    console.log(req);
                    editDSItem(rowData.original.id, req);
                }; break;
            case 21:
                {
                    var req = {
                        name: subName,
                        dsItemID: selectedItemName[0].id
                    }
                    console.log(modalName());
                    console.log(req);
                    addDSItemSub(req);
                }; break;
            case 3:
                {
                    console.log(modalName());
                    console.log(rowData.original.id);
                    deleteDSItem(rowData.original.id)
                }; break;
            case 22:
                {
                    var req = {
                        name: subName,
                        dsItemID: selectedItemName[0].id
                    }
                    console.log(modalName());
                    console.log(rowData.original.subID);
                    console.log(req);
                    editDSItemSub(rowData.original.subID, req)
                }; break;
            case 23:
                {
                    console.log(modalName());
                    console.log(rowData.original.subID);
                    deleteDSItemSub(rowData.original.subID)
                }; break;
            default:
                { };
        }

        setactionDone(true);
        closeModal();
    }

    useEffect(() => {
        setFieldsIsError(false);

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
                {
                    isMainItem && <EuiFormRow label="Name" isInvalid={isNameError}>
                        <EuiFieldText
                            name="name"
                            value={name}
                            onChange={ocName}
                            onBlur={onBlurFunc}
                            readOnly={isModeDelete}
                            isInvalid={isNameError} />
                    </EuiFormRow>
                }

                {
                    !isMainItem && <EuiFormRow label="Main Item">
                        <EuiComboBox
                            aria-label="Accessible screen reader label"
                            placeholder="Select a single option"
                            singleSelection={{ asPlainText: true }}
                            options={cbDSItems}
                            selectedOptions={selectedItemName}
                            onChange={ocSelectedItemName}
                            isDisabled={isModeDelete || buttonProp.mode == 21}
                            isClearable={false}
                        />
                    </EuiFormRow>
                }

                {
                    (!isMainItem || buttonProp.mode == 23 || buttonProp.mode == 1) &&
                    <EuiFormRow label="Sub Name" isInvalid={isSubNameError}>
                        <EuiFieldText
                            name="subName"
                            value={subName}
                            onChange={ocsubName}
                            onBlur={onBlurFunc}
                            readOnly={isModeDelete}
                            isInvalid={isSubNameError} />
                    </EuiFormRow>
                }
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

export default DialogDSItem2