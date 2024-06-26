import {
    EuiTabbedContent
} from '@elastic/eui';
import React, { useEffect, useState } from 'react';
import { Header } from '../components';
import { ShopDiaryTable, ShopTable, ShopTypeTable } from '../pages';

const Shop = () => {
    const [tabCurrent, settabCurrent] = useState([]);

    useEffect(() => {

    }, [tabCurrent]);

    const tabsValue = [
        {
            id: 'shop',
            name: 'Shop',
            content: <ShopTable />,
        },
        {
            id: 'shopDiary',
            name: 'Shop Diary',
            content: <ShopDiaryTable />,
        },
        {
            id: 'shopType',
            name: 'Shop Type',
            content: <ShopTypeTable />,
        },
    ];

    return (
        <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
            <Header category='Page' title='Shop' />
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

export default Shop