import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from './Product';

function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                // Handle errors appropriately
            }
        };

        fetchProducts();
    }, []);

    const handleEdit = (product) => {
        // Logic to handle product edit
        console.log('Edit product:', product);
    };

    const handleDelete = (productId) => {
        // Logic to handle product deletion
        console.log('Delete product ID:', productId);
    };

    return (
        <div className="products-container">
            {products.length > 0 ? (
                products.map(product => (
                    <Product 
                        key={product._id} 
                        product={product} 
                        onEdit={handleEdit} 
                        onDelete={handleDelete} 
                    />
                ))
            ) : (
                <p>No products available.</p>
            )}
        </div>
    );
}

export default Products;
