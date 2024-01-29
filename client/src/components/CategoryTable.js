import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import axios from 'axios';

import './css/CategoryTable.css';

import CategoryForm from './CategoryForm';
import CategoryBreadcrumbs from './CategoryBreadcrumbs';



const CategoryTable = ({categories, setCategories, fetchCategories}) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [subCategories, setSubCategories] = useState([]);
    const [isManagingSubcategories, setIsManagingSubcategories] = useState(false);
    const [categoryDialog, setCategoryDialog] = useState(false);
    const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [currentPath, setCurrentPath] = useState([]);
    const toast = useRef(null);
    const [selectedCategories, setSelectedCategories] = useState([]);

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
    

    const onEditCategories = (category) => {
        setSelectedCategory(category);
        setCategoryDialog(true);
    };

    const onDeleteCategories = (category) => {
        setSelectedCategory(category);
        setDeleteCategoryDialog(true);
    };

    const onManageSubcategories = (category) => {
        fetchSubCategories(category._id);
        setCurrentPath([...currentPath, { name: category.name, _id: category._id }]);
    };


    /* const fetchCategories = () => {
        axios.get('http://localhost:3001/api/categories')
          .then(response => {
            setCategories(response.data);
            // Any additional logic after fetching categories
          })
          .catch(error => {
            console.error('Error fetching categories:', error);
          });
      }; */

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
    
    const fetchSubCategories = (categoryId) => {
        return new Promise((resolve, reject) => {
            axios.get(`http://localhost:3001/api/categories/${categoryId}/subcategories`)
                .then(response => {
                    setSubCategories(response.data);
                    setIsManagingSubcategories(true);
                    resolve();
                })
                .catch(error => {
                    console.error('Failed to fetch subcategories:', error);
                    reject(error);
                });
        });
    };
    
    

    /* const handleBreadcrumbNavigate = (index) => {
        const category = currentPath[index];
        if (index === 0) {
            // Navigate to the root level
            fetchRootCategories();
            setCurrentPath([]);
        } else {
            // Navigate to a specific subcategory level
            fetchSubCategories(category._id);
            setCurrentPath(currentPath.slice(0, index + 1));
        }
    }; */

    const backToCategories = () => {
        setIsManagingSubcategories(false);
        fetchCategories();
    };


    const hideDialog = () => {
        setCategoryDialog(false);
        setDeleteCategoryDialog(false);
    };

    const saveCategory = (categoryData) => {
        // Implement the save functionality (either create a new category or update an existing one)
        if (selectedCategory && selectedCategory._id) {
            // Update category
            axios.put(`http://localhost:3001/api/categories/${selectedCategory._id}`, categoryData)
                .then(() => {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Category updated', life: 3000 });
                    fetchCategories();
                })
                .catch((error) => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update category', life: 3000 });
                });
        } else {
            // Create new category
            axios.post('http://localhost:3001/api/categories', categoryData)
                .then(() => {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Category created', life: 3000 });
                    fetchCategories();
                })
                .catch((error) => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to create category', life: 3000 });
                });
        }
        hideDialog();
    };

    const deleteSelectedCategory = () => {
        axios.delete(`http://localhost:3001/api/categories/${selectedCategory._id}`)
            .then(() => {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Category deleted', life: 3000 });
                fetchCategories();
            })
            .catch((error) => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete category', life: 3000 });
            });
        setDeleteCategoryDialog(false);
    };

    const deleteCategoryDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedCategory} />
        </React.Fragment>
    );

    const actionBodyTemplate = (rowData) => (
        <React.Fragment>
            <Button icon="pi pi-pencil" className="mr-2" onClick={() => onEditCategories(rowData)} />
            <Button label="Manage SubCategories" className="p-button-success mr-2 custom-manage-button" onClick={() => onManageSubcategories(rowData)} />
            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => onDeleteCategories(rowData)} />
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
                selection={selectedCategories}
                onSelectionChange={e => setSelectedCategories(e.value)}
                globalFilter={globalFilter}
                header={header}
                responsiveLayout="scroll" 
                dataKey="_id" 
            >

                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                <Column field="name" header="Name" sortable />
                <Column body={actionBodyTemplate} />
            </DataTable>
            <Dialog visible={categoryDialog} onHide={() => setCategoryDialog(false)}>
                <CategoryForm category={selectedCategory} onSubmit={saveCategory} />
            </Dialog>
            <Dialog visible={deleteCategoryDialog} onHide={() => setDeleteCategoryDialog(false)} footer={deleteCategoryDialogFooter}
                header={<span>Confirm Delete <i className="pi pi-exclamation-triangle" style={{ color: 'red', fontSize: '1.5rem', padding: '10px' }} /></span>} >
                
                <p>Confirm to delete the category: <b>{selectedCategory?.name}</b></p>
            </Dialog>
        </div>
    );
}; 

export default CategoryTable;
