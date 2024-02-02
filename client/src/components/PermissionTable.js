// PermissionTable.js
import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const PermissionTable = ({ permissions, editPermission, deletePermission, selectedPermissions, setSelectedPermissions }) => {
    const actionBodyTemplate = (rowData) => (
        <React.Fragment>
            <Button icon="pi pi-pencil" className="mr-2" onClick={() => editPermission(rowData)} />
            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => deletePermission(rowData)} />
        </React.Fragment>
    );

    return (
        <DataTable 
            value={permissions} 
            selection={selectedPermissions} 
            onSelectionChange={e => setSelectedPermissions(e.value)} 
            dataKey="_id" 
            paginator 
            rows={10} 
            header="Manage Permissions" 
            responsiveLayout="scroll"
        >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
            <Column field="level" header="Permission Level" sortable /> 
            <Column field="description" header="Description" sortable />
            <Column body={actionBodyTemplate} header="Actions" />
        </DataTable>
    );
};

export default PermissionTable;
