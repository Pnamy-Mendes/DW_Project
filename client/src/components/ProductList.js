function ProductList({ products, onEdit, onDelete, onSort, sortConfig }) {

    const getSortArrow = (field) => {
        if (sortConfig && sortConfig.field === field) {
            const isAscending = sortConfig.direction === 'asc';
            const arrowSymbol = isAscending ? '↑' : '↓';
            const arrowClass = isAscending ? 'sort-arrow-asc' : 'sort-arrow-desc';
            return <span className={arrowClass}>{arrowSymbol}</span>;
        }
        return '';
    };

    return (
        <table>
            <thead>
                <tr>
                    <th onClick={() => onSort('name')}>
                        Name {getSortArrow('name')}
                    </th>
                    <th onClick={() => onSort('price')}>
                        Price {getSortArrow('price')}
                    </th>
                    <th onClick={() => onSort('category')}>
                    Category {getSortArrow('category')}
                    </th>
                    <th onClick={() => onSort('promoDetails')}>
                    Promo Details {getSortArrow('promoDetails')}
                    </th>
                    <th> Actions </th> 
                </tr>
            </thead>
            <tbody>
                {products.map(product => (
                    <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.category}</td>
                        <td>{product.promoDetails}</td>
                        <td>
                            <button onClick={() => onEdit(product)}>Edit</button>
                            <button onClick={() => onDelete(product._id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default ProductList;