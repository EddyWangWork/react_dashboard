import {
    EuiTabbedContent
} from '@elastic/eui';
// import '@elastic/eui/dist/eui_theme_dark.css';
import React, { useEffect, useState } from 'react';
import { Header } from '../components';
import { TodolistDoneTable, TodolistTable, TodolistsCard } from '../pages';

const Todolists = () => {
    const [tabCurrent, settabCurrent] = useState([]);

    useEffect(() => {
    }, [tabCurrent]);

    const tabsValue = [
        {
            id: 'todolistCard',
            name: 'TodolistCard',
            content: <TodolistsCard />,
        },
        {
            id: 'dextrose',
            name: 'Todolist',
            content: <TodolistTable />,
        },
        {
            id: 'hydrogen',
            name: 'Todolist-Done',
            content: <TodolistDoneTable />,
        }
    ];

    return (
        <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
            <Header category='Page' title='Todolists' />
            <EuiTabbedContent
                tabs={tabsValue}
                initialSelectedTab={tabsValue[0]}
                autoFocus="selected"
                onTabClick={(tab) => {
                    settabCurrent(tab);
                }}
            />
        </div >
    )
}

export default Todolists