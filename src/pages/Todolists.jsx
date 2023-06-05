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

    const { handleClearToken, isLogin, token, handleLogin } = useStateContext();

    const [tdlData, setTdlData] = useState([]);
    const [tdlDoneData, setTdlDoneData] = useState([]);
    const [trigger, setTrigger] = useState(0);

    const navigate = useNavigate();

    const getTodolistsCategory = () => {
        axios
            .get(`http://localhost:5000/api/todolists/getTodolistsCategory`, {
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
            .get(`http://localhost:5000/api/todolists/getTodolistsAll`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                // setPosts(response.data);
                console.log(response.data)
                response.data.map((data, index) => {
                    var date = new Date(data.updateDate);
                    data.updateDate = format(date, 'dd/MM/yyyy');
                    data.category = category.find(x => x.id == data.categoryId).name;
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
            .get(`http://localhost:5000/api/todolistsDone/getTodolistsDoneAll`, {
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
                console.log(err.response.status);
                if (err.response.status == 401) {
                    handleClearToken();
                    navigate('/login', { replace: true });
                }
            });
    }

    const addTrigger = (thistrigger) => {
        thistrigger++;
        setTrigger(thistrigger);
    }

    const addTodolist = (req) => {
        axios.post('http://localhost:5000/api/todolists', req, {
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

    const addTodolistDone = (req) => {
        axios.post('http://localhost:5000/api/todolistsdone', req, {
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
        axios.put(`http://localhost:5000/api/todolists/${id}`, req, {
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
        axios.put(`http://localhost:5000/api/todolistsdone/${id}`, req, {
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
        axios.delete(`http://localhost:5000/api/todolists/${id}`, {
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
        axios.delete(`http://localhost:5000/api/todolistsdone/${id}`, {
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

    const refreshData = () => {
        getTodolistsCategory();
        getTodolistsDone();
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

    const customFn = (args) => {
        console.log(args.value);
        var ff = args.value.split('/');
        var myDate2 = Date.parse(`${ff[2]}-${ff[1]}-${ff[0]}`);
        return myDate2 > 0
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
                    UnixUpdateTime: ddd
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
                    UnixUpdateTime: ddd
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

    useEffect(() => {
        console.log("todolists.jsx: useEffect");
        getTodolistsCategory();
        getTodolistsDone();
    }, [trigger]);

    const dialogTemplate = (props) => {
        let sss = { ...props }
        console.log("dialogTemplate: ", sss);
        return (<DialogTodolists props={sss} />);
    };

    const dialogTdlDoneTemplate = (props) => {
        let sss = { ...props }
        console.log("dialogTdlDoneTemplate: ", sss);
        return (<DialogTodolistsDone props={sss} />);
    };

    let grid;
    let gridtdlDone;
    const toolbarOptions = ['Add', 'Edit', 'Delete'];
    const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog', template: dialogTemplate };
    const editSettingsTdlDone = { allowEditing: true, allowDeleting: true, mode: 'Dialog', template: dialogTdlDoneTemplate };
    const pageSettings = { pageCount: 5 };

    let headerText = [{ text: "Twitter" }, { text: "Facebook" }, { text: "WhatsApp" }];
    const content0 = () => {
        return <div>
            <GridComponent
                ref={g => grid = g}
                dataSource={tdlData}
                toolbar={toolbarOptions}
                allowPaging={true}
                editSettings={editSettings}
                pageSettings={pageSettings}
                actionBegin={actionBegin}
                actionComplete={actionComplete}
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
                ref={g => gridtdlDone = g}
                dataSource={tdlDoneData}
                toolbar={toolbarOptions}
                allowPaging={true}
                editSettings={editSettingsTdlDone}
                pageSettings={pageSettings}
                actionBegin={actionBeginTdlDone}
                actionComplete={actionCompleteTdlDone}
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
    const content2 = () => {
        return <div>
            WhatsApp Messenger is a proprietary cross-platform instant messaging client for smartphones that operates under a subscription business model. It uses the Internet to send text messages, images, video, user location and audio media messages to other users using standard cellular mobile numbers. As of February 2016, WhatsApp had a user base of up to one billion,[10] making it the most globally popular messaging application. WhatsApp Inc., based in Mountain View, California, was acquired by Facebook Inc. on February 19, 2014, for approximately US$19.3 billion.
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
                    <TabItemDirective header={headerText[2]} content={content2} />
                </TabItemsDirective>
            </TabComponent>
        </div >
    )
}

export default Todolists