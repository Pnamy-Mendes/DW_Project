import React from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { FileUpload } from 'primereact/fileupload';

export default function ProductForm({ product, setProduct, onSubmit, onHide, onUpload }) {
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        setProduct({ ...product, [name]: val });
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        setProduct({ ...product, [name]: val });
    };

    const onCategoryChange = (e) => {
        setProduct({ ...product, category: e.value });
    };

    const handleImageUpload = (event) => {
        const formData = new FormData();
        formData.append('image', event.target.files[0]);
    
        axios.post('http://localhost:3001/api/products/upload', formData)
            .then(res => {
                const { imagePath } = res.data;
                console.log('Image uploaded successfully:', imagePath)
                setProduct(prevProduct => ({ ...prevProduct, imageName: imagePath }));
            })
            .catch(err => console.error('Error uploading image:', err));
    };

    return (
        <div>
            <div className="field">
                <label htmlFor="name">Name</label>
                <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={product.name.trim() ? '' : 'p-invalid'} />
                {!product.name.trim() && <small className="p-error">Name is required.</small>}
            </div>
            <div className="field">
                <label htmlFor="description">Description</label>
                <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} />
            </div>
            <div className="field">
                <label htmlFor="price">Price</label>
                <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="EUR" />
            </div>
            <div className="field">
                <label htmlFor="quantity">Quantity</label>
                <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
            </div>
            <div className="field">
                <label>Category</label>
                <div className="formgrid grid">
                    {/* TODO: Update ir buscar as categorias à bd, dar para editar, update e remover categorias */}
                    {/* Add categories as needed */}
                    <div className="field-radiobutton col-6">
                        <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={product.category === 'Accessories'} />
                        <label htmlFor="category1">Accessories</label>
                    </div>
                    {/* Repeat for other categories */}
                </div>
            </div>
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
