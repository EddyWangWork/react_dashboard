import * as React from 'react';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DateRangePickerComponent, DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

import { useStateContext } from '../contexts/ContextProvider';

function Modal() {

    const { setItemName, setDescription, setTypeId, itemName, description, typeId, handleTextChange } = useStateContext();

    const sportsData = [
        { Id: 'game1', Game: 'Badminton' },
        { Id: 'game2', Game: 'Football' },
        { Id: 'game3', Game: 'Tennis' }
    ];
    const fields = { text: 'Game', value: 'Id' };

    return (
        <div>
            <div className="row custom-margin custom-padding-5">
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                    <TextBoxComponent value={itemName} onChange={handleTextChange} placeholder="First Name" floatLabelType="Auto" />
                    <p>The current value is: {itemName}</p>
                </div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <TextBoxComponent placeholder="Description" floatLabelType="Auto" />
                </div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <DropDownListComponent id="ddlelement" dataSource={sportsData} fields={fields} placeholder="Select a game" />
                </div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 mt-5">
                    <button
                        type='button'
                        className='h-10 w-10 rounded-full cursor-pointer'
                        style={{
                            backgroundColor: 'red'
                        }}
                    >
                        <span onClick={() => console.log('test')}>Test</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Modal