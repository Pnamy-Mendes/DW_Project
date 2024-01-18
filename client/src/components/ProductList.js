import React, { useState } from "react";

function ProductList({ products, onEdit, onDelete }) {
    
    if (!products || products.length === 0) {
        return <div>No products available in the database.</div>;
    }

    const [sortDirection, setSortDirection] = useState('asc');

    const handleSort = (field) => {
        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(newDirection);
        onSort(field, newDirection);
    };
    
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Promo Details</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map(product => (
                    <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.category}</td>
                        <td>{product.promoDetails}</td>
                        <td>
                            <button onClick={() => onEdit(product)}>Edit</button>
                            <button onClick={() => onDelete(product._id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
  
// In ProductList.js
export default ProductList;