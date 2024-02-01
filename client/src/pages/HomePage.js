import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Product from './Product';
import ConfigContext from './../contexts/ConfigContext'; // Import ConfigContext

function HomePage() {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({}); // e.g., { category: 'Electronics' }
    const [sort, setSort] = useState({}); // e.g., { sortBy: 'price', sortOrder: 'asc' }
    const { getApiUrl } = useContext(ConfigContext); // Use useContext to access getApiUrl

    useEffect(() => {
        const fetchProducts = async () => {
            const apiUrl = getApiUrl(); // Use getApiUrl to get the API URL
            try {
                const queryParams = new URLSearchParams({ ...filters, ...sort });
                const response = await axios.get(`${apiUrl}:3001/api/products?${queryParams}`); // Use apiUrl
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products', error);
            }
        };

        fetchProducts();
    }, [filters, sort, getApiUrl]); // Add getApiUrl as a dependency

    return (
        <div className="main-page">
            <div className="products-list">
                {products.map(product => (
                    <Product key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default HomePage;
