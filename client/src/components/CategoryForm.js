import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import CategoryBreadcrumbs from './CategoryBreadcrumbs';
import { BreadCrumb } from 'primereact/breadcrumb';

const CategoryForm = ({ category, onSubmit, onHide, parentCategory, currentPath}) => {
    const [name, setName] = useState(category && category.name ? category.name : '');

    useEffect(() => {
        if (category && category.name) {
            setName(category.name);
        } else {
            setName(''); // Reset to empty string instead of null
        }
    }, [category]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass parentCategoryId when submitting the form
        onSubmit({ ...category, name, parentCategory: parentCategory });
    };

    console.log("currentPath: ", currentPath);

    const breadcrumbs = currentPath.map((cat, index) => ({
        label: cat.name,
        // No command function, making it non-interactive
    }));

    return (
        <form className="p-fluid" onSubmit={handleSubmit}>
            <div className=''>
                <h4 className="mb-3">Category Location:</h4> 
                <BreadCrumb model={breadcrumbs} />
            </div>
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
