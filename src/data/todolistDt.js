import { ModalTodolist } from '../pages';

const popupDone = () => {

}

const customerGridImage = (props) => (
    <div>
        <div>
            {/* <button
                type='button'
                // onClick={customFunc}
                // style={{ color }}
                className='relative text-xl rounded-full p-3 hover:bg-light-gray'
            >
                <span
                    // style={{ background: dotColor }}
                    className='absolute inline-flex rounded-full h-2 w-2 right-2 top-2'
                />
                DONE
            </button> */}
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
        hidden: true
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
        field: 'id'
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