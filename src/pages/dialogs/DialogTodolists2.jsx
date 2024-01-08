import {
    EuiButton,
    EuiButtonEmpty,
    EuiButtonIcon,
    EuiComboBox,
    EuiDatePicker,
    EuiFieldText,
    EuiForm,
    EuiFormRow,
    EuiModal,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiModalHeaderTitle,
    EuiSpacer
} from '@elastic/eui';
import axios from 'axios';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';

/*mode: 
    1:addtdl, 11:edittdl, 12:deletetdl
    2:addDone, 21:editDone, 22:deleteDone    
*/
const DialogTodolists2 = ({ cbCatData, rowData, buttonProp, setactionDone }) => {
    const {
        token, urlTodolist, urlTodolistDone,
    } = useStateContext();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => setIsModalVisible(true)

    const [isModeDone, setisModeDone] = useState([2, 21, 22].some(x => x == buttonProp.mode));
    const [isModeDelete, setisModeDelete] = useState([12, 22].some(x => x == buttonProp.mode));
    const [borderColor, setborderColor] = useState(buttonProp.bColor ?? 'border-blue-900/75');

    const [showErrors, setShowErrors] = useState(false);
    const [name, setname] = useState('');
    const [desc, setdesc] = useState('');
    const [updatedDate, setupdatedDate] = useState(moment());
    const [category, setcategory] = useState(0);
    const [categoryText, setcategoryText] = useState('');

    const [remark, setremark] = useState('');
    const [doneDate, setdoneDate] = useState(moment());

    // const [selectedCat, setSelectedCat] = useState([cbCatData[0]]);
    const [selectedCat, setSelectedCat] = useState(cbCatData != null ? [cbCatData[0]] : [{}]);

    const addTodolist = (req) => {
        axios.post(`${urlTodolist}`, req, {
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

    const editTodolist = (id, req) => {
        axios.put(`${urlTodolist}/${id}`, req, {
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

    const deleteTodolist = (id) => {
        axios.delete(`${urlTodolist}/${id}`, {
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

    const addTodolistDone = (req) => {
        axios.post(`${urlTodolistDone}`, req, {
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

    const editTodolistDone = (id, req) => {
        axios.put(`${urlTodolistDone}/${id}`, req, {
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

    const deleteTodolistDone = (id) => {
        axios.delete(`${urlTodolistDone}/${id}`, {
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

    let errors;
    let modal;

    const modalName = () => {
        switch (buttonProp.mode) {
            case 1:
                return 'Add Todo'
            case 11:
                return 'Edit Todo'
            case 12:
                return 'Delete Todo'
            case 2:
                return 'Add Done'
            case 21:
                return 'Edit Done'
            case 22:
                return 'Delete Done'
            default:
                return ''
        }
    }

    const ocName = (e) => {
        setname(e.target.value);
    };

    const ocDesc = (e) => {
        setdesc(e.target.value);
    };

    const handleDateChange = (date) => {
        setupdatedDate(date);
    };

    const onChange = (selectedOptions) => {
        setcategory(selectedOptions[0].id);
        setSelectedCat(selectedOptions);
    };

    const ocRemark = (e) => {
        setremark(e.target.value);
    };

    const handleDoneDate = (date) => {
        setdoneDate(date);
    };

    const getNullOrEmpty = (v) => {
        return ([null, ''].some(x => x == v)) ? null : v
    }

    const closeModal = () => {
        setIsModalVisible(false);
    }

    const completeAction = () => {
        switch (buttonProp.mode) {
            case 1:
                {
                    var req = {
                        name: name,
                        description: desc,
                        categoryId: category,
                    }
                    addTodolist(req);
                    setactionDone(true);
                }; break;
            case 11:
                {
                    var req = {
                        name: name,
                        description: desc,
                        categoryId: category,
                    }
                    editTodolist(rowData.original.id, req);
                    setactionDone(true);
                }; break;
            case 12:
                {
                    deleteTodolist(rowData.original.id, req);
                    setactionDone(true);
                }; break;
            case 2:
                {
                    var req = {
                        TodolistId: rowData.original.id,
                        UnixUpdateTime: new Date(doneDate).getTime(),
                        remark: remark
                    }
                    addTodolistDone(req);
                    setactionDone(true);
                }; break;
            case 21:
                {
                    var req = {
                        remark: remark,
                        UnixUpdateTime: new Date(doneDate).getTime()
                    }
                    editTodolistDone(rowData.original.id, req);
                    setactionDone(true);
                }; break;
            case 22:
                {
                    deleteTodolistDone(rowData.original.id);
                    setactionDone(true);
                }; break;
            default:
                { };
        }

        clearValue();
        closeModal();
    }

    const setModalValue = () => {
        if (isModeDone && buttonProp.mode != 2) {
            setname(rowData.original.todolistName);
            setdesc(getNullOrEmpty(rowData.original.todolistDescription) ?? '-');
            setcategoryText(rowData.original.todolistCategory);
            setremark(rowData.original.remark);
            setdoneDate(moment(rowData.original.updateDate));
        }
        else {
            setname(rowData.original.name);
            setdesc(getNullOrEmpty(rowData.original.description) ?? '-');
            setupdatedDate(moment(rowData.original.updateDate));
            setcategory(rowData.original.category);
            setcategoryText(rowData.original.category);
            if (!isModeDone)
                setSelectedCat([cbCatData.find(x => x.id == rowData.original.categoryID)]);
        }
    }

    const clearValue = () => {
        setname('');
        setdesc('');
        setupdatedDate(moment());
        setcategory(cbCatData != null ? cbCatData[0].id : 0);
        setSelectedCat([cbCatData != null ? cbCatData[0] : {}]);
        setremark('');
    }

    useEffect(() => {
        if (cbCatData?.length == 0) {
            cbCatData = null;
        }

        if (rowData?.original) {
            setModalValue();
        }
        else {
            clearValue(cbCatData);
        }
    }, [isModalVisible]);


    if (showErrors) {
        errors = [
            "Here's an example of an error",
            'You might have more than one error, so pass an array.',
        ];
    }

    const formSample = (
        <Fragment>
            <EuiForm isInvalid={showErrors} error={errors} component="form">
                <EuiFormRow label="Name" isInvalid={showErrors}>
                    <EuiFieldText readOnly={isModeDone || isModeDelete} name="name" value={name} onChange={ocName} isInvalid={showErrors} />
                </EuiFormRow>

                <EuiFormRow label="Description" isInvalid={showErrors}>
                    <EuiFieldText readOnly={isModeDone || isModeDelete} name="description" value={desc} onChange={ocDesc} isInvalid={showErrors} />
                </EuiFormRow>

                {!isModeDone && <EuiFormRow label="Date">
                    <EuiDatePicker readOnly={isModeDone || isModeDelete || buttonProp.mode == 11} selected={updatedDate} onChange={handleDateChange} />
                </EuiFormRow>}

                {!isModeDone && <EuiFormRow label="Type">
                    <EuiComboBox
                        aria-label="Accessible screen reader label"
                        placeholder="Select a single option"
                        singleSelection={{ asPlainText: true }}
                        options={cbCatData}
                        selectedOptions={selectedCat}
                        onChange={onChange}
                        isClearable={false}
                        isDisabled={isModeDelete}
                    />
                </EuiFormRow>}

                {isModeDone && <EuiFormRow label="Type" >
                    <EuiFieldText readOnly={isModeDone} name="type" value={categoryText} />
                </EuiFormRow>}

                {isModeDone && <EuiFormRow label="DoneDate">
                    <EuiDatePicker readOnly={isModeDelete} selected={doneDate} onChange={handleDoneDate} />
                </EuiFormRow>}

                {isModeDone && <EuiFormRow label="Remark" >
                    <EuiFieldText name="remark" readOnly={isModeDelete} value={remark} onChange={ocRemark} />
                </EuiFormRow>}

                <EuiSpacer />
            </EuiForm>
        </Fragment>
    );

    if (isModalVisible) {
        modal = (
            <EuiModal
                className={`border-double border-4 ${borderColor}`}
                onClose={closeModal}
                initialFocus={isModeDone ? "[name=remark]" : "[name=name]"}
            >
                <EuiModalHeader>
                    <EuiModalHeaderTitle>{modalName()}</EuiModalHeaderTitle>
                </EuiModalHeader>

                <EuiModalBody>{formSample}</EuiModalBody>

                <EuiModalFooter>
                    <EuiButtonEmpty onClick={closeModal}>Cancel</EuiButtonEmpty>
                    <EuiButton onClick={completeAction}>
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
    );
};

export default DialogTodolists2;