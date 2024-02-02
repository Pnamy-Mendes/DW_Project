import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const UserTypeTable = ({ userTypes, onEdit, onDelete, selectedUserTypes, onSelectionChange }) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [filteredUserTypes, setFilteredUserTypes] = useState(userTypes);

    useEffect(() => {
        const result = userTypes.filter((type) => {
            return (
                type.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
                type.permissions.some((perm) =>
                    perm.description.toLowerCase().includes(globalFilter.toLowerCase())
                )
            );
        });
        setFilteredUserTypes(result);
    }, [globalFilter, userTypes]);

    const permissionTemplate = (rowData) => (
        <div>
            {rowData.permissions.map((perm, index) => (
                <span key={index} className="user-type-permission-badge">
                    {perm.description}<br />
                </span>
            ))}
        </div>
    );

    const actionBodyTemplate = (rowData) => (
        <React.Fragment>
            <Button icon="pi pi-pencil" onClick={() => onEdit(rowData)} />
            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => onDelete(rowData)} />
        </React.Fragment>
    );

    const header = (
        <div className="table-header">
            Manage User Types
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Global Search..." />
            </span>
        </div>
    );

    return (
        <DataTable
            value={filteredUserTypes}
            selection={selectedUserTypes}
            onSelectionChange={onSelectionChange}
            dataKey="_id"
            paginator
            rows={5}
            header={header}
            responsiveLayout="scroll"
        >
            <Column selectionMode="multiple" />
            <Column field="name" header="User Type" sortable />
            <Column header="Permissions" body={permissionTemplate} />
            <Column body={actionBodyTemplate} />
        </DataTable>
    );
};

export default UserTypeTable;
