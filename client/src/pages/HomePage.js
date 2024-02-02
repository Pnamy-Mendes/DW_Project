import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Carousel } from 'primereact/carousel';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import ConfigContext from './../contexts/ConfigContext';
import isAuthenticated from './../utils/isAuthenticated';
import { useNavigate } from 'react-router-dom';
import './css/HomePage.css';
import Cookies from 'js-cookie';

function HomePage({ showToast }) {
    const [products, setProducts] = useState([]);
    const { getApiUrl } = useContext(ConfigContext);
    const apiUrl = getApiUrl();
    const navigate = useNavigate();

    const addToCart = async (product) => {
        // Update the cookie
        let cartItems = Cookies.get('cartItems') ? JSON.parse(Cookies.get('cartItems')) : [];
        cartItems.push(product);
        Cookies.set('cartItems', JSON.stringify(cartItems), { expires: 7 });
    
        // Update the database
        try {
            const userId = Cookies.get('userId'); // Assuming you're storing the user ID in a cookie
            await axios.post(`${apiUrl}:3001/api/cart`, { userId, productId: product._id });
            showToast('success', 'Success', 'Added to cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };
    
    
    const responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
        }

        const fetchProducts = async () => {
            const apiUrl = getApiUrl();
            try {
                const response = await axios.get(`${apiUrl}:3001/api/products`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products', error);
            }
        };

        fetchProducts();
    }, [getApiUrl, navigate]);

    const getSeverity = (status) => {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return null;
        }
    };

    const productTemplate = (product) => {
        return (
            <div className="product-item border-1 surface-border border-round m-2 text-center py-5 px-3">
                <div className="product-img mb-3">
                    <img src={`${apiUrl}:3001${product.imageName}`} alt={product.name} />
                </div>
                <div>
                    <h4 className="mb-1">{product.name}</h4>
                    <h6 className="mt-0 mb-3">${product.price}</h6>
                    <Tag value={product.inventoryStatus} severity={getSeverity(product.inventoryStatus)}></Tag>
                    <div className="product-actions mt-5 flex flex-wrap gap-2 justify-content-center">
                        <Button icon="pi pi-search" className="p-button p-button-rounded" />
                        <Button icon="pi pi-star-fill" className="p-button-success p-button-rounded" />
                    </div>
                </div>
            </div>
        );
    };
    

    return (
        <div className="homepage">
            <Carousel value={products} numScroll={1} numVisible={5} responsiveOptions={responsiveOptions} itemTemplate={productTemplate} />
        </div>
    );
}

export default HomePage;
