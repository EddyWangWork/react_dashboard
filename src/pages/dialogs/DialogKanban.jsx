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
} from '@elastic/eui';
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';

const DialogKanban = ({ rowData, buttonProp, setactionDone }) => {

    const {
        token, urlKanban,
    } = useStateContext();

    let modal;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => setIsModalVisible(true)
    const closeModal = () => setIsModalVisible(false)

    const isModeDelete = [3].some(x => x == buttonProp.mode);

    const [borderColor, setborderColor] = useState(buttonProp.bColor ?? 'border-blue-900/75');

    const [title, settitle] = useState('');
    const [content, setcontent] = useState('');

    const [isTitleError, setisTitleError] = useState(false);

    const isSubmitError = () => title == '';

    const addKanban = (req) => {
        axios.post(`${urlKanban}`, req, {
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

    const editKanban = (id, req) => {
        axios.put(`${urlKanban}/${id}`, req, {
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

    const deleteKanban = (id) => {
        axios.delete(`${urlKanban}/${id}`, {
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
                return 'Add Task'
            case 2:
                return 'Edit Task'
            case 3:
                return 'Delete Task'
            default:
                return ''
        }
    }

    const ocHandler = (e) => {
        switch (e.target.name) {
            case 'title':
                settitle(e.target.value);
                break;
            case 'content':
                setcontent(e.target.value);
                break;
            default:
                { };
        }
    };

    const onBlurFunc = (e) => {
        switch (e.target.name) {
            case 'title':
                setisTitleError(title == '');
                break;
            default:
                { };
        }
    }

    const setModalValue = () => {
        settitle(rowData.title);
        setcontent(rowData.content);
    }

    const clearValue = () => {
        settitle('');
        setcontent('');
    }

    const completeAction = () => {
        switch (buttonProp.mode) {
            case 1:
                {
                    var req = {
                        "type": 1,
                        "title": title,
                        "content": content,
                        "status": 1,
                        "priority": 0
                    }
                    console.log(req);
                    addKanban(req);
                }; break;
            case 2:
                {
                    var req = {
                        "type": rowData.type,
                        "title": title,
                        "content": content,
                        "status": rowData.status,
                        "priority": 0
                    }
                    console.log(rowData.id);
                    console.log(req);
                    editKanban(rowData.id, req);
                }; break;
            case 3:
                {
                    deleteKanban(rowData.id);
                }; break;
            default:
                { };
        }

        setactionDone(true);
        closeModal();
    }

    const setFieldsIsError = (v) => {
        settitle(v);
    }

    useEffect(() => {
        setFieldsIsError(false);

        if (rowData) {
            setModalValue();
        }
        else {
            clearValue();
        }
    }, [isModalVisible]);

    const formSample = (
        <Fragment>
            <EuiForm component="form">
                <EuiFormRow label="Title" isInvalid={isTitleError}>
                    <EuiFieldText name="title" value={title} readOnly={isModeDelete} onChange={ocHandler} onBlur={onBlurFunc} isInvalid={isTitleError} />
                </EuiFormRow>

                <EuiFormRow label="Content">
                    <EuiFieldText name="content" value={content} readOnly={isModeDelete} onChange={ocHandler} />
                </EuiFormRow>
            </EuiForm>
        </Fragment>
    );

    if (isModalVisible) {
        modal = (
            <EuiModal
                className={`border-double border-4 ${borderColor}`}
                onClose={closeModal}
                initialFocus="[name=title]"
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
                display="empty"
                iconType={buttonProp.iconType}
                aria-label={buttonProp.label}
                color={buttonProp.color}
                onClick={showModal}
            />
            {modal}
        </div>
    )
}

export default DialogKanban