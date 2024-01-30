import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import CategoryBreadcrumbs from './CategoryBreadcrumbs';

const CategoryForm = ({ category, onSubmit, onHide, parentCategory, currentPath }) => {
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
        // If there's no parentCategory (root level), it should be null
        const categoryData = {
            ...category,
            name,
            parentCategory: parentCategory !== undefined ? parentCategory : null
        };
        onSubmit(categoryData);
    };

    // Ensure that the breadcrumbs are displayed as non-clickable
    const breadcrumbs = currentPath.map(cat => ({
        label: cat.name,
        // No command function, making it non-interactive
    }));
    console.log(breadcrumbs);

    // Include the home icon to allow navigation to the root level
    const home = {
        icon: 'pi pi-home',
        command: () => { /* Define what happens when you click the home icon if needed */ }
    };

    

    return (
        <form className="p-fluid" onSubmit={handleSubmit}>
            <div className='' key={JSON.stringify(currentPath)}>
                <h4 className="mb-3">Category Location:</h4> 
                {/* Pass the home prop to include the house icon */}
                <CategoryBreadcrumbs currentPath={breadcrumbs} home={home} />
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
