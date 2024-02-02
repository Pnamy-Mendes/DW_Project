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
    const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : {};
    console.log('userinfo',userInfo);

    const addToCart = async (product) => {
        // Update the cookie
        let cartItems = Cookies.get('cartItems') ? JSON.parse(Cookies.get('cartItems')) : [];
        cartItems.push(product._id); // Assuming you want to store product IDs
        Cookies.set('cartItems', JSON.stringify(cartItems), { expires: 7 });
    
        // Call the API to update the cart in the database
        try {
            const userId = userInfo.userId; // Assuming you're storing the user ID in the userInfo cookie
            const response = await axios.post(`${apiUrl}:3001/api/cart/`, { userId, productId: product._id });
            
            if (response.status === 201) {
                showToast('success', 'Success', 'Item added to cart');
            } else {
                // Handle any other HTTP status codes as needed
                showToast('error', 'Error', 'Could not add item to cart');
            }
        } catch (error) {
            showToast('error', 'Error', 'Could not add item to cart');
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
                    <img src={`${apiUrl}:3001${product.imageName}`} alt={product.name} className="product-image" />
                </div>
                <div>
                    <h4 className="mb-1">{product.name}</h4>
                    <h6 className="mt-0 mb-3">${product.price}</h6>
                    <Tag value={product.inventoryStatus} severity={getSeverity(product.inventoryStatus)}></Tag>
                    <div className="product-actions mt-5 flex flex-wrap gap-2 justify-content-center">
                        <Button label="Add to Cart" icon="pi pi-plus" className="p-button-rounded p-button-outlined" onClick={() => addToCart(product)} />
                        {/* <Button icon="pi pi-search" className="p-button-rounded" onClick={() => navigate(`/product/${product._id}`)} /> */}
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
