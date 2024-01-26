import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';

const ProductTable = ({ products, onEdit, onDelete }) => {

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

    return (
        <DataTable value={products} responsiveLayout="scroll"
            dataKey="id"  paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">

            <Column field="code" header="Code" sortable></Column>
            <Column field="name" header="Name" sortable></Column>
            <Column header="Image" body={imageBodyTemplate}></Column>
            <Column field="price" header="Price" body={priceBodyTemplate} sortable></Column>
            <Column field="category" header="Category" sortable></Column>
            <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable></Column>
            <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable></Column>
            <Column body={actionBodyTemplate}></Column>
        </DataTable>
    );
};

export default ProductTable;
