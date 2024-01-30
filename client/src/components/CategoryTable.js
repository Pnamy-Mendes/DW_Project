import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import axios from 'axios';

import './css/CategoryTable.css';

import CategoryBreadcrumbs from './CategoryBreadcrumbs';



const CategoryTable = ({categories, subCategories, isManagingSubcategories, setCategories, fetchCategories, fetchSubCategories, onEditCategory, 
    onDeleteCategory, deleteSelectedCategory, hideCategoryDialog, onSelectionChangeCategory, 
    selectionCategory, currentPath, setCurrentPath, setParentCategory, setIsManagingSubcategories}) => {
 
    /* const [subCategories, setSubCategories] = useState([]);
    const [isManagingSubcategories, setIsManagingSubcategories] = useState(false);  */
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null); 
    

    const onNavigate = (index) => {
        if (index === null) {
            // Home icon clicked
            console.log("Home icon clicked");
            fetchRootCategories();
            setCurrentPath([]);
            setIsManagingSubcategories(false);
        } else {
            // Breadcrumb item clicked
            console.log("Breadcrumb item clicked, index: ", index);
            const category = currentPath[index - 1]; // Adjust for the shifted index
            if (category) {
                fetchSubCategories(category._id);
                setCurrentPath(currentPath.slice(0, index));
                setIsManagingSubcategories(true);
            } else {
                console.error("Invalid category index: ", index);
            }
        }
    };
    

    const onManageSubcategories = (category) => {
        fetchSubCategories(category._id);
        setCurrentPath([...currentPath, { name: category.name, _id: category._id }]);
        setParentCategory(category._id);
    };


    const fetchRootCategories = () => {
        axios.get(`http://localhost:3001/api/categories`)
            .then(response => {
                setCategories(response.data); // Assuming this sets the top-level categories
                setIsManagingSubcategories(false);
                setCurrentPath([]); // Reset the breadcrumb path
            })
            .catch(error => {
                console.error('Failed to fetch root categories:', error);
            });
    };
    
    
    
    
    const backToCategories = () => {
        setIsManagingSubcategories(false);
        fetchCategories();
    };

    const actionBodyTemplate = (rowData) => (
        <React.Fragment>
            <Button icon="pi pi-pencil" className="mr-2" onClick={() => onEditCategory(rowData)} />
            <Button label="Manage SubCategories" className="p-button-success mr-2 custom-manage-button" onClick={() => onManageSubcategories(rowData)} />
            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => onDeleteCategory(rowData)} />
        </React.Fragment>
    );

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            {/* {!isManagingSubcategories ? <h4 className="m-0">Manage Categories</h4> : <Button label="Back to Categories" icon="pi pi-arrow-left" onClick={backToCategories} />}
             
             <CategoryBreadcrumbs currentCategory={currentCategory} onCategorySelected={onBreadcrumbCategorySelected} />*/}
            <h4 className="m-0">Manage Categories</h4>
            <CategoryBreadcrumbs currentPath={currentPath} onNavigate={onNavigate} setCategories={setCategories}/>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    // Add other necessary components and functionalities

    return (
        <div>
            <Toast ref={toast} />
            <DataTable
                value={isManagingSubcategories ? subCategories : categories}
                selection={selectionCategory}
                onSelectionChange={onSelectionChangeCategory}
                globalFilter={globalFilter}
                header={header}
                responsiveLayout="scroll" 
                dataKey="_id" 
            >

                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                <Column field="name" header="Name" sortable />
                <Column body={actionBodyTemplate} />
            </DataTable>
        </div>
    );
}; 

export default CategoryTable;