import axios from 'axios';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import { DialogTodolists2 } from '../../pages';

const TodolistTable = () => {

    const {
        handleClearToken, token, urlTodolist,
        urlgetTodolistTypes
    } = useStateContext();

    const [cbCatData, setcbCatData] = useState([]);
    const [tdlData, setTdlData] = useState([]);
    const [isLoadingData, setisLoadingData] = useState(true);

    const [actionDone, setactionDone] = useState(false);

    const navigate = useNavigate();

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
                getTodolistsAll(response.data)
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

    const getTodolistsAll = (category) => {
        axios
            .get(`${urlTodolist}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                console.log(response.data)
                response.data.map((data, index) => {
                    data.category = category.find(x => x.id == data.categoryID).name;
                });
                setTdlData(response.data);
                setisLoadingData(false);
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
            },
            {
                accessorKey: 'description',
                header: 'Description',
                size: 300,
            },
            {
                accessorFn: (row) => new Date(row.updateDate), //convert to Date for sorting and filtering
                accessorKey: 'updateDate',
                header: 'Date',
                filterVariant: 'date-range',
                Cell: ({ cell }) => moment(cell.getValue()).format("YYYY/MM/DD"), //render Date as a string
                size: 150,
            },
            {
                accessorKey: 'category',
                header: 'Category',
                size: 150,
            }
        ],
        [],
    );

    useEffect(() => {
        setactionDone(false);
        getTodolistsCategory();
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
            <div className='grid gap-2 grid-cols-3'>
                <DialogTodolists2
                    cbCatData={cbCatData}
                    rowData={row}
                    buttonProp={{ mode: 2, iconType: 'check', label: 'check', color: 'success', bColor: 'border-green-900/75' }}
                    setactionDone={setactionDone}
                />
                <DialogTodolists2
                    cbCatData={cbCatData}
                    rowData={row}
                    buttonProp={{ mode: 11, iconType: 'wrench', label: 'wrench', color: 'primary', bColor: 'border-indigo-500/75' }}
                    setactionDone={setactionDone}
                />
                <DialogTodolists2
                    cbCatData={cbCatData}
                    rowData={row}
                    buttonProp={{ mode: 12, iconType: 'error', label: 'error', color: 'danger', bColor: 'border-rose-400/75' }}
                    setactionDone={setactionDone}
                />
            </div>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <DialogTodolists2
                cbCatData={cbCatData}
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

export default TodolistTable;
