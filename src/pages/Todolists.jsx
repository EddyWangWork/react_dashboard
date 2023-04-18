import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Search, Toolbar, Inject, Edit } from '@syncfusion/ej2-react-grids';
import { format, parseISO } from 'date-fns'
import axios from 'axios';

import { todolistsGrid } from '../data/todolistDt';
import { DialogTodolists } from '../pages'
import { Header } from '../components';

import { useStateContext } from '../contexts/ContextProvider';

const Todolists = () => {

    const { handleClearToken, isLogin, token, handleLogin } = useStateContext();

    const [tdlData, setTdlData] = useState([]);

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
                    data.category = category.find(x => x.id == data.categoryId).name
                });
                setTdlData(response.data);
                // grid.dataSource = tdlData;
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

    const refreshData = () => {
        getTodolistsCategory();
        grid.dataSource = tdlData;
    }

    const actionComplete = (args) => {
        if (args.form) {
            if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
                args.form.ej2_instances[0].addRules('tdlName', { required: [true, '* Please enter your name'] });
                args.form.ej2_instances[0].addRules('tdlUpdateDate', { required: [customFn, '* Please valid Date'] });
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

    useEffect(() => {
        getTodolistsCategory();
    }, []);

    let grid;
    const dialogTemplate = (props) => {
        let sss = { ...props }
        console.log(sss);
        return (<DialogTodolists props={sss} />);
    };

    const customFn = (args) => {
        console.log(args.value);
        var ff = args.value.split('/');
        var myDate2 = Date.parse(`${ff[2]}-${ff[1]}-${ff[0]}`);
        return myDate2 > 0
    }

    const toolbarOptions = ['Add', 'Edit', 'Delete'];
    const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog', template: dialogTemplate };
    const editparams = { params: { popupHeight: '300px' } };
    const validationRules = { required: true };
    const orderidRules = { required: true, number: true };
    const pageSettings = { pageCount: 5 };

    return (
        <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
            <Header category='Page' title='Todolists' />
            <GridComponent
                ref={g => grid = g}
                dataSource={tdlData}
                toolbar={toolbarOptions}
                allowPaging={true}
                editSettings={editSettings}
                pageSettings={pageSettings}
                actionBegin={actionBegin}
                actionComplete={actionComplete}
            // toolbar={['Search']}
            >
                <ColumnsDirective>
                    {todolistsGrid.map((item, index) => (
                        <ColumnDirective editType='dropdownedit' key={index} {...item} />
                    ))}
                </ColumnsDirective>
                <Inject services={[Page, Search, Toolbar, Edit]} />
            </GridComponent>
        </div>
    )
}

export default Todolists