import React from 'react';
import { DataTable } from 'mantine-datatable';
import './css/ProductList.css'; // Ensure this contains the styles you want

function ProductList({ products, onEdit, onDelete, onSort, sortConfig }) {
    const columns = [
        {
            accessor: 'name',
            title: 'Name',
            render: ({ name }) => name + (sortConfig.field === 'name' ? getSortArrow('name') : ''),
            headerProps: { onClick: () => onSort('name') }
        },
        {
            accessor: 'price',
            title: 'Price',
            render: ({ price }) => `$${price}` + (sortConfig.field === 'price' ? getSortArrow('price') : ''),
            headerProps: { onClick: () => onSort('price') }
        },
        {
            accessor: 'category',
            title: 'Category',
            render: ({ category }) => category + (sortConfig.field === 'category' ? getSortArrow('category') : ''),
            headerProps: { onClick: () => onSort('category') }
        },
        {
            accessor: 'promoDetails',
            title: 'Promo Details',
            render: ({ promoDetails }) => promoDetails + (sortConfig.field === 'promoDetails' ? getSortArrow('promoDetails') : ''),
            headerProps: { onClick: () => onSort('promoDetails') }
        },
        {
            accessor: 'actions',
            title: 'Actions',
            render: (record) => (
                <>
                    <button onClick={() => onEdit(record)}>Edit</button>
                    <button onClick={() => onDelete(record._id)}>Delete</button>
                </>
            )
        }
    ];

    const getSortArrow = (field) => {
        if (sortConfig && sortConfig.field === field) {
            return sortConfig.direction === 'asc' ? '↑' : '↓';
        }
        return '';
    };

    return (
        <DataTable
            withBorder
            borderRadius="sm"
            withColumnBorders
            striped
            highlightOnHover
            records={products}
            columns={columns}
            onRowClick={(record) => alert(`You clicked ${record.name}`)}
        />
    );
}

export default ProductList;
