import { useEffect, useState } from 'react';
import {
    EuiTabbedContent
} from '@elastic/eui';
import { AccTable, DSItemTable } from '../pages'
import { Header } from '../components';

const Transaction2 = () => {
    const [tabCurrent, settabCurrent] = useState([]);

    useEffect(() => {
    }, [tabCurrent]);

    const tabsValue = [
        {
            id: 'account',
            name: 'Account',
            content: <AccTable />,
        },
        {
            id: 'dsItem',
            name: 'DSItem',
            content: <DSItemTable />,
        }
    ];

    return (
        <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
            <Header category='Page' title='DS Transaction' />
            <EuiTabbedContent
                tabs={tabsValue}
                initialSelectedTab={tabsValue[1]}
                autoFocus="selected"
                onTabClick={(tab) => {
                    settabCurrent(tab);
                }}
            />
        </div >
    )
}

export default Transaction2