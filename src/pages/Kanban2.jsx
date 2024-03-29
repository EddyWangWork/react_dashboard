import {
    EuiCard,
    EuiDragDropContext,
    EuiDraggable,
    EuiDroppable,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSkeletonLoading,
    EuiSkeletonRectangle,
    euiDragDropMove,
    euiDragDropReorder,
    htmlIdGenerator
} from '@elastic/eui';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { DialogKanban } from '../pages';

const makeId = htmlIdGenerator();

const Kanban2 = () => {

    const {
        handleClearToken, token, urlKanban
    } = useStateContext();
    const navigate = useNavigate();

    const [data, setdata] = useState([]);
    const [isInit, setisInit] = useState(true);
    const [isDragend, setisDragend] = useState(false);
    const [actionDone, setactionDone] = useState(false);
    const [isLoading, setisLoading] = useState(true);

    const updateKanban = (v) => data.find(x => x.status == v)?.kanbanDetails ?? [];
    const updateKanbanList = () => {
        setList1(updateKanban(1));
        setList2(updateKanban(2));
        setList3(updateKanban(3));
    };

    const [list1, setList1] = useState([]);
    const [list2, setList2] = useState([]);
    const [list3, setList3] = useState([]);

    const kanbanTitles = [
        { id: 1, title: 'To Do', count: list1.length },
        { id: 2, title: 'In Progress', count: list2.length },
        { id: 3, title: 'Done', count: list3.length },
    ]

    const DataInit = useMemo(
        () => {
            if ((data.length > 0 && isInit) || actionDone) {
                updateKanbanList();
                setisInit(false);
                setactionDone(false);
                setisLoading(false);
            }
        }, [data]
    );

    const getKanban = () => {
        axios
            .get(`${urlKanban}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                response.data.map((v) => {
                    v.kanbanDetails.map((vv) => {
                        vv.guid = makeId();
                    })

                })
                setdata(response.data)
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

    const editKanban = (id, req) => {
        axios.put(`${urlKanban}/${id}`, req, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const onDragEnd = ({ source, destination }) => {
        const lists = {
            '1': list1,
            '2': list2,
            '3': list3,
        };
        const actions = {
            '1': setList1,
            '2': setList2,
            '3': setList3,
        };

        if (source && destination) {
            if (source.droppableId === destination.droppableId) {
                const items = euiDragDropReorder(
                    lists[destination.droppableId],
                    source.index,
                    destination.index
                );

                actions[destination.droppableId](items);

                var dataChange = items[destination.index];

                dataChange.priority = destination.index + 1;
                editKanban(dataChange.id, dataChange);
            } else {
                const sourceId = source.droppableId;
                const destinationId = destination.droppableId;
                const result = euiDragDropMove(
                    lists[sourceId],
                    lists[destinationId],
                    source,
                    destination
                );

                actions[sourceId](result[sourceId]);
                actions[destinationId](result[destinationId]);

                var dataChange = result[destinationId].find((x) => data.find(x => x.status == +sourceId).kanbanDetails.some(y => y.id == x.id))

                dataChange.status = destinationId
                editKanban(dataChange.id, dataChange);

                setisDragend(true);
            }
        }
    };

    const kanbanTitleCss = (v) => v == 1 ? 'text-sky-800' : v == 2 ? 'text-yellow-800' : 'text-green-800';

    const kanbanTitle = (v) => {
        return <div className='grid gap-2 grid-cols-3 pb-1'>
            <p className={`col-span-2 ${kanbanTitleCss(v.id)}`}>
                {v.title}
                <span className='text-xs text-stone-400'>- {v.count} items</span>
            </p>
            <DialogKanban
                buttonProp={{ mode: 1, iconType: 'plus', label: 'plus', color: 'accent', bColor: 'border-fuchsia-900/75' }}
                setactionDone={setactionDone}
                setisLoading={setisLoading}
            />
        </div>
    }

    const kanbanContentCss = (v) =>
        v == 1 ? 'bg-blue-500 shadow-blue-500/50' :
            v == 2 ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-green-500 shadow-green-500/50';

    const cardTemplate = (title, content, state, kanbanId, id) => {
        return <div className={`${kanbanContentCss(kanbanId)} rounded-lg shadow-lg`}>
            <EuiCard
                textAlign="left"
                title={
                    <div className='grid gap-2 grid-cols-2'>
                        <span className='text-sm'>{title}</span>
                        <div className='flex flex-row-reverse gap-1'>
                            <DialogKanban
                                rowData={data.find(x => x.status == kanbanId).kanbanDetails.find(y => y.id == id)}
                                buttonProp={{ mode: 3, iconType: 'error', label: 'error', color: 'danger', bColor: 'border-rose-400/75' }}
                                setactionDone={setactionDone}
                                setisLoading={setisLoading}
                            />
                            <DialogKanban
                                rowData={data.find(x => x.status == kanbanId).kanbanDetails.find(y => y.id == id)}
                                buttonProp={{ mode: 2, iconType: 'wrench', label: 'wrench', color: 'success', bColor: 'border-indigo-900/75' }}
                                setactionDone={setactionDone}
                                setisLoading={setisLoading}
                            />
                        </div>
                    </div>
                }
                description={
                    <span className='text-sm text-stone-400'>
                        {content}
                        {state.isDragging && ' ✨'}
                    </span>
                }
            >
            </EuiCard>
        </div>

    }

    const updateData = () => {
        var dataNew = [
            {
                status: 1,
                kanbanDetails: list1
            },
            {
                status: 2,
                kanbanDetails: list2
            },
            {
                status: 3,
                kanbanDetails: list3
            }
        ]
        setdata(dataNew);
    }

    useEffect(() => {
        if (isInit || actionDone) {
            getKanban();
        }
    }, [actionDone, isLoading]);

    const ViewKanban = () => useMemo(
        () => {
            {
                if (isDragend) {
                    updateData();
                    setisDragend(false);
                }

                return <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
                    <Header category='Page' title='Kanban' />
                    <EuiSkeletonLoading
                        isLoading={isLoading}
                        contentAriaLabel="Demo loading section"
                        loadingContent={
                            <EuiSkeletonRectangle width="100%" height={250} />
                        }
                        loadedContent={
                            <EuiDragDropContext onDragEnd={onDragEnd}>
                                <EuiFlexGroup>
                                    <EuiFlexItem>
                                        {kanbanTitle(kanbanTitles[0])}
                                        <EuiDroppable
                                            droppableId="1"
                                            type="TYPE_ONE"
                                            spacing="m"
                                            withPanel
                                            grow={false}
                                        >
                                            {list1.map(({ title, content, id, guid }, idx) => (
                                                <EuiDraggable key={id} index={idx} draggableId={guid} spacing="m">
                                                    {(provided, state) => (
                                                        cardTemplate(title, content, state, kanbanTitles[0].id, id)
                                                    )}
                                                </EuiDraggable>
                                            ))}
                                        </EuiDroppable>
                                    </EuiFlexItem>
                                    <EuiFlexItem>
                                        {kanbanTitle(kanbanTitles[1])}
                                        <EuiDroppable
                                            droppableId="2"
                                            type="TYPE_ONE"
                                            spacing="m"
                                            withPanel
                                            grow={false}
                                        >
                                            {list2.map(({ title, content, id, guid }, idx) => (
                                                <EuiDraggable key={id} index={idx} draggableId={guid} spacing="m">
                                                    {(provided, state) => (
                                                        cardTemplate(title, content, state, kanbanTitles[1].id, id)
                                                    )}
                                                </EuiDraggable>
                                            ))}
                                        </EuiDroppable>
                                    </EuiFlexItem>
                                    <EuiFlexItem>
                                        {kanbanTitle(kanbanTitles[2])}
                                        <EuiDroppable
                                            droppableId="3"
                                            type="TYPE_ONE"
                                            spacing="m"
                                            withPanel
                                            grow={true}
                                        >
                                            {list3.map(({ title, content, id, guid }, idx) => (
                                                <EuiDraggable key={id} index={idx} draggableId={guid} spacing="m">
                                                    {(provided, state) => (
                                                        cardTemplate(title, content, state, kanbanTitles[2].id, id)
                                                    )}
                                                </EuiDraggable>
                                            ))}
                                        </EuiDroppable>
                                    </EuiFlexItem>
                                </EuiFlexGroup>
                            </EuiDragDropContext>
                        }
                    />
                </div >
            }
        },
        [isDragend, list1, list2, list3, isLoading],
    );

    return (
        ViewKanban()
    );
}

export default Kanban2