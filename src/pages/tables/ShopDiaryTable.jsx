import { euiPaletteColorBlindBehindText } from '@elastic/eui';
import axios from 'axios';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import { DialogShopDiary } from '../../pages';

const ShopDiaryTable = () => {

    const {
        handleClearToken, token, urlgetShopDiaries,
        urlgetShops
    } = useStateContext();

    const [cbShopData, setcbShopData] = useState([]);
    const [tdlData, setTdlData] = useState([]);
    const [isLoadingData, setisLoadingData] = useState(true);

    const [actionDone, setactionDone] = useState(false);

    const navigate = useNavigate();

    const visColorsBehindText = euiPaletteColorBlindBehindText();

    const getShopDiaries = () => {
        axios
            .get(`${urlgetShopDiaries}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                setisLoadingData(false);
                setTdlData(response.data);
            })
            .catch((err) => {
                console.log(err);
                console.log(err?.response?.status);
                if (err?.response?.status == 401) {
                    handleClearToken();
                    navigate('/login', { replace: true });
                    window.location.reload();
                }
            });
    }

    const getShops = () => {
        axios
            .get(`${urlgetShops}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)

                var cbData = [];
                response.data.map((v, i) => {
                    cbData.push({ 'id': v.id, 'label': v.name, 'color': visColorsBehindText[i] })
                })

                setcbShopData(cbData);
            })
            .catch((err) => {
                console.log(err);
                console.log(err?.response?.status);
                if (err?.response?.status == 401) {
                    handleClearToken();
                    navigate('/login', { replace: true });
                    window.location.reload();
                }
            });
    }

    const columns = useMemo(
        () => [
            {
                accessorKey: 'shopName',
                header: 'ShopName',
                size: 150
            },
            {

                accessorKey: 'date',
                header: 'Date',
                maxSize: 100,
                filterVariant: 'date-range',
                accessorFn: (row) => new Date(row.date), //convert to Date for sorting and filtering
                Cell: ({ cell }) => moment(cell.getValue()).format("YYYY/MM/DD"), //render Date as a string
            },
            {
                accessorKey: 'remark',
                header: 'Remark',
                size: 150
            },
            {
                accessorKey: 'comment',
                header: 'Comment',
                size: 150
            }
        ],
        [],
    );

    useEffect(() => {
        setisLoadingData(true);
        setactionDone(false);
        getShopDiaries();
        getShops();
    }, [actionDone]);

    const table = useMaterialReactTable({
        columns,
        data: tdlData,
        enableGrouping: true,
        enableColumnResizing: false,
        enableColumnDragging: false,
        state: {
            isLoading: isLoadingData, //cell skeletons and loading overlay
        },
        initialState: {
            density: 'compact',
        },
        enableRowActions: true,
        displayColumnDefOptions: {
            'mrt-row-actions': {
                size: 50, //make actions column wider
            },
        },
        renderRowActions: ({ row, table }) => (
            <div className='flex flex-row gap-2'>
                <DialogShopDiary
                    rowData={row}
                    buttonProp={{ mode: 2, iconType: 'wrench', label: 'wrench', color: 'primary', bColor: 'border-indigo-500/75' }}
                    setactionDone={setactionDone}
                    cbShopData={cbShopData}
                />
                <DialogShopDiary
                    rowData={row}
                    buttonProp={{ mode: 3, iconType: 'error', label: 'error', color: 'danger', bColor: 'border-rose-400/75' }}
                    setactionDone={setactionDone}
                    cbShopData={cbShopData}
                />
            </div>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <DialogShopDiary
                buttonProp={{ mode: 1, iconType: 'plus', label: 'plus', color: 'accent', bColor: 'border-fuchsia-900/75' }}
                setactionDone={setactionDone}
                cbShopData={cbShopData}
            />
        ),
    });

    return (
        <div>
            <MaterialReactTable table={table} />
        </div>
    );
};

export default ShopDiaryTable;
