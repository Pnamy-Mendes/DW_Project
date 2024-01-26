import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar'; 


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
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

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

    const confirmDeleteSelectedProducts = () => {
        if (selectedProducts.length > 0) {
            setProductToDelete(selectedProducts);
            setDeleteProductDialog(true);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'No products selected', life: 3000 });
        }
    };

    // Update confirmDeleteProduct for individual product deletion
    const confirmDeleteProduct = (product) => {
        setProductToDelete([product]); // Set the single product to be deleted
        setDeleteProductDialog(true); // Show the confirmation dialog
    };
    

    // Call this function when you want to hide the delete confirmation dialog
    const hideDeleteProductsDialog = () => {
        setDeleteProductDialog(false);
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

    const deleteSelectedProducts = () => {
        axios.all(productToDelete.map(product => 
            axios.delete(`http://localhost:3001/api/products/${product._id}`)
        )).then(() => {
            setProducts(products.filter(prod => !productToDelete.includes(prod)));
            setSelectedProducts([]);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
            setDeleteProductDialog(false);
            setProductToDelete(null); // Clear the productToDelete after deletion
        }).catch(error => {
            console.error('Error deleting products:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while deleting products', life: 3000 });
        });
    };

    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelectedProducts} disabled={!selectedProducts.length} />
            </React.Fragment>
        );
    };

    const applyPromotionToSelectedProducts = () => {
        // Logic to apply promotions
        // Update backend and then update the state
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
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                {/* <Button label="New Product" icon="pi pi-plus" onClick={openNew} className="mb-3" /> */}
                <ProductTable 
                    products={products} 
                    onEdit={editProduct} 
                    onDelete={confirmDeleteProduct} 
                    confirmDeleteProduct={confirmDeleteProduct}
                    selection={selectedProducts}  
                    onSelectionChange={(e) => setSelectedProducts(e.value)}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
            </div>
            <Dialog 
                visible={deleteProductDialog} 
                style={{ width: '450px' }} 
                header={<span>Confirm Delete <i className="pi pi-exclamation-triangle" style={{ color: 'red', fontSize: '1.5rem', padding: '10px' }} /></span>} 
                modal 
                footer={deleteProductsDialogFooter} 
                onHide={() => setDeleteProductDialog(false)}>
                    

                <p>Are you sure you want to delete {productToDelete && productToDelete.map(p => p.name).join(", ")}?</p>
            </Dialog>

            <Dialog 
                visible={productDialog} 
                style={{ width: '450px' }} 
                header="Product Details" 
                modal 
                onHide={hideDialog}>

                <ProductForm product={product} setProduct={setProduct} onSubmit={saveProduct} onHide={hideDialog} onUpload={onUpload} />
            </Dialog>
                 
        </div>
    );
}
