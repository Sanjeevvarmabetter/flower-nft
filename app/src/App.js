import React, { useState, useEffect } from "react";
import { ethers, utils } from "ethers";
import Product from "./components/Product";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";

// Sample products
const initialProducts = [
    { id: 1, name: "Rose", price: 0.0001, image: "./flowers/1.jpeg" },
    { id: 2, name: "Tulip", price: 0.0001, image: "./flowers/2.jpeg" },
    { id: 3, name: "Daisy", price: 0.0001, image: "./flowers/3.jpeg" },
    { id: 4, name: "Sunflower", price: 0.0001, image: "./flowers/4.jpeg" },
    { id: 5, name: "Lily", price: 0.0001, image: "./flowers/5.jpeg" },
    { id: 6, name: "Orchid", price: 0.0001, image: "./flowers/6.jpeg" },
    { id: 7, name: "Chrysanthemum", price: 0.0001, image: "./flowers/7.jpg" },
    { id: 8, name: "Pansy", price: 0.0001, image: "./flowers/8.jpg" },
];

const App = () => {
    const [products] = useState(initialProducts);
    const [cart, setCart] = useState([]);
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [soldProducts, setSoldProducts] = useState(new Set()); 

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [useraddress,setuserAddress] = useState(null);


    useEffect(() => {
        const storedSoldProducts = localStorage.getItem("soldProducts");
        if (storedSoldProducts) {
            setSoldProducts(new Set(JSON.parse(storedSoldProducts)));
        }
    }, []);

    // Function to connhttps://www.linkedin.com/in/praneethvarmaect to MetaMask
    const connectToMetamask = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const newProvider = new ethers.providers.Web3Provider(window.ethereum);
                const newSigner = newProvider.getSigner();
                const address = await newSigner.getAddress();


                window.ethereum.on("accountsChanged", (accounts) => {
                    console.log("Accounts changed:", accounts);
                    if(address.length>0) {
                        setuserAddress(accounts[0]);
                    }
                    else {
                        setuserAddress("");
                    }
                });

                window.ethereum.on("chainChanged", (chainId) => {
                    console.log("Network changed:", chainId);
                });

                setProvider(newProvider);
                setSigner(newSigner);
                setuserAddress(address);

            } catch (error) {
                console.error("Error connecting to MetaMask:", error);
                alert("Please make sure you have installed the MetaMask wallet and try again.");
            }
        } else {
            alert("MetaMask is not installed. Please install it.");
        }
    };

    console.log(connectToMetamask);

    const checkout = async ( productId) => {
        const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);
        // floating point eror fix: use ToFixed(18) this ensures that total price is formatted to 18 decimmal places
        const totalPriceInWei = utils.parseEther(totalPrice.toFixed(18).toString());

        if (signer) {
            try {
                const transaction = await signer.sendTransaction({
                    to: "0x7030aab4523EEDeB6562d22CA9F21F9b258fE0d9",
                    value: totalPriceInWei
                });

                await transaction.wait();
                alert("Transaction successful");

                const updatedSoldProducts = new Set(soldProducts);
                updatedSoldProducts.add(productId); // Add productId to sold products
                setSoldProducts(updatedSoldProducts);
                localStorage.setItem("soldProducts", JSON.stringify([...updatedSoldProducts])); // Store in local storage

                setCart((prevCart) => prevCart.filter((item) => item.id !== productId)); // Remove from cart
                setIsCheckedOut(true);
            } catch (error) {
                console.error("Transaction failed", error);
                alert("Transaction failed. Please try again.");
            }
        } else {
            alert("Please connect to MetaMask first.");
        }
    };

    // Function to add product to cart
    const addToCart = (product) => {
        const isProductInCart = cart.some((item) => item.id === product.id);
        if(!isProductInCart) {
            setCart((prevCart) => [...prevCart, product]);
        }
        else {
            alert("The particular NFT already exists in your cart");
        }
    };

    // Function to remove product from cart
    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    // Filter available products
    const availableProducts = products.filter((product) => !soldProducts.has(product.id));

    return (
        <div className="App">
            <h1>Flower NFT Shop</h1>
            {!isCheckedOut ? (
                <>
                    <button onClick={connectToMetamask}>Connect to MetaMask</button>
                    <div className="connect-msg">{useraddress && <p>Connected Address: {useraddress}</p>}</div>  
                    <Product products={availableProducts} addToCart={addToCart} />
                    <Cart 
                        cart={cart} 
                        removeFromCart={removeFromCart} 
                        checkout={checkout} 
                    />
                </>
            ) : (
                <Checkout setIsCheckedOut={setIsCheckedOut} />
            )}
        </div>
    );
};

export default App;