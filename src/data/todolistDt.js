import axios from 'axios';
import { ModalTodolist } from '../pages';
import { format } from 'date-fns'

const customerGridImage = (props) => (
    <div>
        <div>
            <ModalTodolist props={props} />
        </div>
    </div>

);

export const todolistsGrid = [
    {
        headerText: 'Action',
        width: '150',
        template: customerGridImage,
        textAlign: 'Center'
    },
    {
        field: 'id',
        visible: false
    },
    {
        field: 'name',
        headerText: 'Name',
        width: '120',
        textAlign: 'Center'
    },
    {
        field: 'description',
        headerText: 'Description',
        width: '120',
        textAlign: 'Center'
    },
    {
        field: 'updateDate',
        headerText: 'Date',
        width: '120',
        textAlign: 'Center'
    },
    {
        field: 'category',
        headerText: 'Category',
        width: '120',
        textAlign: 'Center'
    }
];

export const todolistsDoneGrid = [
    {
        field: 'id',
        visible: false
    },
    {
        field: 'todolistName',
        headerText: 'Name',
        width: '120',
        textAlign: 'Center'
    },
    {
        field: 'todolistDescription',
        headerText: 'Description',
        width: '120',
        textAlign: 'Center'
    },
    {
        field: 'todolistCategory',
        headerText: 'Category',
        width: '120',
        textAlign: 'Center'
    },
    {
        field: 'updateDate',
        headerText: 'UpdateDate',
        width: '120',
        textAlign: 'Center'
    },
    {
        field: 'remark',
        headerText: 'Remark',
        width: '120',
        textAlign: 'Center'
    }
];