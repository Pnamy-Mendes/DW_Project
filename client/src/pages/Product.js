import React from 'react';

function Product({ product, onEdit, onDelete }) {
    return (
        <div className="product-item">
            <img src={product.photoPath} alt={product.name} style={{ width: '100px', height: '100px' }} />
            <h3>{product.name}</h3>
            <p>Price: ${product.price.toFixed(2)}</p>
            <p>Category: {product.category}</p>
            {product.promoDetails && <p>Promo: {product.promoDetails}</p>}
            <button onClick={() => onEdit(product)}>Edit</button>
            <button onClick={() => onDelete(product._id)}>Delete</button>
        </div>
    );
}

export default Product;
