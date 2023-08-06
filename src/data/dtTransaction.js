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
    }
    // ,
    // {
    //     field: 'description',
    //     visible: false,
    //     headerText: 'Description',
    //     width: '120',
    //     textAlign: 'Center'
    // }
    ,
    {
        field: 'balance',
        headerText: 'Balance',
        width: '50',
        format: 'C2',
        textAlign: 'Right'
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
        width: '100',
        format: { type: 'date', format: 'dd/MM/yyyy' },
        textAlign: 'Center',
        allowFiltering: false
    },
    {
        field: 'dsItemName',
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
        field: 'dsTypeID',
        visible: false
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
        width: '100',
        textAlign: 'Center',
        filter: { type: 'CheckBox' }
    }
];