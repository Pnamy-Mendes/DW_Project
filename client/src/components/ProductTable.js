import React, {useState, useContext} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { TabView, TabPanel } from 'primereact/tabview';

import CategoryTable from './CategoryTable'; 
import ConfigContext from './../contexts/ConfigContext';

const ProductTable = ({ products, categories, subCategories, onEdit, onDelete, globalFilter, 
    setGlobalFilter, selection, onSelectionChange, categoriesMapping, fetchCategories, fetchSubCategories,
    setCategories, handleonTabChange, activeIndex, onEditCategory, onDeleteCategory, 
    onDeleteSelectedCategories, hideCategoryDialog, onSelectionChangeCategory, 
    selectionCategory, currentPath, setCurrentPath, setParentCategory, isManagingSubcategories, setIsManagingSubcategories}) => {
 
    const { getApiUrl } = useContext(ConfigContext);
    const apiUrl = getApiUrl(); // Use this apiUrl for your API calls

    const formatCurrency = (value) => {
        return value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
    };

    const imageBodyTemplate = (rowData) => {
        const imageUrl = `${apiUrl}:3001${rowData.imageName}`;
        return <img src={imageUrl} alt={rowData.name} className="product-image" style={{ maxWidth: '75px', maxHeight: '75px', objectFit: 'cover' }} />;
    };

    const priceBodyTemplate = (rowData) => formatCurrency(rowData.price);

    const ratingBodyTemplate = (rowData) => <Rating value={rowData.rating} readOnly cancel={false} />;

    const statusBodyTemplate = (rowData) => <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)} />;

    // Function to switch between product and category management
    const handleManagementChange = (index) => {
        // Implementation based on the selected tab index
    };

    const actionBodyTemplate = (rowData) => (
        <React.Fragment>
            <Button icon="pi pi-pencil" className="mr-2" onClick={() => onEdit(rowData)} />
            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => onDelete(rowData)} />
        </React.Fragment>
    );

    const getSeverity = (rowData) => {
        switch (rowData.inventoryStatus) {
            case 'INSTOCK': return 'success';
            case 'LOWSTOCK': return 'warning';
            case 'OUTOFSTOCK': return 'danger';
            default: return 'info';
        }
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Products</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" id="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const categoryNameBodyTemplate = (rowData) => {
        const getCategoryHierarchy = (_id) => {
            const category = categoriesMapping[_id];
            if (!category) return '';
            const categoryName = category.name;
            const parentCategoryName = category.parentCategory ? getCategoryHierarchy(category.parentCategory) : '';
            return parentCategoryName ? `${parentCategoryName} -> ${categoryName}` : categoryName;
        };

        // Check if rowData.subSubCategories exists and is an array before sorting
        const sortedSubSubCategories = rowData.subSubCategories && Array.isArray(rowData.subSubCategories) ? rowData.subSubCategories.sort((a, b) => (a.name && b.name) ? a.name.localeCompare(b.name) : 0) : [];

        const categoryNames = sortedSubSubCategories.map(e => getCategoryHierarchy(e.parentCategory));
        const categoryNamesChilds = sortedSubSubCategories.map(e => e.name).join(", ");

        return <span>{categoryNames && categoryNames[0] ? 
                `${categoryNames[0]} -> ${categoryNamesChilds}` 
            : 
                categoryNamesChilds[0] ? 
                    categoryNamesChilds 
                : 
                    "No category"}</span>;
    };
    
       

    return (
        
        <TabView activeIndex={activeIndex} onTabChange={(e) => (handleonTabChange(e.index))}>
            <TabPanel header="Product Details " leftIcon="pi pi-box" style={{ marginRight: '50px' }}>
                <DataTable 
                    value={products} 
                    globalFilter={globalFilter} 
                    responsiveLayout="scroll" 
                    selection={selection} 
                    onSelectionChange={onSelectionChange} 
                    dataKey="_id" 
                    paginator rows={5} rowsPerPageOptions={[5, 10, 25]} 
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" 
                    header={header}
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                    {/* <Column field="code" header="Code" sortable /> */}
                    <Column field="name" header="Name" sortable />
                    <Column header="Image" body={imageBodyTemplate} />
                    <Column field="price" header="Price" body={priceBodyTemplate} sortable />
                    <Column field="subSubCategories" header="Categories" body={categoryNameBodyTemplate}/> 
                    <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable />
                    <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable />
                    <Column body={actionBodyTemplate} />
                </DataTable>
            </TabPanel>
            <TabPanel header=" Categories " leftIcon="pi pi-tags">
                <CategoryTable 
                    categories={categories} 
                    setCategories={setCategories}
                    fetchCategories={fetchCategories}  
                    onDeleteCategory={onDeleteCategory}
                    onEditCategory={onEditCategory}
                    deleteSelectedCategory={onDeleteSelectedCategories}
                    hideCategoryDialog={hideCategoryDialog}
                    onSelectionChangeCategory={onSelectionChangeCategory}
                    selectionCategory={selectionCategory}
                    currentPath={currentPath}
                    setCurrentPath={setCurrentPath}
                    setParentCategory={setParentCategory}
                    fetchSubCategories={fetchSubCategories}
                    subCategories={subCategories}
                    isManagingSubcategories={isManagingSubcategories}
                    setIsManagingSubcategories={setIsManagingSubcategories} 
                />
            </TabPanel>
        </TabView>
    );
};

export default ProductTable;