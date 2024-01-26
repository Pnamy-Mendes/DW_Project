import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const ProductTable = ({ products, categories, onEdit, onDelete, globalFilter, setGlobalFilter, selection, onSelectionChange, categoriesMapping }) => {


    const categoryNameBodyTemplate = (rowData) => {
        const categoryNames = rowData.subSubCategories.map(id => getCategoryNameById(id)).join(", ");
        return <span>{categoryNames}</span>;
    };

    const getCategoryNameById = (id) => {
        const category = categories.find(cat => cat._id === id);
        return category ? category.name : 'Unknown Category';
    };

    
    const formatCurrency = (value) => {
        return value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
    };

    const imageBodyTemplate = (rowData) => {
        const imageUrl = `http://localhost:3001${rowData.imageName}`; // Update the path as necessary
        return (
            <img 
                src={imageUrl} 
                alt={rowData.name} 
                className="product-image" 
                style={{
                    maxWidth: '75px', // Set maximum width
                    maxHeight: '75px', // Set maximum height
                    objectFit: 'cover' // This will ensure the image covers the area without distortion
                }}
            />
        );
    };

    const confirmDeleteProduct = (product) => {
        confirmDeleteProduct(product);
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    };

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)}></Tag>;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="mr-2" onClick={() => onEdit(rowData)} />
                <Button icon="pi pi-trash" className="p-button-danger" onClick={() => onDelete(rowData)} />
            </React.Fragment>
        );
    };

    const getSeverity = (rowData) => {
        switch (rowData.inventoryStatus) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Products</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    return (
        <DataTable value={products}  globalFilter={globalFilter} 
            responsiveLayout="scroll" selection={selection} onSelectionChange={onSelectionChange}
            dataKey="_id"  
            paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" header={header}>

            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
            <Column field="code" header="Code" sortable></Column>
            <Column field="name" header="Name" sortable></Column>
            <Column header="Image" body={imageBodyTemplate}></Column>
            <Column field="price" header="Price" body={priceBodyTemplate} sortable></Column>
            <Column field="subSubCategories" header="Categories" body={categoryNameBodyTemplate} />;
            <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable></Column>
            <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable></Column>
            <Column body={actionBodyTemplate}></Column>
        </DataTable>
    );
};

export default ProductTable;
