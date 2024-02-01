import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import UserTable from './UserTable';
import UserForm from './UserForm';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userDialog, setUserDialog] = useState(false);
    const [editingUser, setEditingUser] = useState({});
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const openNew = () => {
        setEditingUser({ username: '', email: '', type: '' }); // Provide default values
        setUserDialog(true);
    };

    const hideDialog = () => {
        setUserDialog(false);
    };

    const onSaveUser = async (userData) => {
        const method = userData._id ? 'put' : 'post';
        const url = userData._id ? `http://localhost:3001/api/users/${userData._id}` : 'http://localhost:3001/api/users';

        try {
            await axios[method](url, userData);
            fetchUsers(); // Refresh users list
            setUserDialog(false);
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'User saved successfully.', life: 3000 });
        } catch (error) {
            console.error('Error saving user:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save user.', life: 3000 });
        }
    };

    const editUser = (user) => {
        setEditingUser({ ...user });
        setUserDialog(true);
    };

    const confirmDeleteUser = (user) => {
        setSelectedUsers([user]);
        setDeleteUserDialog(true);
    };

    const deleteUser = async () => {
        await Promise.all(selectedUsers.map(user => axios.delete(`http://localhost:3001/api/users/${user._id}`)));
        setDeleteUserDialog(false);
        fetchUsers(); // Refresh users list
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'User(s) deleted successfully.', life: 3000 });
    };

    const deleteSelectedUsers = async () => {
        const deletePromises = selectedUsers.map(user => axios.delete(`http://localhost:3001/api/users/${user._id}`));
        try {
            await Promise.all(deletePromises);
            fetchUsers(); // Refresh users list
            setSelectedUsers([]); // Clear selection
        } catch (error) {
            console.error('Error deleting selected users:', error);
        }
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={deleteSelectedUsers} disabled={!selectedUsers.length} />
            </React.Fragment>
        );
    };

    return (
        <div>
            <Toast ref={toast} />
            <Toolbar className="mb-4" left={leftToolbarTemplate} />
            <UserTable users={users} editUser={editUser} confirmDeleteUser={confirmDeleteUser} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
            <Dialog visible={userDialog} style={{ width: '450px' }} header="User Details" modal onHide={hideDialog}>
                <UserForm user={editingUser} onSave={onSaveUser} onCancel={hideDialog} />
            </Dialog>
            <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal /* footer={deleteUserDialogFooter} */ onHide={() => setDeleteUserDialog(false)}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {selectedUsers && <span>Are you sure you want to delete the selected user(s)?</span>}
                </div>
            </Dialog>
        </div>
    );
};

export default UserManagement;
