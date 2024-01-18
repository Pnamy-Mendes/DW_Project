import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from './Product';

function HomePage() {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({}); // e.g., { category: 'Electronics' }
    const [sort, setSort] = useState({}); // e.g., { sortBy: 'price', sortOrder: 'asc' }

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const queryParams = new URLSearchParams({ ...filters, ...sort });
                const response = await axios.get(`http://localhost:3001/products?${queryParams}`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products', error);
            }
        };

        fetchProducts();
    }, [filters, sort]);

    return (
        <div className="main-page">
            {/* Add filter and sort controls here */}
            <div className="products-list">
                {products.map(product => (
                    <Product key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default HomePage;
