import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Search, Toolbar, Inject, Edit } from '@syncfusion/ej2-react-grids';
import { format, parseISO } from 'date-fns'
import axios from 'axios';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { todolistsGrid, todolistsDoneGrid } from '../data/todolistDt';
import { DialogTodolists, DialogTodolistsDone } from '../pages'
import { Header } from '../components';

import { useStateContext } from '../contexts/ContextProvider';

const Todolists = () => {

    const {
        handleClearToken, isLogin, token, handleLogin, localhostUrl,
        urlgetTodolistTypes
    } = useStateContext();

    const [tdlData, setTdlData] = useState(null);
    const [tdlDoneData, setTdlDoneData] = useState(null);
    const [trigger, setTrigger] = useState(0);

    const navigate = useNavigate();

    const getTodolistsCategory = () => {
        axios
            .get(`${urlgetTodolistTypes}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                getTodolistsAll(response.data)
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

    const getTodolistsAll = (category) => {
        axios
            .get(`${localhostUrl}/Todolist`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                console.log(response.data)
                response.data.map((data, index) => {
                    var date = new Date(data.updateDate);
                    data.updateDate = format(date, 'dd/MM/yyyy');
                    data.category = category.find(x => x.id == data.categoryID).name;
                    data.Todolistsss = addTrigger;
                    data.trigger = trigger;
                });
                setTdlData(response.data);
                grid.dataSource = tdlData;
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

    const getTodolistsDone = () => {
        axios
            .get(`${localhostUrl}/TodolistDone`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                response.data.map((data, index) => {
                    var date = new Date(data.updateDate);
                    data.updateDate = format(date, 'dd/MM/yyyy');
                });
                setTdlDoneData(response.data);
                gridtdlDone.dataSource = tdlDoneData;
            })
            .catch((err) => {
                console.log(err);
                console.error(err);
                console.log(err.response.status);
                if (err.response.status == 401) {
                    handleClearToken();
                    navigate('/login', { replace: true });
                }
            });
    }

    const addTodolist = (req) => {
        axios.post(`${localhostUrl}/Todolist`, req, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response);
                refreshData();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const editTodolist = (id, req) => {
        axios.put(`${localhostUrl}/Todolist/${id}`, req, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response);
                refreshData();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const editTodolistDone = (id, req) => {
        axios.put(`${localhostUrl}/TodolistDone/${id}`, req, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response);
                refreshData();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const deleteTodolist = (id) => {
        axios.delete(`${localhostUrl}/Todolist/${id}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response);
                refreshData();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const deleteTodolistDone = (id) => {
        axios.delete(`${localhostUrl}/TodolistDone/${id}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response);
                refreshData();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const addTrigger = (thistrigger) => {
        thistrigger++;
        setTrigger(thistrigger);
    }

    const refreshData = () => {
        console.log("refreshData")
        getTodolistsCategory();
        getTodolistsDone();
    }

    const customFn = (args) => {
        console.log(args.value);
        var ff = args.value.split('/');
        var myDate2 = Date.parse(`${ff[2]}-${ff[1]}-${ff[0]}`);
        return myDate2 > 0
    }

    const actionComplete = (args) => {
        if (args.form) {
            if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
                args.form.ej2_instances[0].addRules('tdlName', { required: [true, '* Please enter your name'] });
                args.form.ej2_instances[0].addRules('tdlUpdateDate', { required: [customFn, '* Please valid Date'] });
            }
        }
    }

    const actionCompleteTdlDone = (args) => {
        if (args.form) {
            if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
                args.form.ej2_instances[0].addRules('tdlRemark', { required: [true, '* Please enter your name'] });
                args.form.ej2_instances[0].addRules('tdlDoneDate', { required: [customFn, '* Please valid Date'] });
            }
        }
    }

    const actionBegin = (args) => {
        if (args.requestType === 'save' && args.form) {
            console.log(args);
            var data = args.data
            console.log(data);
            var exactDate = data.tdlUpdateDate
            var ddd = new Date(exactDate).getTime();
            if (args.action == 'add') {
                console.log('ADD');
                var req = {
                    name: data.tdlName,
                    description: data.tdlDesc,
                    categoryId: Number(data.tdlCategoryId),
                    //UnixUpdateTime: ddd
                }
                console.log(req);
                addTodolist(req);
            }
            else if (args.action == 'edit') {
                console.log('EDIT');
                var req = {
                    name: data.tdlName,
                    description: data.tdlDesc,
                    categoryId: Number(data.tdlCategoryId),
                    //UnixUpdateTime: ddd
                }
                console.log(req);
                editTodolist(data.id, req);
            }
        }
        else if (args.requestType == 'delete') {
            console.log('DELETE');
            console.log(args.data[0].id);
            deleteTodolist(args.data[0].id);
        }
    };

    const actionBeginTdlDone = (args) => {
        if (args.requestType === 'save' && args.form) {
            console.log(args);
            var data = args.data
            console.log(data);
            var exactDate = data.tdlDoneDate
            var ddd = new Date(exactDate).getTime();
            if (args.action == 'edit') {
                console.log('EDIT');
                var req = {
                    remark: data.tdlRemark,
                    UnixUpdateTime: ddd
                }
                console.log(req);
                editTodolistDone(data.id, req);
            }
        }
        else if (args.requestType == 'delete') {
            console.log('DELETE');
            console.log(args.data[0].id);
            deleteTodolistDone(args.data[0].id);
        }
    };

    const dataStateChange = (state) => {
        console.log("dataStateChange: " + state);
    }

    const dataStateChange2 = (state) => {
        console.log("dataStateChange2: " + state);
    }

    useEffect(() => {
        console.log("todolists.jsx: useEffect");

        setTdlData(null);
        setTdlDoneData(null);

        if (trigger > 0) {
            console.log("trigger: " + trigger);
            getTodolistsCategory();
        }

    }, [trigger]);

    const gridCreated = () => {
        console.log("gridCreated: ");
        if (!tdlData) {
            getTodolistsCategory();
        }
    }

    const gridDoneCreated = () => {
        console.log("gridDoneCreated: ");
        if (!tdlDoneData) {
            getTodolistsDone();
        }
    }

    const dialogTemplate = (props) => {
        return (<DialogTodolists props={props} />);
    };

    const dialogTdlDoneTemplate = (props) => {
        return (<DialogTodolistsDone props={props} />);
    };

    let grid;
    let gridtdlDone;
    const toolbarOptions = ['Add', 'Edit', 'Delete'];
    const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog', template: dialogTemplate };
    const editSettingsTdlDone = { allowEditing: true, allowDeleting: true, mode: 'Dialog', template: dialogTdlDoneTemplate };
    const pageSettings = { pageCount: 5 };

    let headerText = [{ text: "Todolist" }, { text: "Todolist-Done" }];
    const content0 = () => {
        return <div>
            <GridComponent
                ref={g => grid = g}
                dataStateChange={dataStateChange}
                dataSource={tdlData}
                toolbar={toolbarOptions}
                allowPaging={true}
                editSettings={editSettings}
                pageSettings={pageSettings}
                actionBegin={actionBegin}
                actionComplete={actionComplete}
                created={gridCreated}
            >
                <ColumnsDirective>
                    {todolistsGrid.map((item, index) => (
                        <ColumnDirective editType='dropdownedit' key={index} {...item} />
                    ))}
                </ColumnsDirective>
                <Inject services={[Page, Search, Toolbar, Edit]} />
            </GridComponent>
        </div>;
    }
    const content1 = () => {
        return <div>
            <GridComponent
                ref={g2 => gridtdlDone = g2}
                dataStateChange={dataStateChange2}
                dataSource={tdlDoneData}
                toolbar={toolbarOptions}
                allowPaging={true}
                editSettings={editSettingsTdlDone}
                pageSettings={pageSettings}
                actionBegin={actionBeginTdlDone}
                actionComplete={actionCompleteTdlDone}
                created={gridDoneCreated}
            >
                <ColumnsDirective>
                    {todolistsDoneGrid.map((item, index) => (
                        <ColumnDirective editType='dropdownedit' key={index} {...item} />
                    ))}
                </ColumnsDirective>
                <Inject services={[Page, Search, Toolbar, Edit]} />
            </GridComponent>
        </div>;
    }

    return (
        // <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
        <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
            <Header category='Page' title='Todolists' />
            <TabComponent heightAdjustMode='Auto'>
                <TabItemsDirective>
                    <TabItemDirective header={headerText[0]} content={content0} />
                    <TabItemDirective header={headerText[1]} content={content1} />
                </TabItemsDirective>
            </TabComponent>
        </div >
    )
}

export default Todolists