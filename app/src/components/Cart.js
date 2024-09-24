import React from "react";
import "../App.css";

const Cart = ({ cart, removeFromCart, checkout }) => {
    // Calculate total price
    const totalPrice = cart.reduce((total, item) => total + item.price, 0);

    return (
        <div className="cart">
            <h2>Shopping Cart</h2>
            {cart.length === 0 ? (
                <p>No items in cart.</p>
            ) : (
                <>
                    {cart.map((item) => (
                        <div key={item.id} className="cart-item">
                            <img src={item.image} alt={item.name} className="cart-item-image" />
                            <span>{item.name}</span>
                            <button onClick={() => removeFromCart(item.id)}>Remove</button>
                        </div>
                    ))}
                    <h3>Total Price: {totalPrice} ETH</h3>
                    <button onClick={() => checkout(totalPrice)}>Checkout</button> 
                </>
            )}
        </div>
    );
};

export default Cart;
