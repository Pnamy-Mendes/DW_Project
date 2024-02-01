import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

const UserForm = ({ user, onSave, onCancel }) => {
    const [localUser, setLocalUser] = useState(user);
    const userTypes = [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' }
        // Add other user types as needed
    ];

    useEffect(() => {
        setLocalUser(user); // Update local user when the prop changes
    }, [user]);

    const handleInputChange = (e, fieldName) => {
        const val = e.target.value;
        setLocalUser({ ...localUser, [fieldName]: val });
    };

    const handleDropdownChange = (e, fieldName) => {
        setLocalUser({ ...localUser, [fieldName]: e.value });
    };

    const handleSave = (event) => {
        event.preventDefault(); // Prevent form from causing a page refresh
        onSave(localUser); // Use onSave from props to save the localUser state
    };

    return (
        <form className="p-fluid" onSubmit={handleSave}>
            <div className="field">
                <label htmlFor="name">Name</label>
                <InputText id="name" value={localUser.name || ''} onChange={(e) => handleInputChange(e, 'name')} autoFocus />
            </div>
            <div className="field">
                <label htmlFor="username">Username</label>
                <InputText id="username" value={localUser.username || ''} onChange={(e) => handleInputChange(e, 'username')} />
            </div>
            <div className="field">
                <label htmlFor="email">Email</label>
                <InputText id="email" value={localUser.email || ''} onChange={(e) => handleInputChange(e, 'email')} />
            </div>
            <div className="field">
                <label htmlFor="type">User Type</label>
                <Dropdown id="type" value={localUser.type} options={userTypes} onChange={(e) => handleDropdownChange(e, 'type')} placeholder="Select a Type" />
            </div>
            <div className="flex justify-content-end mt-3">
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onCancel} />
                <Button label="Save" icon="pi pi-check" className="p-button-text" type="submit" />
            </div>
        </form>
    );
};

export default UserForm;
