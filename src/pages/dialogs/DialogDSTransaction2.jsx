import {
    EuiButton,
    EuiButtonEmpty,
    EuiButtonIcon,
    EuiComboBox,
    EuiDatePicker,
    EuiFieldNumber,
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
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';

const DialogDSTransaction2 = ({ rowData, presetData, buttonProp, setactionDone, cbList }) => {

    const {
        token, urlDS
    } = useStateContext();
    const navigate = useNavigate();

    let modal;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => setIsModalVisible(true)
    const closeModal = () => setIsModalVisible(false)

    const borderColor = buttonProp.bColor ?? 'border-blue-900/75';
    const transferList = [3, 4];

    const isModeDelete = [3].some(x => x == buttonProp.mode);

    const [cbAccTo, setcbAccTo] = useState(cbList.cbAcc.slice(1));

    const [date, setdate] = useState(new moment());
    const [selectedType, setselectedType] = useState([cbList.cbTypes[0]]);
    const [selectedAcc, setselectedAcc] = useState([cbList.cbAcc[0]]);
    const [selectedAccTo, setselectedAccTo] = useState([cbAccTo[0]]);
    const [selectedName, setselectedName] = useState([cbList.cbNames[0]]);
    const [desc, setdesc] = useState('');
    const [amount, setamount] = useState(0);

    const [isSubmitted, setisSubmitted] = useState(false);

    const [isAmountError, setisAmountError] = useState(false);

    const isSubmitError = () => amount <= 0;

    const addDStransaction = (req) => {
        axios.
            post(`${urlDS}`, req, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log(response);
                setisSubmitted(false)
                closeModal();
                setactionDone(true);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const editDStransaction = (id, req) => {
        axios.
            put(`${urlDS}/${id}`, req, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log(response);
                closeModal();
                setactionDone(true);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const deleteDStransaction = (id) => {
        axios.
            delete(`${urlDS}/${id}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log(response);
                closeModal();
                setactionDone(true);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const modalName = () => {
        switch (buttonProp.mode) {
            case 1:
                return 'Add Transaction'
            case 2:
                return 'Edit Transaction'
            case 3:
                return 'Delete Transaction'
            default:
                return ''
        }
    }

    const ocDate = (v) => {
        setdate(v);
    };

    const ocSelectedType = (v) => {
        setselectedType(v);
    };

    const ocSelectedAcc = (v) => {
        setselectedAcc(v);
        setcbAccTo(cbList.cbAcc.filter(x => x.id != v[0].id));
        setselectedAccTo([cbList.cbAcc.filter(x => x.id != v[0].id)[0]]);
    };

    const ocSelectedAccTo = (v) => {
        setselectedAccTo(v);
    };

    const ocSelectedName = (v) => {
        setselectedName(v);
    };

    const ocDesc = (e) => {
        setdesc(e.target.value);
    };

    const ocAmount = (e) => {
        setamount(+e.target.value);
    };

    const onBlurFunc = (e) => {
        switch (e.target.name) {
            case 'amount':
                setisAmountError(amount <= 0)
                break;
            default:
                { };
        }
    }

    const completeAction = () => {
        setisSubmitted(true);
        switch (buttonProp.mode) {
            case 1:
                {
                    let req = {}
                    if (selectedType[0].id == 3) {
                        req = {
                            dsTypeID: selectedType[0].id,
                            dsAccountID: selectedAcc[0].id,
                            dsAccountToID: selectedAccTo[0].id,
                            dsItemID: 0,
                            dsItemSubID: 0,
                            description: desc,
                            amount: amount,
                            createdDateTime: new moment(date).utcOffset(0).add(8, 'hours').format(),
                        }
                    }
                    else {
                        req = {
                            dsTypeID: selectedType[0].id,
                            dsAccountID: selectedAcc[0].id,
                            dsAccountToID: 0,
                            dsItemID: selectedName[0].id,
                            dsItemSubID: selectedName[0].subid,
                            description: desc,
                            amount: amount,
                            createdDateTime: new moment(date).utcOffset(0).add(8, 'hours'),
                        }
                    }

                    addDStransaction(req);
                }; break;
            case 2:
                {
                    let req = {}
                    if (selectedType[0].id == 3) {
                        req = {
                            dsTypeID: selectedType[0].id,
                            dsAccountID: selectedAcc[0].id,
                            dsAccountToID: selectedAccTo[0].id,
                            dsItemID: 0,
                            dsItemSubID: 0,
                            description: desc,
                            amount: amount,
                            createdDateTime: new moment(date).utcOffset(0).add(8, 'hours').format(),
                        }
                    }
                    else {
                        req = {
                            dsTypeID: selectedType[0].id,
                            dsAccountID: selectedAcc[0].id,
                            dsAccountToID: 0,
                            dsItemID: selectedName[0].id,
                            dsItemSubID: selectedName[0].subid,
                            description: desc,
                            amount: amount,
                            createdDateTime: new moment(date).utcOffset(0).add(8, 'hours'),
                        }
                    }

                    let reqId = rowData?.original?.id ?? rowData.id
                    editDStransaction(reqId, req);
                }; break;
            case 3:
                {
                    let reqId = rowData?.original?.id ?? rowData.id
                    deleteDStransaction(reqId);
                }; break;
            default:
                { };
        }

        // setactionDone(true);
        //closeModal();
    }

    const setFieldsIsError = (v) => {
        setisAmountError(v);
    }

    const setModalValue = (v) => {
        setselectedType(
            [cbList.cbTypes.find(x => x.id ==
                (v.dsTypeID == 4 ?
                    3 : v.dsTypeID)
            )])

        setdate(new moment(v.createdDateTime));
        setselectedAcc([cbList.cbAcc.find(x => x.id == v.dsAccountID)])
        setselectedAccTo([cbList.cbAcc.find(x => x.id == v.dsAccountToID)])
        if (!transferList.includes(v.dsTypeID))
            setselectedName([cbList.cbNames.find(x => x.label == v.dsItemName)])
        setdesc(v.description);
        setamount(v.amount);
    }

    const clearValue = () => {
        if (presetData) {
            setdate(presetData.pDate);
            setselectedType([cbList.cbTypes.find(x => x.id == presetData.pType)])
            setselectedAcc([cbList.cbAcc.find(x => x.id == presetData.pAcc)])

            setcbAccTo(cbList.cbAcc.filter(x => x.id != presetData.pAcc));
            setselectedAccTo([cbList.cbAcc.filter(x => x.id != presetData.pAcc)[0]]);

            setselectedName([cbList.cbNames.find(x => x.uid == presetData.pName)])
        }

        setdesc('');
        setamount(0);
    }

    useEffect(() => {
        setFieldsIsError(false);

        if (rowData?.original) {
            setModalValue(rowData.original);
        }
        else if (rowData) {
            setModalValue(rowData);
        }
        else {
            clearValue();
        }
    }, [isModalVisible]);

    const formSample = (
        <Fragment>
            <EuiForm component="form">
                <EuiFormRow label="Date">
                    <EuiDatePicker preventOpenOnFocus={true} dateFormat="YYYY/MM/DD" name="date" readOnly={isModeDelete} selected={date} onChange={ocDate} />
                </EuiFormRow>

                <EuiFormRow label="Type">
                    <EuiComboBox
                        aria-label="Accessible screen reader label"
                        placeholder="Select a single option"
                        singleSelection={true}
                        options={cbList.cbTypes}
                        selectedOptions={selectedType}
                        onChange={ocSelectedType}
                        isDisabled={isModeDelete}
                        isClearable={false}
                    />
                </EuiFormRow>

                <EuiFormRow label="Account">
                    <EuiComboBox
                        aria-label="Accessible screen reader label"
                        placeholder="Select a single option"
                        singleSelection={{ asPlainText: true }}
                        options={cbList.cbAcc}
                        selectedOptions={selectedAcc}
                        onChange={ocSelectedAcc}
                        isDisabled={isModeDelete}
                        isClearable={false}
                    />
                </EuiFormRow>

                {
                    selectedType[0].id == 3 &&
                    <EuiFormRow label="To Account">
                        <EuiComboBox
                            aria-label="Accessible screen reader label"
                            placeholder="Select a single option"
                            singleSelection={{ asPlainText: true }}
                            options={cbAccTo}
                            selectedOptions={selectedAccTo}
                            onChange={ocSelectedAccTo}
                            isDisabled={isModeDelete}
                            isClearable={false}
                        />
                    </EuiFormRow>
                }

                {
                    !transferList.includes(selectedType[0].id) &&
                    <EuiFormRow label="Name">
                        <EuiComboBox
                            aria-label="Accessible screen reader label"
                            placeholder="Select a single option"
                            singleSelection={{ asPlainText: true }}
                            options={cbList.cbNames}
                            selectedOptions={selectedName}
                            onChange={ocSelectedName}
                            isDisabled={isModeDelete}
                            isClearable={false}
                        />
                    </EuiFormRow>
                }

                <EuiFormRow label="Description">
                    <EuiFieldText
                        name="desc"
                        value={desc}
                        onChange={ocDesc}
                        readOnly={isModeDelete} />
                </EuiFormRow>

                <EuiFormRow label="Amount" isInvalid={isAmountError}>
                    <EuiFieldNumber
                        name="amount"
                        placeholder="Amount"
                        value={amount}
                        onChange={ocAmount}
                        onBlur={onBlurFunc}
                        aria-label="Use aria labels when no actual label is in use"
                        readOnly={isModeDelete}
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
                initialFocus="[name=desc]"
            >
                <EuiModalHeader>
                    <EuiModalHeaderTitle>{modalName()}</EuiModalHeaderTitle>
                </EuiModalHeader>

                <EuiModalBody>{formSample}</EuiModalBody>

                <EuiModalFooter>
                    <EuiButtonEmpty onClick={closeModal}>Cancel</EuiButtonEmpty>
                    <EuiButton isLoading={isSubmitted} autoFocus={isModeDelete} disabled={isSubmitError()} onClick={completeAction}>
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

export default DialogDSTransaction2