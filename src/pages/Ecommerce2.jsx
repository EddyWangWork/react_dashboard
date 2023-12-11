import {
    EuiCard,
    EuiIcon,
    EuiText
} from '@elastic/eui';
import React, { useState } from 'react';

import { ABar, ADonut, ALine, ALine2 } from '../components';

const Ecommerce2 = () => {

    const ecardLine = () => {
        return (
            <EuiCard
                icon={<EuiIcon size="xxl" type="dashboardApp" />}
                title="Lists"
                betaBadgeProps={{
                    label: 'Beta',
                    tooltipContent:
                        'This module is not GA. Please help us by reporting any bugs.',
                }}
            >
                <EuiText size="s">
                    <div class="flex justify-center ...">
                        <div><ALine /></div>
                    </div>
                </EuiText>
            </EuiCard>
        )
    }

    return (
        <div class="grid grid-cols-2 gap-5 py-5">
            <div class="pl-1 pr-1 col-span-2"> <ALine2 /></div>
            <div class="pl-1 pr-1 col-span-2"> <ABar /></div>
            <div class="pl-1 pr-1 col-span-2"> <ADonut /></div>
            <div class="pl-1 pr-1 col-span-2">{ecardLine()}</div>
        </div>
    )
}

export default Ecommerce2