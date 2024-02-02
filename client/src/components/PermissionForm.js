// PermissionForm.js
import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

const PermissionForm = ({ permission, onSave, onCancel }) => {
    const [localPermission, setLocalPermission] = useState(permission);

    useEffect(() => {
        setLocalPermission(permission); // Update local permission when the prop changes
    }, [permission]);

    const handleInputChange = (e, fieldName) => {
        const val = e.target.value;
        setLocalPermission({ ...localPermission, [fieldName]: val });
    };

    const handleSave = (event) => {
        event.preventDefault(); // Prevent form from causing a page refresh
        onSave(localPermission); // Use onSave from props to save the localPermission state
    };

    return (
        <form className="p-fluid" onSubmit={handleSave}>
            <div className="field">
                <label htmlFor="permissionLevel">Permission Level</label>
                <InputText id="permissionLevel" value={localPermission.level || ''} onChange={(e) => handleInputChange(e, 'level')} />
            </div>
            <div className="field">
                <label htmlFor="permissionDescription">Description</label>
                <InputTextarea id="permissionDescription" value={localPermission.description || ''} onChange={(e) => handleInputChange(e, 'description')} rows={3} autoFocus/>
            </div>
            {/* Add other fields as necessary */}
            <div className="flex justify-content-end mt-3">
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onCancel} />
                <Button label="Save" icon="pi pi-check" className="p-button-text" type="submit" />
            </div>
        </form>
    );
};

export default PermissionForm;
