export const dsAccGrid = [
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
        field: 'balance',
        headerText: 'Balance',
        width: '120',
        textAlign: 'Center'
    },
    {
        field: 'isActive',
        headerText: 'IsActive',
        width: '120',
        textAlign: 'Center'
    }
];

export const dsItemsGrid = [
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
        field: 'subName',
        headerText: 'SubName',
        width: '120',
        textAlign: 'Center'
    },
    {
        field: 'dsItemCategoryId',
        headerText: 'Category',
        width: '120',
        textAlign: 'Center',
        visible: false
    }
];

const FilterType2 = {
    type: 'CheckBox'
};

export const dsTransGrid = [
    {
        field: 'id',
        visible: false
    },
    {
        field: 'name',
        headerText: 'Name',
        width: '250',
        textAlign: 'Center'
    },
    {
        field: 'description',
        headerText: 'Description',
        width: '120',
        textAlign: 'Center'
    },
    {
        field: 'type',
        visible: false
    },
    {
        field: 'updateDate',
        headerText: 'Date',
        width: '100',
        format: { type: 'date', format: 'dd/MM/yyyy' },
        textAlign: 'Center',
        allowFiltering: false
    },
    {
        field: 'amount',
        headerText: 'Amount ',
        width: '150',
        format: 'C2',
        textAlign: 'Right'
    },
    {
        field: 'balance',
        headerText: 'Balance',
        width: '150',
        format: 'C2',
        textAlign: 'Right'
    },
    {
        field: 'dsAccountId',
        visible: false
    },
    {
        field: 'typeName',
        headerText: 'Type',
        width: '100',
        textAlign: 'Center',
        filter: { type: 'CheckBox' }
    },
    {
        field: 'dsAccountName',
        headerText: 'Account',
        width: '100',
        textAlign: 'Center',
        filter: { type: 'CheckBox' }
    }
];