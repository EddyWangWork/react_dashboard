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
    EuiModalHeaderTitle
} from '@elastic/eui';
import axios from 'axios';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';

const DialogShopDiary = ({ rowData, buttonProp, setactionDone, cbShopData }) => {

    const {
        token, urladdShopDiary, urlupdateShopDiary, urldeleteShopDiary
    } = useStateContext();

    let modal;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => setIsModalVisible(true)
    const closeModal = () => setIsModalVisible(false)

    const isModeDelete = [3].some(x => x == buttonProp.mode);
    const [borderColor, setborderColor] = useState(buttonProp.bColor ?? 'border-blue-900/75');

    const [date, setdate] = useState(moment());
    const [remark, setremark] = useState('');
    const [comment, setcomment] = useState('');

    const [selectedShop, setselectedShop] = useState([]);

    const isSubmitError = () => selectedShop.length == 0;

    const addShopDiary = (req) => {
        axios.post(`${urladdShopDiary}`, req, {
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

    const updateShopDiary = (id, req) => {
        axios.put(`${urlupdateShopDiary}/${id}`, req, {
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

    const deleteShopDiary = (id) => {
        axios.delete(`${urldeleteShopDiary}/${id}`, {
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
            case 11:
                return 'Add Shop Diary'
            case 2:
                return 'Update Shop Diary'
            case 3:
                return 'Delete Shop Diary'
            default:
                return ''
        }
    }

    const setModalValue = () => {
        setdate(moment(rowData.original.date));
        setremark(rowData.original.remark);
        setcomment(rowData.original.comment);
        setselectedShop([cbShopData.find(x => x.id == rowData.original.shopID)]);
    }

    const clearValue = () => {
        setdate(moment());
        setremark('');
        setcomment('');
        setselectedShop([]);
    }

    const completeAction = () => {
        switch (buttonProp.mode) {
            case 1:
            case 11:
                {
                    var req =
                    {
                        shopID: selectedShop[0].id,
                        date: moment(date).format("YYYY-MM-DD"),
                        remark: remark,
                        comment: comment
                    }

                    addShopDiary(req);
                }; break;
            case 2:
                {
                    var req =
                    {
                        shopID: selectedShop[0].id,
                        date: moment(date).format("YYYY-MM-DD"),
                        remark: remark,
                        comment: comment
                    }

                    updateShopDiary(rowData.original.id, req);
                }; break;
            case 3:
                {
                    deleteShopDiary(rowData.original.id);
                }; break;
            default:
                { };
        }

        closeModal();
    }

    useEffect(() => {
        if (buttonProp.mode == 11) {
            console.log(rowData?.original);
            setselectedShop([cbShopData.find(x => x.id == rowData?.original.id)]);
        }
        else if (rowData?.original) {
            setModalValue();
        }
        else {
            clearValue();
        }
    }, [isModalVisible]);

    const formSample = (
        <Fragment>
            <EuiForm component="form">
                <EuiFormRow label="Shop" isInvalid={selectedShop.length == 0}>
                    <EuiComboBox
                        aria-label="Accessible screen reader label"
                        placeholder="Select types"
                        // singleSelection={{ asPlainText: true }}
                        singleSelection={true}
                        options={cbShopData}
                        selectedOptions={selectedShop}
                        onChange={(v) => { setselectedShop(v) }}
                        isDisabled={isModeDelete}
                        isClearable={true}
                    />
                </EuiFormRow>
                <EuiFormRow label="Date">
                    <EuiDatePicker readOnly={isModeDelete} selected={date} onChange={(e) => { setdate(e) }} />
                </EuiFormRow>
                <EuiFormRow label="Remark">
                    <EuiFieldText name="remark" readOnly={isModeDelete} value={remark} onChange={(e) => { setremark(e.target.value) }} />
                </EuiFormRow>
                <EuiFormRow label="Comment">
                    <EuiFieldText name="comment" readOnly={isModeDelete} value={comment} onChange={(e) => { setcomment(e.target.value) }} />
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

export default DialogShopDiary