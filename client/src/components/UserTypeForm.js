// UserTypeForm.js
import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';

import './css/UserTypeForm.css'

const UserTypeForm = ({ userType, onSave, onCancel, allPermissions }) => {
    const [localUserType, setLocalUserType] = useState({ ...userType, permissions: userType.permissions.map(perm => perm._id) });

    useEffect(() => {
        setLocalUserType({ ...userType, permissions: userType.permissions.map(perm => perm._id) });
    }, [userType]);

    const handleNameChange = (e) => {
        setLocalUserType({ ...localUserType, name: e.target.value });
    };

    const handlePermissionsChange = (e) => {
        setLocalUserType({ ...localUserType, permissions: e.value });
    };

    // Function to customize the label displayed in the control
    const selectedItemsLabel = (options) => {
        if (options.value) {
            const allSelected = options.value.length === allPermissions.length;
            return allSelected ? 'All selected' : `${options.value.length} Permission${options.value.length > 1 ? 's' : ''} Selected`;
        }
        return 'Select permissions';
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(localUserType); }}>
            <InputText value={localUserType.name} onChange={handleNameChange} placeholder="User Type Name" />
            <MultiSelect
                value={localUserType.permissions}
                options={allPermissions}
                onChange={handlePermissionsChange}
                optionLabel="description"
                optionValue="_id"
                placeholder="Select Permissions"
                displaySelectedLabel={selectedItemsLabel}
                maxSelectedLabels={1} // This will only show up to 1 selected items before showing a summary
            />
            <Button type="submit" label="Save" />
            <Button label="Cancel" onClick={onCancel} className="p-button-secondary" />
        </form>
    );
};

export default UserTypeForm;
