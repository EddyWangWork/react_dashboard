import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Search, Toolbar, Inject, Edit } from '@syncfusion/ej2-react-grids';
import { format, parseISO } from 'date-fns'
import axios from 'axios';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { dsAccGrid, todolistsDoneGrid } from '../data/dtTransaction';
import { DSItems, DSItemsTreeview, DSTransaction } from '../pages'
import { Header } from '../components';

import { useStateContext } from '../contexts/ContextProvider';

const Transaction = () => {

    const { handleClearToken, isLogin, token, handleLogin } = useStateContext();
    const navigate = useNavigate();

    const [bankAccData, setBankAccData] = useState(null);

    const getdsaccounts = () => {
        axios
            .get(`http://localhost:5000/api/dsaccounts/getdsaccounts`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                var activeAcc = response.data.filter(x => x.isActive == true)
                setBankAccData(activeAcc)
            })
            .catch((err) => {
                console.log(err);
                console.log(err.response.status);
                if (err.response.status == 401) {
                    handleClearToken();
                    navigate('/login', { replace: true });
                }
            });
    }

    const gridCreated = () => {
        console.log('gridCreated');
        if (!bankAccData) {
            getdsaccounts();
        }
    }

    const toolbarOptions = ['Add', 'Edit', 'Delete'];
    // const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog', template: dialogTemplate }
    const pageSettings = { pageCount: 5 };

    let headerText = [{ text: "DS Account" }, { text: "DS Item" }, { text: "DS Item TV" }, { text: "Transaction" }];
    const content0 = () => {
        return <div>
            <GridComponent
                dataSource={bankAccData}
                toolbar={toolbarOptions}
                allowPaging={true}
                // editSettings={editSettings}
                pageSettings={pageSettings}
                // actionBegin={actionBegin}
                // actionComplete={actionComplete}
                created={gridCreated}
            >
                <ColumnsDirective>
                    {dsAccGrid.map((item, index) => (
                        <ColumnDirective editType='dropdownedit' key={index} {...item} />
                    ))}
                </ColumnsDirective>
                <Inject services={[Page, Search, Toolbar, Edit]} />
            </GridComponent>
        </div>;
    }
    const tabDSItem = () => {
        return <div>
            <DSItems>
            </DSItems>
        </div>;
    }
    const tabDSItemTV = () => {
        return <div>
            <DSItemsTreeview>
            </DSItemsTreeview>
        </div>;
    }
    const tabDSTrans = () => {
        return <div>
            <DSTransaction>
            </DSTransaction>
        </div>;
    }

    return (
        <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
            <Header category='Page' title='Todolists' />
            <TabComponent heightAdjustMode='Auto'>
                <TabItemsDirective>
                    <TabItemDirective header={headerText[0]} content={content0} />
                    <TabItemDirective header={headerText[1]} content={tabDSItem} />
                    <TabItemDirective header={headerText[2]} content={tabDSItemTV} />
                    <TabItemDirective header={headerText[3]} content={tabDSTrans} />
                </TabItemsDirective>
            </TabComponent>
        </div >
    )
}

export default Transaction