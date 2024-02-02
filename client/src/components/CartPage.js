import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import ConfigContext from './../contexts/ConfigContext';
import './css/cart.css'; // Make sure the path is correct
import { OrderList } from 'primereact/orderlist';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function CartPage() {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const toast = useRef(null);
    const { getApiUrl } = useContext(ConfigContext);
    const apiUrl = getApiUrl(); 
    const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null; 
    const navigate = useNavigate();

    useEffect(() => {
      const fetchCart = async () => {
          const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null; 
          if (userInfo && userInfo.userId) {
              try {
                  const response = await axios.get(`${apiUrl}:3001/api/cart/${userInfo.userId}`);
                  setCart(response.data.products || []);
                  calculateTotal(response.data.products || []);
              } catch (error) {
                  console.error('Error fetching cart:', error);
              }
          }
      };
  
      fetchCart();
  }, [apiUrl]);

    const calculateTotal = (products) => {
        const sum = products.reduce((acc, product) => acc + product.price, 0);
        setTotal(sum);
    };

    const handleRemove = async (productId) => {
      const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')).userId : null;
      if (userInfo) {
          try {
              await axios.delete(`${apiUrl}:3001/api/cart/${userInfo}/${productId}`);
              const updatedCart = cart.filter((product) => product._id !== productId);
              setCart(updatedCart);
              calculateTotal(updatedCart);
              toast.current.show({ severity: 'success', summary: 'Success', detail: 'Item removed from cart' });
          } catch (error) {
              console.error('Error removing item:', error);
              toast.current.show({ severity: 'error', summary: 'Error', detail: 'Could not remove item from cart' });
          }
      } else {
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'You must be logged in to remove items from your cart' });
      }
    };

    const handleCheckout = async () => {
      const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')).userId : null;
  
      if (userInfo && cart.length > 0) {
          try {
              // Create a sale record
              const saleResponse = await axios.post(`${apiUrl}:3001/api/sales`, {
                  userId: userInfo,
                  products: cart.map(product => product._id), // Assuming cart contains product objects
                  address: "User's address here" // Replace with actual user address
              });
  
              if (saleResponse.status === 201) {
                  // Clear the cart after successful sale record creation
                  console.log(userInfo)
                  await axios.delete(`${apiUrl}:3001/api/cart/clear/${userInfo}`);
                  setCart([]);
                  setTotal(0);
                  toast.current.show({ severity: 'success', summary: 'Thank you', detail: 'Your purchase was successful!' });
              }
          } catch (error) {
              console.error('Checkout error:', error);
              toast.current.show({ severity: 'success', summary: 'Thank you', detail: 'Your purchase was successful!' });
              navigate('/')
          }
      } else {
          toast.current.show({ severity: 'error', summary: 'Checkout Error', detail: 'You must be logged in and have items in your cart to checkout.' });
      }
  };

    const itemTemplate = (product) => {
      console.log(product)
        return (
            <div className="flex align-items-center justify-content-between">
                <img src={`${apiUrl}:3001${product.imageName}`} alt={product.name} className="cart-item-image w-6 shadow-2 border-round" />
                <div className="flex flex-column">
                    <div className="font-bold">{product.name}</div>
                    <span>{product.subsubcategory}</span>
                    <span className="font-bold text-900">${product.price.toFixed(2)}</span>
                </div>
                <Button icon="pi pi-times" className="p-button-rounded p-button-danger" onClick={() => handleRemove(product._id)} />
            </div>
        );
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <OrderList value={cart} itemTemplate={itemTemplate} header="Your Cart" listStyle={{ maxHeight: '400px' }} />
            <div className="flex justify-content-between mt-2">
                <h2>Total: {total.toFixed(2)}€</h2>
                <Button label="Checkout" icon="pi pi-check" onClick={handleCheckout} />
            </div>
        </div>
    );
}

export default CartPage;