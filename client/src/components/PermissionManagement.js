import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import PermissionTable from './PermissionTable';
import PermissionForm from './PermissionForm'; 
import ConfigContext from './../contexts/ConfigContext';

const PermissionManagement = () => {
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [permissionDialog, setPermissionDialog] = useState(false);
    const [editingPermission, setEditingPermission] = useState({});
    const [deletePermissionDialog, setDeletePermissionDialog] = useState(false);
    const toast = useRef(null);
    const { getApiUrl } = useContext(ConfigContext);
    const apiUrl = getApiUrl();

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            const response = await axios.get(`${apiUrl}:3001/api/permissions`);
            setPermissions(response.data);
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };

    const openNew = () => {
        setEditingPermission({ name: '', description: '' });
        setPermissionDialog(true);
    };

    const hideDialog = () => {
        setPermissionDialog(false);
    };

    const onSavePermission = async (permissionData) => {
        const method = permissionData._id ? 'put' : 'post';
        const url = permissionData._id ? `${apiUrl}/api/permissions/${permissionData._id}` : `${apiUrl}/permissions`;

        try {
            await axios[method](url, permissionData);
            fetchPermissions();
            setPermissionDialog(false);
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Permission saved successfully.', life: 3000 });
        } catch (error) {
            console.error('Error saving permission:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save permission.', life: 3000 });
        }
    };

    const editPermission = (permission) => {
        setEditingPermission({ ...permission });
        setPermissionDialog(true);
    };

    const confirmDeletePermission = (permission) => {
        setSelectedPermissions([permission]);
        setDeletePermissionDialog(true);
    };

    const deletePermission = async () => {
        await Promise.all(selectedPermissions.map(permission => 
            axios.delete(`${apiUrl}/permissions/${permission._id}`)));
        setDeletePermissionDialog(false);
        fetchPermissions();
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Permission(s) deleted successfully.', life: 3000 });
    };

    const deleteSelectedPermissions = async () => {
        const deletePromises = selectedPermissions.map(permission => 
            axios.delete(`${apiUrl}/permissions/${permission._id}`));
        try {
            await Promise.all(deletePromises);
            fetchPermissions();
            setSelectedPermissions([]);
        } catch (error) {
            console.error('Error deleting selected permissions:', error);
        }
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={deleteSelectedPermissions} disabled={!selectedPermissions.length} />
            </React.Fragment>
        );
    };

    return (
        <div>
            <Toast ref={toast} />
            <Toolbar className="mb-4" left={leftToolbarTemplate} />
            <PermissionTable 
                permissions={permissions} 
                editPermission={editPermission} 
                deletePermission={confirmDeletePermission}
                selectedPermissions={selectedPermissions} 
                setSelectedPermissions={setSelectedPermissions}
            />
            <Dialog visible={permissionDialog} style={{ width: '450px' }} header="Permission Details" modal onHide={hideDialog}>
                <PermissionForm permission={editingPermission} onSave={onSavePermission} onCancel={hideDialog} />
            </Dialog>
            <Dialog visible={deletePermissionDialog} style={{ width: '450px' }} header="Confirm" modal onHide={() => setDeletePermissionDialog(false)}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {selectedPermissions && <span>Are you sure you want to delete the selected permission(s)?</span>}
                </div>
            </Dialog>
        </div>
    );
};

export default PermissionManagement;
