import {
    EuiButtonIcon,
    EuiIcon
} from '@elastic/eui';
import axios from 'axios';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import { DialogDSAccount2 } from '../../pages';

const AccTable = () => {

    const {
        handleClearToken, token, urldsAccont
    } = useStateContext();

    const [bankAccData, setBankAccData] = useState([]);
    const [isLoadingData, setisLoadingData] = useState(true);
    const [isRefresh, setisRefresh] = useState(false);

    const [actionDone, setactionDone] = useState(false);

    const navigate = useNavigate();

    const getdsaccounts = () => {
        axios
            .get(`${urldsAccont}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)

                setBankAccData(response.data)
                setisLoadingData(false);

                console.log(table);
            })
            .catch((err) => {
                console.log(err);
                console.log(err.response.status);
                if (err.response.status == 401) {
                    handleClearToken();
                    navigate('/login', { replace: true });
                    window.location.reload();
                }
            });
    }

    const sumBalance = useMemo(
        () => bankAccData.filter(x => x.isActive == true).reduce((a, v) => a = a + v.balance, 0),
        [bankAccData],
    );

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name', //access nested data with dot notation
                header: 'Name',
                // filterVariant: 'select',
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                size: 150
            },
            {
                accessorKey: 'balance',
                header: 'Balance',
                size: 150,
                muiTableHeadCellProps: {
                    align: 'right',
                },
                muiTableBodyCellProps: {
                    align: 'right',
                },
                Cell: ({ cell }) => (
                    <div className={`${cell.getValue() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {cell.getValue().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                ),
                Footer: () => (
                    // <div className='grid grid-cols-2 gap-4'>
                    <div className='flex justify-end gap-4'>
                        <div>
                            Sum
                        </div>
                        <div className={`${sumBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {sumBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                ),
            },
            {
                accessorFn: (row) => new Date(row.createdDateTime), //convert to Date for sorting and filtering
                accessorKey: 'createdDateTime',
                header: 'Last Update Date',
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                filterVariant: 'date-range',
                Cell: ({ cell }) => moment(cell.getValue()).format("YYYY/MM/DD"), //render Date as a string
                size: 200,
            },
            {
                accessorKey: 'isActive',
                header: 'Status',
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                filterVariant: 'checkbox',
                Cell: ({ cell }) => (
                    <div className={`${cell.getValue() == true ? 'text-green-500' : 'text-red-500'}`}>
                        <EuiIcon type="dot" />
                    </div>
                ),
                size: 150,
            }
        ],
        [bankAccData],
    );

    useEffect(() => {
        setisRefresh(false);
        setactionDone(false);
        setisLoadingData(true);
        getdsaccounts();
    }, [actionDone, isRefresh]);

    const table = useMaterialReactTable({
        columns,
        data: bankAccData,
        enableGrouping: false,
        enableColumnResizing: false,
        state: {
            isLoading: isLoadingData, //cell skeletons and loading overlay
        },
        initialState: {
            density: 'compact',
            columnFilters: [
                {
                    id: 'isActive',
                    value: true,
                },
            ],
        },
        enableRowActions: true,
        displayColumnDefOptions: {
            'mrt-row-actions': {
                size: 80, //make actions column wider
            },
        },
        renderRowActions: ({ row, table }) => (
            <div className='flex flex-row gap-2'>
                <DialogDSAccount2
                    rowData={row}
                    buttonProp={{ mode: 2, iconType: 'wrench', label: 'wrench', color: 'primary', bColor: 'border-indigo-500/75' }}
                    setactionDone={setactionDone}
                />
                <DialogDSAccount2
                    rowData={row}
                    buttonProp={{ mode: 3, iconType: 'error', label: 'error', color: 'danger', bColor: 'border-rose-400/75' }}
                    setactionDone={setactionDone}
                />
            </div>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <div className='flex flex-row gap-2'>
                <div>
                    <DialogDSAccount2
                        buttonProp={{ mode: 1, iconType: 'plus', label: 'plus', color: 'accent', bColor: 'border-fuchsia-900/75' }}
                        setactionDone={setactionDone}
                    />
                </div>
                <div>
                    <EuiButtonIcon
                        display="base"
                        iconType='refresh'
                        aria-label='refresh'
                        color='success'
                        onClick={() => { setisRefresh(true) }}
                    />
                </div>
            </div>
        ),
    });

    return (
        <div>
            <MaterialReactTable table={table} />
        </div>
    )
}

export default AccTable