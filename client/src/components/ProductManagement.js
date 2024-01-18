import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import ProductForm from './ProductForm';

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [filter, setFilter] = useState({ category: '', minPrice: '', maxPrice: '' });
    const [sortConfig, setSortConfig] = useState({ field: null, direction: null });

    useEffect(() => {
        fetchProducts(filter); // Fetch products whenever filter changes
    }, [filter]); // Add filter as a dependency

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const handleSort = (field) => {
        let direction = 'asc';
        if (sortConfig.field === field && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ field, direction });

        // Implement the sorting logic based on field and direction
        // Example sorting logic (adjust as needed):
        const sortedProducts = [...products].sort((a, b) => {
            if (field === 'name') { // Assuming 'name' is a field to sort by
                if (direction === 'asc') return a.name.localeCompare(b.name);
                else return b.name.localeCompare(a.name);
            }
            return 0;
        });
        setProducts(sortedProducts);
    };


    const applyFilter = () => {
        fetchProducts(filter);
    };

    const fetchProducts = async (filterCriteria) => {
        try {
            const queryParams = new URLSearchParams(filterCriteria).toString();
            const response = await axios.get(`http://localhost:3001/api/products?${queryParams}`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product); // Set the currently editing product
    };
    

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`http://localhost:3001/api/products/${productId}`);
            fetchProducts(); // Refresh the product list
        } catch (error) {
            console.error('Error deleting product:', error);
            // Handle deletion errors
        }
    };

    const handleSubmit = async (productData) => {
        try {
            if (editingProduct) {
                // Update existing product
                await axios.put(`http://localhost:3001/api/products/${editingProduct._id}`, productData);
            } else {
                // Add a new product
                await axios.post('http://localhost:3001/api/products', productData);
            }
            setEditingProduct(null); // Reset editing product
            fetchProducts(); // Refresh the product list
        } catch (error) {
            console.error('Error submitting product:', error);
            // Handle submission errors
        }
    };
    

    return (
            <div className="product-management">
             <input
                type="text"
                name="category"
                value={filter.category}
                onChange={handleFilterChange}
                placeholder="Category"
            />
            <input
                type="number"
                name="minPrice"
                value={filter.minPrice}
                onChange={handleFilterChange}
                placeholder="Min Price"
            />
            <input
                type="number"
                name="maxPrice"
                value={filter.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max Price"
            />
            <ProductForm onSubmit={handleSubmit} initialData={editingProduct} />
            <ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} onSort={handleSort} sortConfig={sortConfig} />
        </div>
    );
}

export default ProductManagement;
