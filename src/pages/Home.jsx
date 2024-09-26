import {
    EuiBadge,
    EuiBasicTable,
    EuiCard,
    EuiDatePicker,
    EuiFieldNumber,
    EuiIcon,
    EuiPanel,
    EuiProgress,
    EuiStat,
    EuiTextColor,
    EuiButtonEmpty,
    EuiCollapsibleNavGroup,
    EuiFormRow
} from '@elastic/eui';
import axios from 'axios';
import moment from 'moment';
import { React, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components';

const Home = () => {

    const [startDate, setStartDate] = useState(moment());



    useEffect(() => {
    }, []);

    return (
        <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
            <Header category='Dashboard' title='Home' />

            <EuiPanel>
                <EuiDatePicker inline selected={startDate} onChange={() => { }} />
            </EuiPanel>
        </div>
    )
}

export default Home