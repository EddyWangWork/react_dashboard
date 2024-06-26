import axios from 'axios';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import { DialogShopType } from '../../pages';

const ShopTypeTable = () => {

    const {
        handleClearToken, token, urlgetShopTypes
    } = useStateContext();

    const [tdlData, setTdlData] = useState([]);
    const [isLoadingData, setisLoadingData] = useState(true);

    const [actionDone, setactionDone] = useState(false);

    const navigate = useNavigate();

    const getShopTypes = () => {
        axios
            .get(`${urlgetShopTypes}`, {
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

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name', //access nested data with dot notation
                header: 'Name',
                size: 150
            }
        ],
        [],
    );

    useEffect(() => {
        setisLoadingData(true);
        setactionDone(false);
        getShopTypes();
    }, [actionDone]);

    const table = useMaterialReactTable({
        columns,
        data: tdlData,
        enableGrouping: true,
        enableColumnResizing: true,
        state: {
            isLoading: isLoadingData, //cell skeletons and loading overlay
        },
        initialState: {
            density: 'compact',
        },
        enableRowActions: true,
        displayColumnDefOptions: {
            'mrt-row-actions': {
                size: 100, //make actions column wider
            },
        },
        renderRowActions: ({ row, table }) => (
            <div className='grid gap-2 grid-cols-2'>
                <DialogShopType
                    rowData={row}
                    buttonProp={{ mode: 2, iconType: 'wrench', label: 'wrench', color: 'primary', bColor: 'border-indigo-500/75' }}
                    setactionDone={setactionDone}
                />
                <DialogShopType
                    rowData={row}
                    buttonProp={{ mode: 3, iconType: 'error', label: 'error', color: 'danger', bColor: 'border-rose-400/75' }}
                    setactionDone={setactionDone}
                />
            </div>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <DialogShopType
                buttonProp={{ mode: 1, iconType: 'plus', label: 'plus', color: 'accent', bColor: 'border-fuchsia-900/75' }}
                setactionDone={setactionDone}
            />
        ),
    });

    return (
        <div>
            <MaterialReactTable table={table} />
        </div>
    );
};

export default ShopTypeTable;
