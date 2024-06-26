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


const DialogTrip = ({ rowData, buttonProp, setactionDone, setisLoading, setactionDoneRes }) => {

    const { token,
        urladdtrip, urlupdatetrip, urldeletetrip,
        urladdtripdetailtype, urdeletetripdetailtype,
        urladdtripdetail, urlupdatetripdetail, urldeletetripdetail,
        addToastHandler, getToastReq
    } = useStateContext();

    let modal;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => setIsModalVisible(true)
    const closeModal = () => setIsModalVisible(false)

    const isModeTrip = [1, 2, 3].some(x => x == buttonProp.mode);
    const isModeTripDetailType = [11, 22, 33].some(x => x == buttonProp.mode);
    const isModeTripDetailTypeInfo = [111, 222, 333].some(x => x == buttonProp.mode);
    const isModeDelete = [3, 33, 333].some(x => x == buttonProp.mode);

    const borderColor = buttonProp.bColor ?? 'border-blue-900/75';

    const [name, setname] = useState('');
    const [startDate, setStartDate] = useState(new moment());
    const [endDate, setEndDate] = useState(new moment());

    const [typeName, settypeName] = useState('');

    const [typeInfoName, settypeInfoName] = useState('');
    const [typeInfoLink, settypeInfoLink] = useState('');

    const [isNameError, setisNameError] = useState(false);
    const [isTypeNameError, setisTypeNameError] = useState(false);
    const [isTypeInfoNameError, setisTypeInfoNameError] = useState(false);

    const isSubmitError = () => (
        (buttonProp.mode == 1 && name == '') ||
        (buttonProp.mode == 11 && typeName == '') ||
        (buttonProp.mode == 111 && typeInfoName == '')
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
                var data = response.data;
                addToastHandler(getToastReq(1, 'New Trip', [data.name, new moment(data.fromDate).format('YYYY-MM-DD'), new moment(data.toDate).format('YYYY-MM-DD')]));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const updatetrip = (id, req) => {
        axios
            .put(`${urlupdatetrip}/${id}`, req, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data);
                var data = response.data;
                addToastHandler(getToastReq(1, 'Update Trip', [data.name, new moment(data.fromDate).format('YYYY-MM-DD'), new moment(data.toDate).format('YYYY-MM-DD')], 'wrench'));
                setactionDoneRes({ id: response.data.id })
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const deletetrip = (id) => {
        axios
            .delete(`${urldeletetrip}/${id}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data);
                var data = response.data;
                addToastHandler(getToastReq(1, 'Delete Trip', [data.name, new moment(data.fromDate).format('YYYY-MM-DD'), new moment(data.toDate).format('YYYY-MM-DD')], 'trash'));
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
                addToastHandler(getToastReq(1, 'New DetailType', [response.data.name]));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const deletetripdetailtype = (id) => {
        axios
            .delete(`${urdeletetripdetailtype}/${id}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data);
                addToastHandler(getToastReq(1, 'Delete DetailType', [response.data.name], 'trash'));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const addtripdetail = (req) => {
        axios
            .post(`${urladdtripdetail}`, req, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data);
                addToastHandler(getToastReq(1, 'New DetailTypeInfo', [response.data.name]));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const updatetripdetail = (id, req) => {
        axios
            .put(`${urlupdatetripdetail}/${id}`, req, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response);
                addToastHandler(getToastReq(1, 'Update DetailTypeInfo', [response.data.name], 'wrench'));
                setactionDoneRes({ id: rowData.tripID })
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const deletetripdetail = (id) => {
        axios
            .delete(`${urldeletetripdetail}/${id}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data);
                addToastHandler(getToastReq(1, 'Delete DetailTypeInfo', [response.data.name], 'trash'));
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
            case 111:
                return 'Add Trip Detail Type Info'
            case 2:
                return 'Edit Trip'
            case 22:
                return 'Edit Trip Detail Type'
            case 222:
                return 'Edit Trip Detail Type Info'
            case 3:
                return 'Delete Trip'
            case 33:
                return 'Delete Trip Detail Type'
            case 333:
                return 'Delete Trip Detail Type Info'
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
            case 'typeInfoName':
                settypeInfoName(e.target.value);
                break;
            case 'typeInfoLink':
                settypeInfoLink(e.target.value);
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
            case 'typeInfoName':
                setisTypeInfoNameError(typeInfoName == '');
                break;
            default:
                { };
        }
    }

    const setFieldsIsError = (v) => {
        setisNameError(v);
        setisTypeNameError(v);
        setisTypeInfoNameError(v);
    }

    const setModalValue = () => {
        if (isModeTrip) {
            setname(rowData.tripName);
            setStartDate(new moment(rowData.fromDate));
            setEndDate(new moment(rowData.toDate));
        }

        if (isModeTripDetailType) {
            settypeName(rowData.typeName);
        }

        if (isModeTripDetailTypeInfo) {
            settypeInfoName(rowData.typeInfoName);
            settypeInfoLink(rowData.typeInfoLink);
        }
    }

    const clearValue = () => {
        setname('');
        settypeName('');
        settypeInfoName('');
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
            case 111:
                {
                    var req = {
                        "tripID": rowData.tripID,
                        "tripDetailTypeID": rowData.tripDetailTypeID,
                        "date": rowData.tripDate,
                        "name": typeInfoName,
                        "linkname": typeInfoLink ?? ''
                    }
                    addtripdetail(req);
                }; break;
            case 2:
                {
                    var req = {
                        "name": name,
                        "fromDate": startDate.format('YYYY-MM-DD'),
                        "toDate": endDate.format('YYYY-MM-DD'),
                    }
                    updatetrip(rowData.tripID, req);
                }; break;
            case 222:
                {
                    var req = {
                        "tripID": rowData.tripID,
                        "tripDetailTypeID": rowData.tripDetailTypeID,
                        "date": rowData.tripDate,
                        "name": typeInfoName,
                        "linkname": typeInfoLink ?? ''
                    }
                    updatetripdetail(rowData.typeValueID, req);
                }; break;
            case 3:
                {
                    deletetrip(rowData.tripID);
                }; break;
            case 33:
                {
                    deletetripdetailtype(rowData.typeID);
                }; break;
            case 333:
                {
                    deletetripdetail(rowData.typeValueID);
                }; break;
            default:
                { };
        }

        // setisLoading(true);
        setactionDone(true);
        clearValue();
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
                    readOnly={isModeDelete}
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

    const formTripTypeInfo = () => (
        <div>
            <EuiFormRow label="TypeInfoName" isInvalid={isTypeInfoNameError}>
                <EuiFieldText name="typeInfoName" value={typeInfoName} readOnly={isModeDelete} onChange={ocHandler} onBlur={onBlurFunc} isInvalid={isTypeInfoNameError} />
            </EuiFormRow>

            <EuiFormRow label="TypeInfoLink">
                <EuiFieldText name="typeInfoLink" value={typeInfoLink} readOnly={isModeDelete} onChange={ocHandler} onBlur={onBlurFunc} />
            </EuiFormRow>
        </div>
    )

    const formSample = (
        <EuiPanel>
            <EuiForm component="form">
                {isModeTrip && formTrip()}
                {isModeTripDetailType && formTripType()}
                {isModeTripDetailTypeInfo && formTripTypeInfo()}
            </EuiForm>
        </EuiPanel>
    );

    const getInitFocus = isModeTrip ? "[name=name]" : buttonProp.mode == 11 ? "[name=typeName]" : "[name=typeInfoName]"

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

export default DialogTrip