import axios from 'axios';
import {
    Stack,
    Box
} from '@mui/material';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {
    EuiButtonIcon
} from '@elastic/eui';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import { DialogDSItem2 } from '../../pages';

const DSItemTable = () => {

    const {
        handleClearToken, token, urlgetDSItemWithSub, urlDSItem
    } = useStateContext();
    const navigate = useNavigate();

    const [dsItemsData, setdsItemsData] = useState([]);
    const [cbDSItems, setcbDSItems] = useState([]);
    const [hasValue, sethasValue] = useState(false);

    const [isLoadingData, setisLoadingData] = useState(true);
    const [actionDone, setactionDone] = useState(false);

    const getDSItems = () => {
        axios
            .get(`${urlgetDSItemWithSub}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                setdsItemsData(response.data)
                setisLoadingData(false);
            })
            .catch((err) => {
                console.log(err);
                console.log(err.response.status);
                if (err.response.status == 401) {
                    handleClearToken();
                    navigate('/login', { replace: true });
                }
            });
    }

    const getDSItemsCategory = () => {
        axios
            .get(`${urlDSItem}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)

                var cbData = [];
                response.data.map((v) => {
                    cbData.push({ 'id': v.id, 'label': v.name })
                })

                setcbDSItems(cbData);
                sethasValue(true);
            })
            .catch((err) => {
                console.log(err);
                console.log(err.response.status);
                if (err.response.status == 401) {
                    handleClearToken();
                    navigate('/login', { replace: true });
                }
            });
    }

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name', //access nested data with dot notation
                header: 'Name',
                muiTableBodyCellProps: {
                    align: 'center',
                },
                // size: 150
            },
            {
                accessorKey: 'subName', //access nested data with dot notation
                header: 'SubName',
                muiTableBodyCellProps: {
                    align: 'center',
                },
                // size: 150
            },
        ],
        [cbDSItems],
    );

    const BtnEditDSItem = (data) => useMemo(
        () => {
            {
                return hasValue && <div className='grid gap-2 grid-cols-3'>
                    {data.original.subName == null ?
                        <DialogDSItem2
                            rowData={data}
                            buttonProp={{ mode: 21, iconType: 'plus', label: 'plus', color: 'accent', bColor: 'border-fuchsia-900/75' }}
                            setactionDone={setactionDone}
                            cbDSItems={cbDSItems}
                        /> :
                        <div className='invisible'>
                        </div>
                    }
                    <DialogDSItem2
                        rowData={data}
                        buttonProp=
                        {
                            data.original.subName == null ?
                                { mode: 2, iconType: 'wrench', label: 'wrench', color: 'success', bColor: 'border-indigo-900/75' } :
                                { mode: 22, iconType: 'wrench', label: 'wrench', color: 'primary', bColor: 'border-indigo-500/75' }
                        }
                        setactionDone={setactionDone}
                        cbDSItems={cbDSItems}
                    />
                    <DialogDSItem2
                        rowData={data}
                        buttonProp={
                            data.original.subName == null ?
                                { mode: 3, iconType: 'error', label: 'error', color: 'danger', bColor: 'border-rose-400/75' } :
                                { mode: 23, iconType: 'error', label: 'error', color: 'danger', bColor: 'border-rose-400/75' }
                        }
                        setactionDone={setactionDone}
                        cbDSItems={cbDSItems}
                    />
                </div>
            }
        },
        [hasValue],
    );

    useEffect(() => {
        setisLoadingData(true);
        setactionDone(false);
        getDSItemsCategory();
        getDSItems();
    }, [actionDone]);

    const table = useMaterialReactTable({
        columns,
        data: dsItemsData,
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
            BtnEditDSItem(row)
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <DialogDSItem2
                buttonProp={{ mode: 1, iconType: 'plus', label: 'plus', color: 'accent', bColor: 'border-fuchsia-900/75' }}
                setactionDone={setactionDone}
                cbDSItems={[]}
            />
        ),
    });



    return (
        <div>
            <MaterialReactTable table={table} />
        </div>
    )
}

export default DSItemTable