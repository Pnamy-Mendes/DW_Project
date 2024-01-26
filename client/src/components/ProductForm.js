import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';

export default function ProductForm({ product, setProduct, onSubmit, onHide, onUpload }) {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subSubCategories, setSubSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [selectedSubSubCategories, setSelectedSubSubCategories] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/api/categories?parentCategory=null')
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            axios.get(`http://localhost:3001/api/categories?parentCategory=${selectedCategory._id}`)
                .then(response => setSubCategories(response.data))
                .catch(error => console.error('Error fetching subcategories:', error));
        } else {
            setSubCategories([]);
            setSelectedSubCategory(null);
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (selectedSubCategory) {
            axios.get(`http://localhost:3001/api/categories?parentCategory=${selectedSubCategory._id}`)
                .then(response => setSubSubCategories(response.data))
                .catch(error => console.error('Error fetching sub-subcategories:', error));
        } else {
            setSubSubCategories([]);
            setSelectedSubSubCategories([]);
        }
    }, [selectedSubCategory]);

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        setProduct({ ...product, [name]: val });
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        setProduct({ ...product, [name]: val });
    };

    const handleImageUpload = (event) => {
        const formData = new FormData();
        formData.append('image', event.target.files[0]);
    
        axios.post('http://localhost:3001/api/upload', formData)
            .then(res => {
                const { imagePath } = res.data;
                console.log('Image uploaded successfully:', imagePath)
                setProduct(prevProduct => ({ ...prevProduct, imageName: imagePath }));
            })
            .catch(err => console.error('Error uploading image:', err));
    };

    return (
        <div className="p-fluid">
            <div className="field">
                <label htmlFor="name">Name</label>
                <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={product.name.trim() ? '' : 'p-invalid'} />
                {!product.name.trim() && <small className="p-error">Name is required.</small>}
            </div>
            <div className="field">
                <label htmlFor="description">Description</label>
                <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} />
            </div>
            <div className="formgrid grid">
                <div className="field col-6">
                    <label htmlFor="price">Price</label>
                    <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="EUR" />
                </div>
                <div className="field col-6">
                    <label htmlFor="quantity">Quantity</label>
                    <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                </div>
            </div>
            <div className="field">
                <label htmlFor="category">Category</label>
                <Dropdown id="category" value={selectedCategory} options={categories} onChange={(e) => setSelectedCategory(e.value)} optionLabel="name" placeholder="Select a Category" />
            </div>
            {selectedCategory && (
                <div className="field">
                    <label htmlFor="subCategory">SubCategory</label>
                    <Dropdown id="subCategory" value={selectedSubCategory} options={subCategories} onChange={(e) => setSelectedSubCategory(e.value)} optionLabel="name" placeholder="Select a SubCategory" />
                </div>
            )}
            {selectedSubCategory && (
                <div className="field">
                    <label htmlFor="subSubCategories">Sub-SubCategories</label>
                    <MultiSelect id="subSubCategories" value={selectedSubSubCategories} options={subSubCategories} onChange={(e) => setSelectedSubSubCategories(e.value)} optionLabel="name" placeholder="Select Sub-SubCategories" />
                </div>
            )}
            <div className="field">
                <label htmlFor="image">Image</label>
                <input type="file" id="image" name="image" accept="image/*" onChange={handleImageUpload} />
            </div>
            <div className="flex justify-content-end mt-3">
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onHide} />
                <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={onSubmit} />
            </div>
        </div>
    );
}
