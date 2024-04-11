import {
    EuiComboBox,
    EuiDatePicker,
    EuiSwitch
} from '@elastic/eui';
import axios from 'axios';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import { DialogDSTransaction2 } from '../../pages';

const DSTransactionTable = () => {

    const {
        handleClearToken, token, urlgetDSTransTypes, urldsAccont, urlgetDSTransactionV2, urlgetDSItemWithSubV3
    } = useStateContext();
    const navigate = useNavigate();

    const [dsTrans, setDSTrans] = useState([]);
    const [clDSAccountName, setclDSAccountName] = useState([]);
    const [clDSTransMonth, setclDSTransMonth] = useState([]);

    const [cbNames, setcbNames] = useState([]);
    const [cbTypes, setcbTypes] = useState([]);
    const [cbAcc, setcbAcc] = useState([]);
    const [cbAccTo, setcbAccTo] = useState([]);

    const [presetDate, setpresetDate] = useState(new moment());
    const [selectedPresetType, setselectedPresetType] = useState([cbTypes[0]]);
    const [selectedPresetAcc, setselectedPresetAcc] = useState([cbAcc[0]]);
    const [selectedPresetName, setselectedPresetName] = useState([cbNames[0]]);

    const [isFirstLoad, setisFirstLoad] = useState(true);
    const [isEditMode, setisEditMode] = useState(false);
    const [isLoadingData, setisLoadingData] = useState(true);
    const [actionDone, setactionDone] = useState(false);

    const hasValue = cbNames.length != 0 && cbTypes.length != 0 && cbAcc.length != 0 && cbAccTo.length != 0;
    const getPresetData =
    {
        pDate: presetDate,
        pType: selectedPresetType[0]?.id,
        pAcc: selectedPresetAcc[0]?.id,
        pName: selectedPresetName[0]?.uid
    }
    const getDSTransactionV2Req = {
        dataLimit: isEditMode ? 100 : 0
    }

    const getDSACItems = () => {
        axios
            .get(`${urlgetDSItemWithSubV3}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)

                var cbData = [];
                var uid = 1;
                response.data.map((v) => {
                    cbData.push({ 'id': v.itemID, 'subid': v.itemSubID, 'uid': uid, 'label': v.name })
                    uid++;
                })

                if (isFirstLoad)
                    setselectedPresetName([cbData[0]]);
                setcbNames(cbData);
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

    const GetDSTransactionTypes = () => {
        axios
            .get(`${urlgetDSTransTypes}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                var res = response.data.filter(x => x.id != 4)

                var cbData = [];
                res.map((v) => {
                    cbData.push({ 'id': v.id, 'label': v.name, 'color': getTypeColor(v.id) })
                })

                if (isFirstLoad)
                    setselectedPresetType([cbData[0]]);
                setcbTypes(cbData);

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
                // var activeAcc = response.data.filter(x => x.isActive == true)
                var activeAcc = response.data;
                setclDSAccountName([...new Set(activeAcc.map(q => q.name))]);

                var cbData = [];
                activeAcc.map((v) => {
                    cbData.push({ 'id': v.id, 'label': v.name })
                })

                if (isFirstLoad)
                    setselectedPresetAcc([cbData[0]])
                setcbAcc(cbData);
                setcbAccTo(cbData.slice(1));
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

    const getdstransactions = () => {
        axios
            .post(`${urlgetDSTransactionV2}`, getDSTransactionV2Req, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                response.data.map((data, index) => {
                    data.createdDateTimeMonth = moment(data.createdDateTime).format("YYYY/MM");
                    data.createdDateTimeDay = new Date(data.createdDateTime);
                });

                getDSACItems();
                GetDSTransactionTypes();
                getdsaccounts();

                setclDSTransMonth([...new Set(response.data.map(q => q.createdDateTimeMonth))]);

                setDSTrans(isEditMode ? response.data.slice(0, 100) : response.data);
                setisLoadingData(false);

                // debugger;
                console.info(table); //table.getExpandedRowModel().rows
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

    const getTypeColor = (v) => {
        switch (v) {
            case 1:
                return '#22c55e'
            case 2:
                return '#f43f5e'
            default:
                return '#3b82f6'
        }
    }

    const getCSSAmount = (v) => {
        switch (v) {
            case 1:
                return 'text-green-500'
            case 2:
                return 'text-red-500'
            case 3:
            case 4:
            case 31:
            case 41:
                return 'text-blue-500'
        }
    }

    const getDataValue = (v) => v.original.dsTransferOutID == 0 ? v : dsTrans.find(x => x.id == v.original.dsTransferOutID);

    const ocPresetDate = (v) => {
        setpresetDate(v);
    };

    const ocSelectedPresetType = (v) => {
        setselectedPresetType(v);
    };

    const ocSelectedPresetAcc = (v) => {
        setselectedPresetAcc(v);
    };

    const ocSelectedPresetName = (v) => {
        setselectedPresetName(v);
    };

    const BtnAdd = () => useMemo(
        () => {
            {
                return hasValue &&
                    <DialogDSTransaction2
                        presetData={getPresetData}
                        buttonProp={{ mode: 1, iconType: 'plus', label: 'plus', color: 'accent', bColor: 'border-fuchsia-900/75' }}
                        setactionDone={setactionDone}
                        cbList={{ cbNames, cbTypes, cbAcc, cbAccTo }}
                    />
            }
        },
        [hasValue, cbNames, cbTypes, cbAcc, cbAccTo, getPresetData],
    );

    const viewIsEditMode = () => (
        <div>
            <EuiSwitch
                label="Is Edit Mode"
                checked={isEditMode}
                onChange={(e) => {
                    setisEditMode(!isEditMode)
                }}
            />
        </div>
    );

    const BtnEdit = (data) => useMemo(
        () => {
            {
                return hasValue &&
                    <div className='grid gap-2 grid-cols-2'>
                        <DialogDSTransaction2
                            rowData={getDataValue(data)}
                            buttonProp={{ mode: 2, iconType: 'wrench', label: 'wrench', color: 'primary', bColor: 'border-indigo-500/75' }}
                            setactionDone={setactionDone}
                            cbList={{ cbNames, cbTypes, cbAcc, cbAccTo }}
                        />
                        <DialogDSTransaction2
                            rowData={getDataValue(data)}
                            buttonProp={{ mode: 3, iconType: 'error', label: 'error', color: 'danger', bColor: 'border-rose-400/75' }}
                            setactionDone={setactionDone}
                            cbList={{ cbNames, cbTypes, cbAcc, cbAccTo }}
                        />
                    </div>
            }
        },
        [hasValue, cbNames, cbTypes, cbAcc, cbAccTo],
    );

    const columns = useMemo(
        () => [
            {
                accessorKey: 'createdDateTimeMonth', //access nested data with dot notation
                header: 'Month',
                filterVariant: 'select',
                // filterSelectOptions: clDSTransMonth,
                muiTableBodyCellProps: {
                    align: 'center',
                },
                size: 80
            },
            {
                accessorFn: (row) => new Date(row.createdDateTimeDay), //convert to Date for sorting and filtering
                accessorKey: 'createdDateTimeDay',
                header: 'Date',
                muiTableBodyCellProps: {
                    align: 'center',
                },
                filterVariant: 'date-range',
                Cell: ({ cell }) => moment(cell.getValue()).format("YYYY/MM/DD"), //render Date as a string
                size: 100,
            },
            {
                accessorKey: 'dsItemName', //access nested data with dot notation
                header: 'Name',
                filterVariant: 'multi-select',
                muiTableBodyCellProps: {
                    align: 'center',
                },
                size: 200
            },
            {
                accessorKey: 'description',
                header: 'Description',
                muiTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                filterVariant: 'range',
                filterFn: 'between',
                size: 100,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                Cell: ({ row, cell }) => (
                    <div className=
                        {
                            getCSSAmount(row.original.dsTypeID)
                        }>
                        {cell.getValue().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                ),
                Footer: ({ table }) => (
                    <div className='grid grid-cols-2 gap-1'>
                        <div>
                            {/* SUM: */}
                        </div>
                        <p className='w-4 text-center'>
                            {(table.getRowModel().rows.reduce((total, item) => {
                                return total += item.original.amount;
                            }, 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                ),
            },
            {
                accessorKey: 'balance',
                header: 'Balance',
                size: 80,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                Cell: ({ cell }) => (
                    <div>
                        {cell.getValue().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                ),
            },
            {
                accessorKey: 'dsTypeName', //dsAccountName
                header: 'Type',
                filterVariant: 'select',
                filterFn: 'equals',
                muiTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,
            },
            {
                accessorKey: 'dsAccountName', //dsAccountName
                header: 'Account',
                filterVariant: 'select',
                filterSelectOptions: clDSAccountName,
                muiTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,
            },
        ],
        [clDSAccountName],
    );

    useEffect(() => {
        setisLoadingData(true);
        setactionDone(false);
        getdstransactions();
        setisFirstLoad(false);
    }, [actionDone, isEditMode]);

    const table = useMaterialReactTable({
        columns,
        data: dsTrans,
        enableGrouping: true,
        enableColumnResizing: true,
        enableFacetedValues: true,
        state: {
            isLoading: isLoadingData,
            showColumnFilters: true
        },
        initialState: {
            density: 'compact',
        },
        enableRowActions: true,
        displayColumnDefOptions: {
            'mrt-row-actions': {
                size: 70, //make actions column wider
            },
        },
        renderRowActions: ({ row, table }) => (
            BtnEdit(row)
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <div className='flex flex-row gap-2'>
                {BtnAdd()}
                {viewIsEditMode()}
            </div>

        ),
    });

    const ViewPreset = () => useMemo(
        () => {
            {
                return hasValue > 0 &&
                    <div href="#" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700" >
                        <div className='grid gap-2 grid-cols-5'>
                            <div>
                                <EuiComboBox
                                    aria-label="Accessible screen reader label"
                                    placeholder="Select a single option"
                                    singleSelection={true}
                                    options={cbTypes}
                                    selectedOptions={selectedPresetType}
                                    onChange={ocSelectedPresetType}
                                    isClearable={false}
                                />
                            </div>
                            <div>
                                <EuiComboBox
                                    aria-label="Accessible screen reader label"
                                    placeholder="Select a single option"
                                    singleSelection={{ asPlainText: true }}
                                    options={cbAcc}
                                    selectedOptions={selectedPresetAcc}
                                    onChange={ocSelectedPresetAcc}
                                    isClearable={false}
                                />
                            </div>
                            <div>
                                <EuiDatePicker preventOpenOnFocus={true} dateFormat="YYYY/MM/DD" name="presetDate" selected={presetDate} onChange={ocPresetDate} />
                            </div>
                            <div className='col-span-2'>
                                <EuiComboBox
                                    aria-label="Accessible screen reader label"
                                    placeholder="Select a single option"
                                    singleSelection={{ asPlainText: true }}
                                    options={cbNames}
                                    selectedOptions={selectedPresetName}
                                    onChange={ocSelectedPresetName}
                                    isClearable={false}
                                />
                            </div>
                        </div>
                    </div >
            }
        },
        [presetDate, selectedPresetType, selectedPresetAcc, selectedPresetName],
    );

    return (
        <div>
            <div>
                <div className='pt-2'>
                    {ViewPreset()}
                </div>
                <MaterialReactTable table={table} />
            </div>

        </div>
    );
}

export default DSTransactionTable