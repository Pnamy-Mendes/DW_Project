import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import UserTypeTable from './UserTypeTable';
import UserTypeForm from './UserTypeForm'; // You need to create this component
import ConfigContext from './../contexts/ConfigContext';

const UserTypeManagement = () => {
    const [userTypes, setUserTypes] = useState([]);
    const [selectedUserTypes, setSelectedUserTypes] = useState([]);
    const [userTypeDialog, setUserTypeDialog] = useState(false);
    const [editingUserType, setEditingUserType] = useState({});
    const [deleteUserTypeDialog, setDeleteUserTypeDialog] = useState(false);
    const toast = useRef(null);
    const { getApiUrl } = useContext(ConfigContext); 
    const [allPermissions, setAllPermissions] = useState([]);
    const apiUrl = getApiUrl();

    useEffect(() => {
        fetchPermissions();
        fetchUserTypes();
    }, []);


    const fetchUserTypes = async () => {
        try {
            const response = await axios.get(`${apiUrl}:3001/api/typeUser`);
            setUserTypes(response.data);
        } catch (error) {
            console.error('Error fetching user types:', error);
        }
    };

    const fetchPermissions = async () => {
        try {
            const response = await axios.get(`${apiUrl}:3001/api/permissions`);
            setAllPermissions(response.data);
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };

    const openNew = () => {
        setEditingUserType({ name: '', permissions: [] });
        setUserTypeDialog(true);
    };

    const hideDialog = () => {
        setUserTypeDialog(false);
    };

    const onSaveUserType = async (userTypeData) => {
        // Define the correct URL and method for saving the UserType
        const method = userTypeData._id ? 'put' : 'post';
        const url = userTypeData._id
            ? `${apiUrl}:3001/api/typeUser/${userTypeData._id}`
            : `${apiUrl}:3001/api/typeUser`;
    
        // Convert permissions back to the full objects expected by the backend
        const userTypeWithFullPermissions = {
            ...userTypeData,
            permissions: userTypeData.permissions.map(id =>
                allPermissions.find(perm => perm._id === id)
            ),
        };
    
        try {
            await axios[method](url, userTypeWithFullPermissions);
            fetchUserTypes();
            setUserTypeDialog(false);
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'User Type saved successfully.',
                life: 3000,
            });
        } catch (error) {
            console.error('Error saving user type:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save user type.',
                life: 3000,
            });
        }
    };

    const editUserType = (userType) => {
        setEditingUserType({ ...userType });
        setUserTypeDialog(true);
    };

    const confirmDeleteUserType = (userType) => {
        setSelectedUserTypes([userType]);
        setDeleteUserTypeDialog(true);
    };

    const deleteUserType = async () => {
        await Promise.all(selectedUserTypes.map(userType => axios.delete(`${apiUrl}:3001/api/typeUser/${userType._id}`)));
        setDeleteUserTypeDialog(false);
        fetchUserTypes();
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'User Type deleted successfully.', life: 3000 });
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={deleteUserType} disabled={!selectedUserTypes.length} />
            </React.Fragment>
        );
    };

    return (
        <div>
            <Toast ref={toast} />
            <Toolbar className="mb-4" left={leftToolbarTemplate} />
            <UserTypeTable 
                userTypes={userTypes} 
                onEdit={editUserType} 
                onDelete={confirmDeleteUserType} 
                selectedUserTypes={selectedUserTypes} 
                onSelectionChange={setSelectedUserTypes}
            />
            <Dialog visible={userTypeDialog} style={{ width: '450px' }} header="User Type Details" modal onHide={hideDialog}>
                <UserTypeForm 
                    userType={editingUserType} 
                    onSave={onSaveUserType} 
                    onCancel={hideDialog} 
                    allPermissions={allPermissions} 
                />
            </Dialog>
            <Dialog 
                visible={deleteUserTypeDialog} 
                style={{ width: '450px' }} 
                header="Confirm" 
                modal 
                onHide={() => setDeleteUserTypeDialog(false)}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {selectedUserTypes && <span>Are you sure you want to delete the selected user type(s)?</span>}
                </div>
            </Dialog>
        </div>
    );
}

export default UserTypeManagement;