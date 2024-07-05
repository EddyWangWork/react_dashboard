import {
    EuiBasicTable,
    EuiButtonEmpty,
    EuiButtonIcon,
    EuiCard,
    EuiModal,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiModalHeaderTitle,
    EuiSkeletonRectangle
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

    const [isLoading, setisLoading] = useState(true);

    const [shopName, setshopName] = useState('');
    const [dataShopDiaries, setdataShopDiaries] = useState([]);

    const columns = [
        {
            field: 'date',
            name: 'Date',
            align: 'center',
            width: '110px',
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
            render: (remark) => {
                var remarks = remark.split("\n");
                return <ul>
                    {remarks.map((x, i) => (
                        <li style={{ listStyleType: 'none' }} key={i}>{x}</li>
                    ))}
                </ul>
            }
        },
        {
            field: 'comment',
            name: 'Comment',
            align: 'center',
            mobileOptions: {
                show: false,
                align: 'center'
            },
        },
        {
            field: 'id',
            name: 'Action',
            align: 'center',
            width: '100px',
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

                return <div className='flex justify-center gap-2'>
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
                setisLoading(false);
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
        setisLoading(true);
        setactionDone(false);
        setshopName(rowData.original.name)
        getShopDiariesByShop(rowData.original.id);
    }, [actionDone, isModalVisible]);

    const formSample = (
        <EuiCard
            className='select-text'
            hasBorder
            // title='-'
            title={
                <DialogShopDiary
                    rowData={rowData}
                    buttonProp={{ mode: 11, iconType: 'plus', label: 'plus', color: 'success', bColor: 'border-fuchsia-900/75' }}
                    setactionDone={setactionDone}
                    cbShopData={cbShopData}
                />
            }
            description={
                <>
                    <EuiSkeletonRectangle
                        isLoading={isLoading}
                        contentAriaLabel="Demo skeleton card"
                        width={400}
                        height={148}
                        borderRadius="m"
                    >
                        <EuiBasicTable
                            compressed={true}
                            tableCaption="Demo of EuiBasicTable"
                            items={dataShopDiaries}
                            rowHeader="firstName"
                            columns={columns}
                        />
                    </EuiSkeletonRectangle>
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
        <div className='w-96'>
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