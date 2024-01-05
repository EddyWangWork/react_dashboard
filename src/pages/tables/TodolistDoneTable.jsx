import {
    Box
} from '@mui/material';
import axios from 'axios';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import moment from 'moment';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import { DialogTodolists2 } from '../../pages';

const TodolistDoneTable = () => {

    const {
        handleClearToken, token, urlTodolistDone,
        urlgetTodolistTypes
    } = useStateContext();

    const navigate = useNavigate();

    const [cbCatData, setcbCatData] = useState([]);
    const [tdlDoneData, setTdlDoneData] = useState([]);
    const [isLoadingData, setisLoadingData] = useState(true);

    const [actionDone, setactionDone] = useState(false);

    const getTodolistsCategory = () => {
        axios
            .get(`${urlgetTodolistTypes}`, {
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
                setcbCatData(cbData);
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

    const getTodolistsDone = () => {
        axios
            .get(`${urlTodolistDone}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                setisLoadingData(false);
                setTdlDoneData(response.data);
            })
            .catch((err) => {
                console.log(err);
                console.error(err);
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
                accessorKey: 'todolistName', //access nested data with dot notation
                header: 'Name',
                size: 150
            },
            {
                accessorKey: 'todolistDescription',
                header: 'Description',
                size: 300,
            },
            {
                accessorKey: 'todolistCategory',
                header: 'Type',
                Cell: ({ cell }) => (
                    <Box
                        component="span"
                        sx={(theme) => ({
                            backgroundColor:
                                cell.getValue() == 'Monthly' ?
                                    'green' :
                                    'red',
                            borderRadius: '0.25rem',
                            color: '#fff',
                            maxWidth: '9ch',
                            p: '0.25rem',
                        })}
                    >
                        {cell.getValue() == 'Monthly' ? 'M' : 'N'}
                    </Box>
                ),
                size: 100,
            },
            {
                accessorFn: (row) => new Date(row.updateDate), //convert to Date for sorting and filtering
                accessorKey: 'updateDate',
                header: 'Date',
                maxSize: 100,
                filterVariant: 'date-range',
                Cell: ({ cell }) => moment(cell.getValue()).format("YYYY/MM/DD"), //render Date as a string
            },
            {
                accessorKey: 'remark',
                header: 'Remark',
                maxSize: 150,
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: tdlDoneData,
        enableGrouping: true,
        enableColumnResizing: true,
        state: {
            isLoading: isLoadingData, //cell skeletons and loading overlay
        },
        initialState: {
            density: 'compact'
        },
        enableRowActions: true,
        renderRowActions: ({ row, table }) => (
            <div className='grid gap-2 grid-cols-2'>
                <DialogTodolists2
                    cbCatData={cbCatData}
                    rowData={row}
                    buttonProp={{ mode: 21, iconType: 'wrench', label: 'wrench', color: 'primary', bColor: 'border-indigo-500/75' }}
                    setactionDone={setactionDone}
                />
                <DialogTodolists2
                    cbCatData={cbCatData}
                    rowData={row}
                    buttonProp={{ mode: 22, iconType: 'error', label: 'error', color: 'danger', bColor: 'border-rose-400/75' }}
                    setactionDone={setactionDone}
                />
            </div>
        ),
    });

    useEffect(() => {
        setactionDone(false);
        getTodolistsCategory();
        getTodolistsDone();
    }, [actionDone]);

    return (
        <div>
            <MaterialReactTable table={table} />
        </div>
    )
}

export default TodolistDoneTable