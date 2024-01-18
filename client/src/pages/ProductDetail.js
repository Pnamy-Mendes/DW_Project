import React from 'react';

function ProductDetail({ product }) {
    return (
        <div className="product">
            <img src={product.photoPath} alt={product.name} />
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            {product.promoDetails && <p>Promo: {product.promoDetails}</p>}
            {/* Add other product details */}
        </div>
    );
}

export default ProductDetail;
