import React, { useEffect } from 'react';
import { ABar, ADonut, ALine, ALine2 } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

const Ecommerce2 = () => {
    const { getdstransactions } = useStateContext();

    useEffect(() => {
        getdstransactions();
    }, []);

    return (
        <div class="flex flex-wrap justify-center gap-5">
            <div className='pt-14'><ALine2 /></div>
            <div><ABar /></div>
            <div><ADonut /></div>
            <div><ALine /></div>
        </div>
    )
}

export default Ecommerce2