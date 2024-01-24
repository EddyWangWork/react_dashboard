import React, { useEffect } from 'react';
import { ABar, ADonut, ALine, ALine2 } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

const Ecommerce2 = () => {
    const { getdstransactions } = useStateContext();

    useEffect(() => {
        getdstransactions();
    }, []);

    return (
        <div class="grid grid-cols-2 gap-5 py-5">
            <div class="pl-1 pr-1 col-span-2"><ALine2 /></div>
            <div class="pl-1 pr-1 col-span-2"><ABar /></div>
            <div class="pl-1 pr-1 col-span-2"><ADonut /></div>
            <div class="pl-1 pr-1 col-span-2"><ALine /></div>
        </div>
    )
}

export default Ecommerce2