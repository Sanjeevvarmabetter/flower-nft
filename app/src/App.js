import React, { useState } from "react";
import Product from "./components/Product";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";


// sample flowers

const initialProducts = [
  { id: 1, name: "Rose", price: 10, image: "./flowers/1.jpeg" },
  { id: 2, name: "Tulip", price: 12, image: "./flowers/2.jpeg" },
  { id: 3, name: "Daisy", price: 8, image: "./flowers/3.jpeg" },
  { id: 4, name: "Sunflower", price: 15, image: "./flowers/4.jpeg" },
  { id: 5, name: "Lily", price: 20, image: "./flowers/5.jpeg" },
  { id: 6, name: "Orchid", price: 25, image: "./flowers/6.jpeg" },
  { id: 7, name: "Chrysanthemum", price: 18, image: "./flowers/7.jpg" },
  { id: 8, name: "Pansy", price: 14, image: "./flowers/8.jpg" },
];


const App = () => {
    const [products] = useState(initialProducts);
    const [cart, setCart] = useState([]);
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [soldProducts, setSoldProducts] = useState([]);


    const addToCart = (product) => {
        setCart((prevCart) => [...prevCart, product]);

        setSoldProducts((prevIds) => [...prevIds, product.id]);
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const checkout = () => {
        setIsCheckedOut(true);
        setCart([]); 
    };

    const availableProducts = products.filter(product => !soldProducts.includes(product.id));

    return (
        <div className="App">
            <h1>Flower NFT Shop</h1>
            {!isCheckedOut ? (
                <>
                    <Product products={availableProducts} addToCart={addToCart} />
                    <Cart cart={cart} removeFromCart={removeFromCart} checkout={checkout} />
                </>
            ) : (
                <Checkout setIsCheckedOut={setIsCheckedOut} />
            )}
        </div>
    );
};

export default App;