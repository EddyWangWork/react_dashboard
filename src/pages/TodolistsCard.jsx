import {
    EuiButton,
    EuiCard,
    EuiFlexItem,
    EuiText
} from '@elastic/eui';
import axios from 'axios';
import { format } from 'date-fns';
import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DialogTodolists2 } from '../pages';
import { useStateContext } from '../contexts/ContextProvider';

const TodolistsCard = () => {

    const {
        handleClearToken, token, urlTodolist,
        urlgetTodolistTypes
    } = useStateContext();

    const [tdlData, setTdlData] = useState([]);

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

                    data.original = {};
                    data.original.id = data.id;
                    data.original.name = data.name;
                    data.original.description = data.description;
                    data.original.updateDate = data.updateDate;
                    data.original.category = data.category;
                    data.original.categoryID = data.categoryID;
                });
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

    useEffect(() => {
        setactionDone(false);
        getTodolistsCategory();
    }, [actionDone]);

    return (
        <div className="pt-6 grid grid-cols-3 gap-8">
            {
                tdlData.map((v, i) => {
                    return <EuiFlexItem key={i} className='bg-blue-500 shadow-lg shadow-blue-500/50 rounded-lg'>
                        <EuiCard
                            className='select-text'
                            title='-'
                            description={
                                <>
                                    <EuiText size="s">
                                        <p className='select-text'>
                                            {v.description}
                                        </p>

                                    </EuiText>
                                </>
                            }
                            footer={
                                <div>
                                    <DialogTodolists2
                                        rowData={v}
                                        buttonProp={{ mode: 2, iconType: 'check', label: 'check', color: 'success', bColor: 'border-green-900/75' }}
                                        setactionDone={setactionDone}
                                    />
                                </div>
                            }
                            betaBadgeProps={{
                                label: v.name,
                                color: 'accent',
                                tooltipContent:
                                    'You can change the badge color using betaBadgeProps.color.',
                            }}
                        />
                    </EuiFlexItem>
                })}
        </div>
    )
}

export default TodolistsCard