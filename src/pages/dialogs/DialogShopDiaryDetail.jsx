import {
    EuiBasicTable,
    EuiButtonEmpty,
    EuiButtonIcon,
    EuiCard,
    EuiModal,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiModalHeaderTitle
} from '@elastic/eui';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';
import { DialogShopDiary } from '../../pages';

const DialogShopDiaryDetail = ({ rowData, buttonProp, setactionDone2, cbShopData }) => {

    const {
        token, urlgetShopDiariesByShop
    } = useStateContext();

    let modal;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => setIsModalVisible(true)
    const closeModal = () => {
        setactionDone2(true);
        setIsModalVisible(false);
    }
    const [actionDone, setactionDone] = useState(false);

    const [borderColor, setborderColor] = useState(buttonProp.bColor ?? 'border-blue-900/75');

    const [shopName, setshopName] = useState('');
    const [dataShopDiaries, setdataShopDiaries] = useState([]);

    const columns = [
        {
            field: 'date',
            name: 'Date',
            align: 'center',
            mobileOptions: {
                show: false,
                align: 'center'
            },
            render: (date) => moment(new Date(date)).format("YYYY/MM/DD")
        },
        {
            field: 'remark',
            name: 'Remark',
            align: 'center',
            truncateText: true,
            mobileOptions: {
                show: false,
                align: 'center'
            },
        },
        {
            field: 'comment',
            name: 'Comment',
            align: 'center',
            truncateText: true,
            mobileOptions: {
                show: false,
                align: 'center'
            },
        },
        {
            field: 'id',
            name: 'Action',
            align: 'center',
            mobileOptions: {
                show: false,
                align: 'center'
            },
            render: (id) => {
                var shopdiary = dataShopDiaries.find(x => x.id == id)
                var rowData = {};
                rowData.original = {};

                rowData.original.id = shopdiary.id;
                rowData.original.date = shopdiary.date;
                rowData.original.remark = shopdiary.remark;
                rowData.original.comment = shopdiary.comment;
                rowData.original.shopID = shopdiary.shopID;

                return <div className='grid gap-2 grid-cols-4'>
                    <DialogShopDiary
                        rowData={rowData}
                        buttonProp={{ mode: 2, iconType: 'wrench', label: 'wrench', color: 'primary', bColor: 'border-indigo-500/75' }}
                        setactionDone={setactionDone}
                        cbShopData={cbShopData}
                    />
                    <DialogShopDiary
                        rowData={rowData}
                        buttonProp={{ mode: 3, iconType: 'error', label: 'error', color: 'danger', bColor: 'border-rose-400/75' }}
                        setactionDone={setactionDone}
                        cbShopData={cbShopData}
                    />
                </div>
            }
        },
    ]

    const getShopDiariesByShop = (shopId) => {
        axios.get(`${urlgetShopDiariesByShop}/${shopId}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.data.sort((a, b) => moment(b.date) - moment(a.date)))
                setdataShopDiaries(response.data.sort((a, b) => b.date - a.date));
            })
            .catch(error => {
                console.log(error);
            });
    }

    const modalName = () => {
        return shopName
    }

    useEffect(() => {
        setdataShopDiaries([]);
        setactionDone(false);
        setshopName(rowData.original.name)
        getShopDiariesByShop(rowData.original.id);
    }, [actionDone, isModalVisible]);

    const formSample = (
        <EuiCard
            className='select-text'
            hasBorder
            title='-'
            description={
                <>
                    <EuiBasicTable
                        tableCaption="Demo of EuiBasicTable"
                        items={dataShopDiaries}
                        rowHeader="firstName"
                        columns={columns}
                    />
                </>
            }
            betaBadgeProps={{
                label: 'Shop Diaries',
                color: 'hollow',
                tooltipContent:
                    'You can change the badge color using betaBadgeProps.color.',
            }}
        />
    );

    if (isModalVisible) {
        modal = (
            <EuiModal
                className={`border-double border-4 ${borderColor}`}
                onClose={closeModal}
            >
                <EuiModalHeader>
                    <EuiModalHeaderTitle>{modalName()}</EuiModalHeaderTitle>
                </EuiModalHeader>

                <EuiModalBody>{formSample}</EuiModalBody>

                <EuiModalFooter>
                    <EuiButtonEmpty onClick={closeModal}>Close</EuiButtonEmpty>
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

export default DialogShopDiaryDetail