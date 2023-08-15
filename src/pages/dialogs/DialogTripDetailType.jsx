import React, { useEffect, useState } from 'react';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';

const DialogTripDetailType = ({ props }) => {
    const [name, setname] = useState(props.name);

    const handleName = (e) => {
        setname(e.target.value);
    }

    let tripDetailTypeName;

    useEffect(() => {
        tripDetailTypeName.focusIn();
    }, []);

    return (
        <div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                <TextBoxComponent
                    id='name'
                    ref={x => tripDetailTypeName = x}
                    placeholder="Name"
                    floatLabelType="Auto"
                    onChange={handleName}
                    value={name}
                />
            </div>
        </div>
    )
}

export default DialogTripDetailType