import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const UserTable = ({ users, editUser, deleteUser, selectedUsers, setSelectedUsers, userTypes }) => {
    const actionBodyTemplate = (rowData) => (
        <React.Fragment>
            <Button icon="pi pi-pencil" className="mr-2" onClick={() => editUser(rowData)} />
            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => deleteUser(rowData)} />
        </React.Fragment>
    );

    const userTypeBodyTemplate = (rowData) => {
        return <span>{rowData.typeUser.name}</span>;
    };

    /* const mapUserTypeToName = (typeId) => {
        const userType = userTypes.find(type => type._id === typeId);
        return userType ? userType.name : '';
    }; */

    return (
        <DataTable
            value={users}
            selection={selectedUsers}
            onSelectionChange={e => setSelectedUsers(e.value)}
            dataKey="_id"
            paginator
            rows={10}
            header="Manage Users"
            responsiveLayout="scroll"
        >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
            <Column field="name" header="Name" sortable />
            <Column field="username" header="Username" sortable />
            <Column field="email" header="Email" sortable />
            <Column header="Role" body={userTypeBodyTemplate} />
            <Column body={actionBodyTemplate} header="Actions" />
        </DataTable>
    );
};

export default UserTable;
