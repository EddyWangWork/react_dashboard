import {
    EuiButton,
    EuiButtonEmpty,
    EuiButtonIcon,
    EuiComboBox,
    EuiFieldNumber,
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

const DialogShop = ({ rowData, buttonProp, setactionDone, cbTypeData }) => {

    const {
        token, urladdShop, urlupdateShop, urldeleteShop
    } = useStateContext();

    let modal;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => setIsModalVisible(true)
    const closeModal = () => setIsModalVisible(false)

    const isModeDelete = [3].some(x => x == buttonProp.mode);
    const [borderColor, setborderColor] = useState(buttonProp.bColor ?? 'border-blue-900/75');

    const [name, setname] = useState('');
    const [typeList, settypeList] = useState([]);
    const [location, setlocation] = useState('');
    const [remark, setremark] = useState('');
    const [comment, setcomment] = useState('');
    const [star, setstar] = useState(0);
    const [isVisited, setisVisited] = useState(false);

    const [selectedTypes, setselectedTypes] = useState([]);

    const isSubmitError = () => name == '';

    const addShop = (req) => {
        axios.post(`${urladdShop}`, req, {
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

    const updateShop = (id, req) => {
        axios.put(`${urlupdateShop}/${id}`, req, {
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

    const deleteShop = (id) => {
        axios.delete(`${urldeleteShop}/${id}`, {
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
                return 'Add Shop'
            case 2:
                return 'Update Shop'
            case 3:
                return 'Delete Shop'
            default:
                return ''
        }
    }

    const setModalValue = () => {
        setname(rowData.original.name);

        console.log(cbTypeData.filter(x => rowData.original.typeList.some(y => y == x.label)));
        console.log(cbTypeData);
        console.log(rowData.original.typeList);

        setselectedTypes(cbTypeData.filter(x => rowData.original.typeList.some(y => y == x.label)));
        setlocation(rowData.original.location);
        setremark(rowData.original.remark);
        setcomment(rowData.original.comment);
        setstar(rowData.original.star);
        setisVisited(rowData.original.isVisited);
    }

    const clearValue = () => {
        setname('');
        setselectedTypes([]);
        setlocation('');
        setremark('');
        setcomment('');
        setstar(0);
        setisVisited(false);
    }

    const completeAction = () => {
        switch (buttonProp.mode) {
            case 1:
                {
                    var typeListIds = [];
                    selectedTypes.map((v, i) => {
                        typeListIds.push(v.id);
                    })

                    var req =
                    {
                        name: name,
                        typeList: typeListIds,
                        location: location,
                        remark: remark,
                        comment: comment,
                        star: star,
                        isVisited: isVisited
                    }

                    addShop(req);
                }; break;
            case 2:
                {
                    var typeListIds = [];
                    selectedTypes.map((v, i) => {
                        typeListIds.push(v.id);
                    })

                    var req =
                    {
                        name: name,
                        typeList: typeListIds,
                        location: location,
                        remark: remark,
                        comment: comment,
                        star: star,
                        isVisited: isVisited
                    }

                    updateShop(rowData.original.id, req);
                }; break;
            case 3:
                {
                    deleteShop(rowData.original.id);
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
                <EuiFormRow label="Location" isInvalid={location == ''}>
                    <EuiFieldText name="location" readOnly={isModeDelete} value={location} onChange={(e) => { setlocation(e.target.value) }} isInvalid={location == ''} />
                </EuiFormRow>
                <EuiFormRow label="Types">
                    <EuiComboBox
                        aria-label="Accessible screen reader label"
                        placeholder="Select types"
                        options={cbTypeData}
                        selectedOptions={selectedTypes}
                        onChange={(v) => { setselectedTypes(v) }}
                        isDisabled={isModeDelete}
                        isClearable={true}
                    />
                </EuiFormRow>
                <EuiFormRow label="Remark">
                    <EuiFieldText name="remark" readOnly={isModeDelete} value={remark} onChange={(e) => { setremark(e.target.value) }} />
                </EuiFormRow>
                <EuiFormRow label="Comment">
                    <EuiFieldText name="comment" readOnly={isModeDelete} value={comment} onChange={(e) => { setcomment(e.target.value) }} />
                </EuiFormRow>
                <EuiFormRow label="Rate" >
                    <EuiFieldNumber
                        placeholder="Rate"
                        min='0'
                        max='5'
                        value={star}
                        onChange={(e) => setstar(e.target.value)}
                        aria-label="Use aria labels when no actual label is in use"
                        readOnly={isModeDelete}
                    />
                </EuiFormRow>
                <EuiFormRow label="Visited">
                    <EuiSwitch
                        label={isVisited ? "Visited" : "Will Visit"}
                        checked={isVisited}
                        onChange={(e) => setisVisited(e.target.checked)}
                        isDisabled={isModeDelete}
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

export default DialogShop