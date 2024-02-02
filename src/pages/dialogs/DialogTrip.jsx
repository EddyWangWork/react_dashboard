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
    EuiDatePickerRange,
    EuiDatePicker,
    EuiPanel
} from '@elastic/eui';
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';
import moment from 'moment';


const DialogTrip = ({ rowData, buttonProp, setactionDone, setisLoading }) => {

    const { token, urladdtrip, urladdtripdetailtype } = useStateContext();

    let modal;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => setIsModalVisible(true)
    const closeModal = () => setIsModalVisible(false)

    const isModeDelete = [3].some(x => x == buttonProp.mode);

    const borderColor = buttonProp.bColor ?? 'border-blue-900/75';

    const [name, setname] = useState('');
    const [startDate, setStartDate] = useState(new moment());
    const [endDate, setEndDate] = useState(new moment());

    const [typeName, settypeName] = useState('');

    const [isNameError, setisNameError] = useState(false);
    const [isTypeNameError, setisTypeNameError] = useState(false);

    const isSubmitError = () => (
        (buttonProp.mode == 1 && name == '') ||
        (buttonProp.mode == 11 && typeName == '')
    )

    const addtrip = (req) => {
        axios
            .post(`${urladdtrip}`, req, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const addtripdetailtype = (req) => {
        axios
            .post(`${urladdtripdetailtype}`, req, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const modalName = () => {
        switch (buttonProp.mode) {
            case 1:
                return 'Add Trip'
            case 11:
                return 'Add Trip Detail Type'
            case 2:
                return 'Edit Trip'
            case 3:
                return 'Delete Trip'
            default:
                return ''
        }
    }

    const ocHandler = (e) => {
        switch (e.target.name) {
            case 'name':
                setname(e.target.value);
                break;
            case 'typeName':
                settypeName(e.target.value);
                break;
            default:
                { };
        }
    };

    const onBlurFunc = (e) => {
        switch (e.target.name) {
            case 'name':
                setisNameError(name == '');
                break;
            case 'typeName':
                setisTypeNameError(typeName == '');
                break;
            default:
                { };
        }
    }

    const setFieldsIsError = (v) => {
        setisNameError(v);
        setisTypeNameError(v);
    }

    const setModalValue = () => {
        setname(rowData.title);
    }

    const clearValue = () => {
        setname('');
        settypeName('');
    }

    const completeAction = () => {
        switch (buttonProp.mode) {
            case 1:
                {
                    var req = {
                        "name": name,
                        "fromDate": startDate.format('YYYY-MM-DD'),
                        "toDate": endDate.format('YYYY-MM-DD'),
                    }
                    addtrip(req);
                }; break;
            case 11:
                {
                    var req = {
                        "name": typeName
                    }
                    addtripdetailtype(req);
                }; break;
            case 2:
                {

                }; break;
            case 3:
                {

                }; break;
            default:
                { };
        }

        // setisLoading(true);
        setactionDone(true);
        closeModal();
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

    const formTrip = () => (
        <div>
            <EuiFormRow label="Name" isInvalid={isNameError}>
                <EuiFieldText name="name" value={name} readOnly={isModeDelete} onChange={ocHandler} onBlur={onBlurFunc} isInvalid={isNameError} />
            </EuiFormRow>

            <EuiFormRow label="Date">
                <EuiDatePickerRange
                    startDateControl={
                        <EuiDatePicker
                            preventOpenOnFocus={true}
                            selected={startDate}
                            onChange={(date) => date && setStartDate(date)}
                            startDate={startDate}
                            endDate={endDate}
                            aria-label="Start date"
                            dateFormat={'YYYY/MM/DD'}
                        />
                    }
                    endDateControl={
                        <EuiDatePicker
                            preventOpenOnFocus={true}
                            selected={endDate}
                            onChange={(date) => date && setEndDate(date)}
                            startDate={startDate}
                            endDate={endDate}
                            aria-label="End date"
                            dateFormat={'YYYY/MM/DD'}
                        />
                    }
                />
            </EuiFormRow>
        </div>
    )

    const formTripType = () => (
        <div>
            <EuiFormRow label="Type" isInvalid={isTypeNameError}>
                <EuiFieldText name="typeName" value={typeName} readOnly={isModeDelete} onChange={ocHandler} onBlur={onBlurFunc} isInvalid={isTypeNameError} />
            </EuiFormRow>
        </div>
    )

    const formSample = (
        <EuiPanel>
            <EuiForm component="form">
                {buttonProp.mode == 1 && formTrip()}
                {buttonProp.mode == 11 && formTripType()}
            </EuiForm>
        </EuiPanel>
    );

    const getInitFocus = buttonProp.mode == 1 ? "[name=name]" : "[name=typeName]"

    if (isModalVisible) {
        modal = (
            <EuiModal
                // style={{ width: 650 }}
                className={`border-double border-4 ${borderColor}`}
                onClose={closeModal}
                initialFocus={getInitFocus}
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

export default DialogTrip