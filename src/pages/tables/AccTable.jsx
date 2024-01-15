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
    EuiIcon
} from '@elastic/eui';
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

                // response.data.map((data, index) => {
                //     data.createdDateTime = new Date(data.createdDateTime);
                // });

                // var activeAcc = response.data.filter(x => x.isActive == true)
                var activeAcc = response.data

                const sortActiveAcc = activeAcc.sort((a, b) => b.balance - a.balance)
                console.log(sortActiveAcc)

                setBankAccData(sortActiveAcc)
                setisLoadingData(false);
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
        () => bankAccData.reduce((a, v) => a = a + v.balance, 0),
        [bankAccData],
    );

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name', //access nested data with dot notation
                header: 'Name',
                muiTableBodyCellProps: {
                    align: 'center',
                },
                size: 150
            },
            {
                accessorKey: 'balance',
                header: 'Balance',
                size: 150,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                Cell: ({ cell }) => (
                    <div className={`${cell.getValue() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {cell.getValue().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                ),
                Footer: () => (
                    <div className='grid grid-cols-2 gap-4'>
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
                muiTableBodyCellProps: {
                    align: 'center',
                },
                filterVariant: 'date-range',
                Cell: ({ cell }) => moment(cell.getValue()).format("YYYY/MM/DD"), //render Date as a string
                size: 200,
            },
            {
                accessorKey: 'isActive',
                header: 'IsActive',
                muiTableBodyCellProps: {
                    align: 'center',
                },
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
        setactionDone(false);
        getdsaccounts();
    }, [actionDone]);

    const table = useMaterialReactTable({
        columns,
        data: bankAccData,
        enableGrouping: true,
        enableColumnResizing: true,
        state: {
            isLoading: isLoadingData, //cell skeletons and loading overlay
        },
        initialState: {
            density: 'compact',
        },
        // enableRowActions: true,
        // displayColumnDefOptions: {
        //     'mrt-row-actions': {
        //         size: 80, //make actions column wider
        //     },
        // },
        // renderRowActions: ({ row, table }) => (
        //     <div className='grid gap-2 grid-cols-2'>
        //         <DialogDSAccount2
        //             rowData={row}
        //             buttonProp={{ mode: 2, iconType: 'wrench', label: 'wrench', color: 'primary', bColor: 'border-indigo-500/75' }}
        //             setactionDone={setactionDone}
        //         />
        //         <DialogDSAccount2
        //             rowData={row}
        //             buttonProp={{ mode: 3, iconType: 'error', label: 'error', color: 'danger', bColor: 'border-rose-400/75' }}
        //             setactionDone={setactionDone}
        //         />
        //     </div>
        // ),
        // renderTopToolbarCustomActions: ({ table }) => (
        //     <DialogDSAccount2
        //         buttonProp={{ mode: 1, iconType: 'plus', label: 'plus', color: 'accent', bColor: 'border-fuchsia-900/75' }}
        //         setactionDone={setactionDone}
        //     />
        // ),
    });

    return (
        <div>
            <MaterialReactTable table={table} />
        </div>
    )
}

export default AccTable