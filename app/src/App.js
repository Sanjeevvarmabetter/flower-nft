import React, { useState } from "react";
import Product from "./components/Product";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";


const initialProducts = [
    { id: 1, name: "Rose", price: 10, image: "" },
    { id: 2, name: "Tulip", price: 12, image: "" },
    { id: 3, name: "Daisy", price: 8, image: "" },
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
            <h1>Flower Shop</h1>
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