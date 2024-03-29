export const dsAccGrid = [
    {
        field: 'id',
        visible: false
    },
    {
        field: 'name',
        headerText: 'Name',
        width: '50',
        textAlign: 'Center'
    },
    {
        field: 'balance',
        headerText: 'Balance',
        width: '30',
        format: 'C2',
        textAlign: 'Right'
    },
    {
        field: 'createdDateTime',
        headerText: 'Date',
        width: '50',
        format: { type: 'date', format: 'dd/MM/yyyy' },
        textAlign: 'Center',
    },
    {
        field: 'isActive',
        headerText: 'IsActive',
        width: '50',
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
        textAlign: 'Center',
        filter: { type: 'CheckBox' }
    },
    {
        field: 'subName',
        headerText: 'SubName',
        width: '120',
        textAlign: 'Center',
        filter: { type: 'CheckBox' }
    },
    {
        field: 'dsItemID',
        headerText: 'Category',
        width: '120',
        textAlign: 'Center',
        visible: false
    }
];

export const dsTransGrid = [
    {
        field: 'id',
        visible: false
    },
    {
        field: 'createdDateTime',
        headerText: 'Date',
        width: '100',
        format: { type: 'date', format: 'MM/yyyy' },
        enableGroupByFormat: true,
        textAlign: 'Center',
        allowFiltering: false
    },
    {
        field: 'createdDateTimeDay',
        headerText: 'Date',
        width: '120',
        format: { type: 'date', format: 'dd/MM/yyyy' },
        enableGroupByFormat: true,
        textAlign: 'Center',
        allowFiltering: false
    },
    {
        field: 'dsItemName',
        headerText: 'Name',
        width: '250',
        textAlign: 'Center',
        filter: { type: 'CheckBox' }
    },
    {
        field: 'description',
        headerText: 'Description',
        width: '120',
        textAlign: 'Center'
    },
    {
        field: 'dsTypeID',
        visible: false
    },
    {
        field: 'amount',
        headerText: 'Amount ',
        width: '120',
        format: 'C2',
        textAlign: 'Right'
    },
    {
        field: 'balance',
        headerText: 'Balance',
        width: '120',
        format: 'C2',
        textAlign: 'Right'
    },
    {
        field: 'dsAccountID',
        visible: false
    },
    {
        field: 'dsTypeName',
        headerText: 'Type',
        width: '100',
        textAlign: 'Center',
        filter: { type: 'CheckBox' }
    },
    {
        field: 'dsAccountName',
        headerText: 'Account',
        width: '150',
        textAlign: 'Center',
        filter: { type: 'CheckBox' }
    }
];