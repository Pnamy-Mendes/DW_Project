import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

import ProductTable from './ProductTable';
import ProductForm from './ProductForm';

import 'primeicons/primeicons.css';  
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import './css/flag.css'; 
import './css/ProductManagement.css'

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [productDialog, setProductDialog] = useState(false);
    const [product, setProduct] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:3001/api/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const openNew = () => {
        setProduct({ id: null, name: '', image: null, description: '', category: null, price: 0, quantity: 0, rating: 0, inventoryStatus: 'INSTOCK' });
        setProductDialog(true);
    };

    const hideDialog = () => {
        setProductDialog(false);
    };

    const saveProduct = () => {
        if (product.name.trim()) {
            if (product._id) {
                // Update existing product
                axios.put(`http://localhost:3001/api/products/${product._id}`, product)
                    .then(response => {
                        // Replace the updated product in the state
                        const updatedProducts = products.map(p => p._id === product._id ? { ...response.data } : p);
                        setProducts(updatedProducts);
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
                    })
                    .catch(error => {
                        console.error('Error updating product:', error);
                        // Optionally, show an error toast message
                    });
            } else {
                // Create new product
                axios.post('http://localhost:3001/api/products', product)
                    .then(response => {
                        // Add the new product to the state
                        setProducts([...products, response.data]);
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                    })
                    .catch(error => {
                        console.error('Error creating product:', error);
                        // Optionally, show an error toast message
                    });
            }
            setProductDialog(false);
        }
    };
    

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const deleteProduct = (product) => {
        axios.delete(`http://localhost:3001/api/products/${product._id}`)
            .then(() => {
                // Update the products state to remove the deleted product
                const updatedProducts = products.filter(p => p._id !== product._id);
                setProducts(updatedProducts);

                // Display success message
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
            })
            .catch(error => {
                // Handle any errors here
                console.error('Error deleting product:', error);
                // Optionally, show an error toast message
            });
    };

    const onUpload = (e) => {
        const formData = new FormData();
        formData.append('image', e.files[0]);
        axios.post('http://localhost:3001/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            const imageUrl = response.data.path;
            setProduct({ ...product, image: imageUrl });
        })
        .catch(error => console.error('Error uploading file:', error));
    };

    

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Button label="New Product" icon="pi pi-plus" onClick={openNew} className="mb-3" />
                <ProductTable products={products} onEdit={editProduct} onDelete={deleteProduct} />
            </div>
            <Dialog visible={productDialog} style={{ width: '450px' }} header="Product Details" modal onHide={hideDialog}>
                <ProductForm product={product} setProduct={setProduct} onSubmit={saveProduct} onHide={hideDialog} onUpload={onUpload} />
            </Dialog>
        </div>
    );
}
