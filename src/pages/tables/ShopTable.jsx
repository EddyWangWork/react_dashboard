import { EuiBadge, EuiIcon, euiPaletteColorBlindBehindText } from '@elastic/eui';
import axios from 'axios';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import { DialogShop, DialogShopDiary, DialogShopDiaryDetail } from '../../pages';

const ShopTable = () => {

    const {
        handleClearToken, token, urlgetShops,
        urlgetShopTypes
    } = useStateContext();

    const [cbTypeData, setcbTypeData] = useState([]);
    const [cbShopData, setcbShopData] = useState([]);

    const [typeColor, settypeColor] = useState({});

    const [tdlData, setTdlData] = useState([]);
    const [isLoadingData, setisLoadingData] = useState(true);

    const [actionDone, setactionDone] = useState(false);
    const [actionDone2, setactionDone2] = useState(false);

    const visColorsBehindText = euiPaletteColorBlindBehindText();

    const navigate = useNavigate();

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

                //unique                
                var uniqueTypeList = {};
                var typeCount = 0;
                response.data.map((v, i) => {
                    v.typeList.map((vv, ii) => {
                        if (!uniqueTypeList[vv]) {
                            uniqueTypeList[vv] = visColorsBehindText[typeCount]
                            typeCount++;
                        }
                    })
                })
                settypeColor(uniqueTypeList);

                var cbData = [];
                response.data.map((v, i) => {
                    cbData.push({ 'id': v.id, 'label': v.name, 'color': visColorsBehindText[i] })
                    v.typeList.sort();
                })

                setcbShopData(cbData.sort((a, b) => a.label.localeCompare(b.label)));

                setisLoadingData(false);
                setTdlData(response.data)
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

                var cbData = [];
                response.data.map((v, i) => {
                    cbData.push({ 'id': v.id, 'label': v.name, 'color': visColorsBehindText[i] })
                })

                setcbTypeData(cbData.sort((a, b) => a.label.localeCompare(b.label)));
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

    const getStar = (star) => {
        const stars = []

        for (let i = 0; i < star; i++) {
            stars.push(<EuiIcon type="starFilledSpace" />);
        }

        return stars;
    }

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                size: 150
            },
            {
                accessorKey: 'location',
                header: 'Location',
                size: 150,
            },
            {
                accessorKey: 'typeList',
                header: 'Types',
                Cell: ({ cell }) => (
                    <div>
                        {cell.getValue().map((x, i) =>
                            <EuiBadge color={typeColor[x]}>{x}</EuiBadge>
                        )}
                    </div>
                ),
                size: 150,
            },
            {
                accessorKey: 'star',
                header: 'Star',
                Cell: ({ cell }) => (
                    <div>
                        {
                            getStar(cell.getValue())
                        }
                    </div>
                ),
                size: 50,
            },
            {
                accessorKey: 'isVisited',
                header: 'Visited',
                muiTableBodyCellProps: {
                    align: 'center',
                },
                Cell: ({ cell }) => (
                    <div className={`${cell.getValue() == true ? 'text-green-500' : 'text-red-500'}`}>
                        <EuiIcon type="starFilledSpace" />
                    </div>
                ),
                size: 80,
            },
            {
                accessorKey: 'remark',
                header: 'Remark',
                size: 150,
            },
            {
                accessorKey: 'comment',
                header: 'Comment',
                size: 150,
            },
            {
                accessorKey: 'visitedCount',
                header: 'Count',
                size: 50,
            }
        ],
        [typeColor],
    );

    useEffect(() => {
        setisLoadingData(true);
        setactionDone(false);
        setactionDone2(false);
        getShops();
        getShopTypes();
    }, [actionDone, actionDone2]);

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
                size: 120, //make actions column wider
            },
        },
        renderRowActions: ({ row, table }) => (
            <div className='grid gap-2 grid-cols-4'>
                <DialogShop
                    rowData={row}
                    buttonProp={{ mode: 2, iconType: 'wrench', label: 'wrench', color: 'primary', bColor: 'border-green-900/75' }}
                    setactionDone={setactionDone}
                    cbTypeData={cbTypeData}
                />
                <DialogShop
                    rowData={row}
                    buttonProp={{ mode: 3, iconType: 'error', label: 'error', color: 'danger', bColor: 'border-rose-400/75' }}
                    setactionDone={setactionDone}
                    cbTypeData={cbTypeData}
                />
                <DialogShopDiary
                    rowData={row}
                    buttonProp={{ mode: 11, iconType: 'plus', label: 'plus', color: 'success', bColor: 'border-fuchsia-900/75' }}
                    setactionDone={setactionDone}
                    cbShopData={cbShopData}
                />
                <DialogShopDiaryDetail
                    rowData={row}
                    buttonProp={{ mode: 11, iconType: 'eye', label: 'eye', color: 'warning', bColor: 'border-fuchsia-900/75' }}
                    setactionDone2={setactionDone2}
                    cbShopData={cbShopData}
                />
            </div>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <DialogShop
                buttonProp={{ mode: 1, iconType: 'plus', label: 'plus', color: 'accent', bColor: 'border-fuchsia-900/75' }}
                setactionDone={setactionDone}
                cbTypeData={cbTypeData}
            />
        ),
    });

    return (
        <div>
            <MaterialReactTable table={table} />
        </div>
    );
};

export default ShopTable;
