import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import axios from 'axios'; 

import CategoryForm from './CategoryForm';
import CategoryBreadcrumbs from './CategoryBreadcrumbs';



const CategoryTable = ({categories, setCategories, fetchCategories, config}) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [subCategories, setSubCategories] = useState([]);
    const [isManagingSubcategories, setIsManagingSubcategories] = useState(false);
    const [categoryDialog, setCategoryDialog] = useState(false);
    const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [currentCategory, setCurrentCategory] = useState(null); // State to track the current category
    const [currentPath, setCurrentPath] = useState([]); 
    const toast = useRef(null); 

    const onNavigate = (index) => {
        const newPath = currentPath.slice(0, index + 1);
        setCurrentPath(newPath);

        if (index === 0) {
            setIsManagingSubcategories(false);
            setSubCategories([]);
        } else {
            fetchSubCategories(newPath[index]._id);
        }
    };

    // Method to handle breadcrumb selection
    const onBreadcrumbCategorySelected = (category) => {
        setCurrentCategory(category);
        // Additional logic to fetch subcategories or update table data based on the selected category
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
        axios.get(`${config.apiUrl}:3001/api/categories/${category._id}/subcategories`)
            .then((response) => {
                setSubCategories(response.data);
                // Update breadcrumb path
                setCurrentPath(currentPath => [...currentPath, { name: category.name, _id: category._id }]);
                setIsManagingSubcategories(true);
            })
            .catch((error) => {
                console.error('Failed to fetch subcategories:', error);
            });
    };

    /* const fetchCategories = () => {
        axios.get('${config.apiUrl}:3001/api/categories')
          .then(response => {
            setCategories(response.data);
            // Any additional logic after fetching categories
          })
          .catch(error => {
            console.error('Error fetching categories:', error);
          });
      }; */

    const fetchRootCategories = () => {
        axios.get(`${config.apiUrl}:3001/api/categories`)
            .then(response => {
                setCategories(response.data);
                setIsManagingSubcategories(false);
                setCurrentPath([]);
            })
            .catch(error => {
                console.error('Failed to fetch root categories:', error);
            });
    };
    
    const fetchSubCategories = (categoryId) => {
        axios.get(`${config.apiUrl}:3001/api/categories/${categoryId}/subcategories`)
            .then(response => {
                // Assuming response.data contains subcategories
                setSubCategories(response.data);
                // Update the path to include this category
                const selectedCategory = categories.find(cat => cat._id === categoryId);
                setCurrentPath(currentPath => [...currentPath, selectedCategory]);
                setIsManagingSubcategories(true);
            })
            .catch(error => {
                console.error('Failed to fetch subcategories:', error);
            });
    };

    const handleBreadcrumbNavigate = (index) => {
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
    };

    const backToCategories = () => {
        setIsManagingSubcategories(false);
        fetchCategories();
    };

    const actionBodyTemplate = (rowData) => (
        <React.Fragment>
            <Button icon="pi pi-pencil" className="mr-2" onClick={() => onEditCategories(rowData)} />
            {/* {!rowData.parentCategory ? */} 
                <Button label="Manage SubCategories" className="p-button-success mr-2" onClick={() => onManageSubcategories(rowData)} />
            {/* : null} */}
            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => onDeleteCategories(rowData)} />
        </React.Fragment>
    );

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            {/* {!isManagingSubcategories ? <h4 className="m-0">Manage Categories</h4> : <Button label="Back to Categories" icon="pi pi-arrow-left" onClick={backToCategories} />}
             
             <CategoryBreadcrumbs currentCategory={currentCategory} onCategorySelected={onBreadcrumbCategorySelected} />*/}
            <h4 className="m-0">Manage Categories</h4>
            <CategoryBreadcrumbs currentPath={currentPath} onNavigate={handleBreadcrumbNavigate} setCategories={setCategories}/>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );


    const hideDialog = () => {
        setCategoryDialog(false);
        setDeleteCategoryDialog(false);
    };

    const saveCategory = (categoryData) => {
        // Implement the save functionality (either create a new category or update an existing one)
        if (selectedCategory && selectedCategory._id) {
            // Update category
            axios.put(`${config.apiUrl}:3001/api/categories/${selectedCategory._id}`, categoryData)
                .then(() => {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Category updated', life: 3000 });
                    fetchCategories();
                })
                .catch((error) => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update category', life: 3000 });
                });
        } else {
            // Create new category
            axios.post('${config.apiUrl}:3001/api/categories', categoryData)
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
        axios.delete(`${config.apiUrl}:3001/api/categories/${selectedCategory._id}`)
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

    // Add other necessary components and functionalities

    return (
        <div>
            <Toast ref={toast} />
            {!isManagingSubcategories ? (
                <DataTable value={categories} globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                    <Column field="name" header="Name" sortable />
                    <Column body={actionBodyTemplate} />
                </DataTable>
            ) : (
                <DataTable value={subCategories} globalFilter={globalFilter} header={header}>
                    <Column field="name" header="Name" sortable />
                    <Column body={actionBodyTemplate} />

                </DataTable>
            )}
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
