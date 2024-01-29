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
        axios.get('http://localhost:3001/api/categories')
            .then(response => {
                setCategories(response.data);
                if (product) {
                    initializeFormSelections();
                }
            })
            .catch(error => console.error('Error fetching categories:', error));
    }, [product]);

    const initializeFormSelections = () => {
        const initialSubSubCategories = product.subSubCategories || [];
        setSelectedSubSubCategories(initialSubSubCategories);

        if (initialSubSubCategories.length > 0) {
            const parentSubCategoryId = initialSubSubCategories[0].parentCategory;
            fetchSubCategoryAndSet(parentSubCategoryId);
        }
    };

    const fetchSubCategoryAndSet = (subCategoryId) => {
        axios.get(`http://localhost:3001/api/categories/${subCategoryId}`)
            .then(response => {
                const subCategory = response.data;
                fetchCategoryAndSet(subCategory.parentCategory);
                // After setting the parent category, fetch its subcategories
                fetchSubCategories(subCategory.parentCategory, subCategory._id);
            })
            .catch(error => console.error('Error fetching subcategory:', error));
    };

    const fetchCategoryAndSet = (categoryId) => {
        axios.get(`http://localhost:3001/api/categories/${categoryId}`)
            .then(response => {
                setSelectedCategory(response.data);
                fetchSubCategories(categoryId);
            })
            .catch(error => console.error('Error fetching category:', error));
    };

    const fetchSubCategories = (categoryId, subCategoryIdToSelect) => {
        axios.get(`http://localhost:3001/api/categories/${categoryId}/subcategories`)
            .then(response => {
                setSubCategories(response.data);
                // After subcategories are set, find and set the selected subcategory
                if (subCategoryIdToSelect) {
                    const subCategoryToSelect = response.data.find(sc => sc._id === subCategoryIdToSelect);
                    setSelectedSubCategory(subCategoryToSelect);
                }
            })
            .catch(error => console.error('Error fetching subcategories:', error));
    };

    const fetchSubSubCategories = (subCategoryId) => {
        axios.get(`http://localhost:3001/api/categories/${subCategoryId}/subcategories`)
            .then(response => {
                setSubSubCategories(response.data);
                // If there are sub-subcategories, pre-select them based on the product
                if (product && product.subSubCategories) {
                    const preSelectedSubSubCategories = response.data.filter(ssc =>
                        product.subSubCategories.some(pssc => pssc._id === ssc._id)
                    );
                    setSelectedSubSubCategories(preSelectedSubSubCategories);
                }
            })
            .catch(error => console.error('Error fetching sub-subcategories:', error));
    };
    
    useEffect(() => {
        // When a subcategory is selected, fetch its sub-subcategories
        if (selectedSubCategory) {
            fetchSubSubCategories(selectedSubCategory._id);
        }
    }, [selectedSubCategory]);

    const handleInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        setProduct({ ...product, [name]: val });
    };

    const handleInputNumberChange = (e, name) => {
        const val = e.value || 0;
        setProduct({ ...product, [name]: val });
    };

    const handleImageUpload = (event) => {
        const formData = new FormData();
        formData.append('image', event.target.files[0]);
    
        axios.post('http://localhost:3001/api/products/upload', formData)
            .then(res => {
                const { imagePath } = res.data;
                setProduct(prevProduct => ({ ...prevProduct, imageName: imagePath }));
            })
            .catch(err => console.error('Error uploading image:', err));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const subSubCategoryIds = selectedSubSubCategories.map(ssc => ssc._id);

        const updatedProduct = {
            ...product,
            subSubCategories: subSubCategoryIds,
        };
    
        onSubmit(updatedProduct);
    };


    return (
        <form className="p-fluid" onSubmit={handleSubmit}>
            <div className="field">
                <label htmlFor="productName">Name</label>
                <InputText id="productName" value={product.name || ''} onChange={(e) => handleInputChange(e, 'name')} required autoFocus />
                {product.name && !product.name.trim() && <small className="p-error">Name is required.</small>}
            </div>
            <div className="field">
                <label htmlFor="productDescription">Description</label>
                <InputTextarea id="productDescription" value={product.description || ''} onChange={(e) => handleInputChange(e, 'description')} required rows={3} />
            </div>
            {/* Other fields... */}
            <div className="field">
                <label htmlFor="productCategory">Category</label>
                <Dropdown id="productCategory" value={selectedCategory} options={categories} onChange={(e) => setSelectedCategory(e.value)} optionLabel="name" placeholder="Select a Category" />
            </div>
            
            {selectedCategory && (
                <div className="field">
                    <label htmlFor="productSubCategory">SubCategory</label>
                    <Dropdown id="productSubCategory" value={selectedSubCategory} options={subCategories} onChange={(e) => setSelectedSubCategory(e.value)} optionLabel="name" placeholder="Select a SubCategory" />
                </div>
            )}
            
            {selectedSubCategory && subSubCategories.length > 0 && (
                <div className="field">
                    <label htmlFor="productSubSubCategories">Sub-SubCategories</label>
                    <MultiSelect id="productSubSubCategories" value={selectedSubSubCategories} options={subSubCategories} onChange={(e) => setSelectedSubSubCategories(e.value)} optionLabel="name" placeholder="Select Sub-SubCategories" />
                </div>
            )}
            <div className="field">
                <label htmlFor="image">Image</label>
                <input type="file" id="image" name="image" accept="image/*" onChange={handleImageUpload} />
            </div>

            {product.imageName && (
                <div className="field">
                    <label>Selected Image:</label>
                    <img
                        src={`http://localhost:3001${product.imageName}`}
                        alt="Product"
                        style={{ width: '95%' }} // Set the width to 100%
                    />
                </div>
            )}


            <div className="flex justify-content-end mt-3">
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onHide} />
                <Button label="Save" icon="pi pi-check" className="p-button-text" type="submit" />
            </div>
        </form>
    );
}
