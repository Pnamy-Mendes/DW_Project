import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { TabView, TabPanel } from 'primereact/tabview';
import CategoryTable from './CategoryTable';

const ProductTable = ({ products, categories, onEdit, onDelete, globalFilter, setGlobalFilter, selection, onSelectionChange, categoriesMapping, fetchCategories, setCategories}) => {

    const formatCurrency = (value) => {
        return value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
    };

    const imageBodyTemplate = (rowData) => {
        const imageUrl = `http://localhost:3001${rowData.imageName}`;
        return <img src={imageUrl} alt={rowData.name} className="product-image" style={{ maxWidth: '75px', maxHeight: '75px', objectFit: 'cover' }} />;
    };

    const priceBodyTemplate = (rowData) => formatCurrency(rowData.price);

    const ratingBodyTemplate = (rowData) => <Rating value={rowData.rating} readOnly cancel={false} />;

    const statusBodyTemplate = (rowData) => <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)} />;

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
    
        // Sort the subSubCategories alphabetically by their names
        const sortedSubSubCategories = rowData.subSubCategories.sort((a, b) => a.name.localeCompare(b.name));
    
        const categoryNames = sortedSubSubCategories.map(e => getCategoryHierarchy(e.parentCategory));
        const categoryNamesChilds = sortedSubSubCategories.map(e => e.name).join(", ");
    
        return <span>{categoryNames && categoryNames[0] ? 
                        `${categoryNames[0]} -> ${categoryNamesChilds}`
                    : 
                        categoryNamesChilds[0] ?   
                            categoryNamesChilds:
                            "No category"
                    }</span>;
    };
    
       

    return (
        
        <TabView>
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
                <CategoryTable categories={categories} setCategories={setCategories} fetchCategories={fetchCategories} />
            </TabPanel>
        </TabView>
    );
};

export default ProductTable;
