import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button'; 

const CategoryForm = ({ category, onSubmit, onHide }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (category) {
            setName(category.name);
        }
    }, [category]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...category, name });
    };

    return (
        <form className="p-fluid" onSubmit={handleSubmit}>
            <div className="field">
                <label htmlFor="name">Category Name</label>
                <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus style={{marginTop: "10px"}}/>
            </div>
            <div className="flex justify-content-end mt-3">
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onHide} />
                <Button label="Save" icon="pi pi-check" className="p-button-text" type="submit" />
            </div>
        </form>
    );
};

export default CategoryForm;
