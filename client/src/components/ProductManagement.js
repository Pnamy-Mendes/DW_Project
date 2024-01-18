import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import ProductForm from './ProductForm';

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSort = (field, direction) => {
        const sortedProducts = [...products].sort((a, b) => {
            if (direction === 'asc') {
                return a[field] > b[field] ? 1 : -1;
            } else {
                return a[field] < b[field] ? 1 : -1;
            }
        });
        setProducts(sortedProducts);
    };

    const [filter, setFilter] = useState({ category: '', minPrice: '', maxPrice: '' });

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const applyFilter = () => {
        fetchProducts(filter);
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products', error);
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
            <ProductForm onSubmit={handleSubmit} initialData={editingProduct} />
            <ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
    );
}

export default ProductManagement;
