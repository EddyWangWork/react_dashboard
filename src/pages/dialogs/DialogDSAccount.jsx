import React, { useEffect, useState } from 'react';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';

const DialogDSAccount = ({ props }) => {
    const [dsaccount, setdsaccount] = useState(props.name);
    const [dsisactive, setdsisactive] = useState(props.isActive ?? true);

    const handleDSaccount = (e) => {
        setdsaccount(e.target.value);
    }

    const handleIsactive = (e) => {
        console.log(e);
        console.log(e.checked);
        setdsisactive(e.checked);
    }

    let refdsaccount;

    useEffect(() => {
        refdsaccount.focusIn();
    }, []);

    return (
        <div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                <TextBoxComponent
                    id='dsaccount'
                    ref={x => refdsaccount = x}
                    placeholder="Name"
                    floatLabelType="Auto"
                    onChange={handleDSaccount}
                    value={dsaccount}
                />
            </div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                <CheckBoxComponent
                    label="Active"
                    change={handleIsactive}
                    checked={dsisactive}
                />
            </div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                <TextBoxComponent
                    id='dsisactive'
                    enabled={false}
                    value={dsisactive}
                />
            </div>
        </div>
    )
}

export default DialogDSAccount