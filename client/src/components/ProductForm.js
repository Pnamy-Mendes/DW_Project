import React, { useState, useEffect } from 'react';
import './css/ProductForm.css';  

function ProductForm({ onSubmit, initialData }) {
    const [productData, setProductData] = useState({
        name: '',
        price: '',
        category: '',
        imageName: '',
        promoDetails: ''
    });

    useEffect(() => {
        if (initialData) {
            setProductData(initialData);
        } else {
            // Reset form if no product is being edited
            setProductData({
                name: '',
                price: '',
                category: '',
                imageName: '',
                promoDetails: ''
            });
        }
    }, [initialData]);


    const handleChange = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        // Assuming you want to store only the file name
        if (e.target.files.length > 0) {
            const imageName = e.target.files[0].name;
            setProductData({ ...productData, imageName });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(productData);
    };
    

    return (
        <div className="product-form-container">
            <form onSubmit={handleSubmit} className="product-form">
                <input 
                    type="text" 
                    name="name" 
                    value={productData.name}
                    onChange={handleChange}
                    placeholder="Name"
                />
                <input 
                    type="number" 
                    name="price"
                    value={productData.price}
                    onChange={handleChange}
                    placeholder="Price"
                />
                <input 
                    type="text" 
                    name="category"
                    value={productData.category}
                    onChange={handleChange}
                    placeholder="Category"
                />
                <input 
                    type="file" 
                    name="image"
                    accept="image/png, image/jpeg" // Accept only PNG, JPEG, and JPG files
                    onChange={handleImageChange}
                />
                <textarea 
                    name="promoDetails"
                    value={productData.promoDetails}
                    onChange={handleChange}
                    placeholder="Promotional Details"
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default ProductForm;