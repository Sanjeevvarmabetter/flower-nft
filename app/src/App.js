import React, { useState } from "react";
import { ethers, utils } from "ethers";
import Product from "./components/Product";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";

// Sample data
const initialProducts = [
    { id: 1, name: "Rose", price: 1, image: "./flowers/1.jpeg" },
    { id: 2, name: "Tulip", price: 1, image: "./flowers/2.jpeg" },
    { id: 3, name: "Daisy", price: 1, image: "./flowers/3.jpeg" },
    { id: 4, name: "Sunflower", price: 1, image: "./flowers/4.jpeg" },
    { id: 5, name: "Lily", price: 1, image: "./flowers/5.jpeg" },
    { id: 6, name: "Orchid", price: 1, image: "./flowers/6.jpeg" },
    { id: 7, name: "Chrysanthemum", price: 1, image: "./flowers/7.jpg" },
    { id: 8, name: "Pansy", price: 1, image: "./flowers/8.jpg" },
];

const App = () => {
    const [products] = useState(initialProducts);
    const [cart, setCart] = useState([]);
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [soldProducts, setSoldProducts] = useState([]);

    // web3 integration
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);

    // Connecting to MetaMask
    const connectToMetamask = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const newProvider = new ethers.providers.Web3Provider(window.ethereum);
                const newSigner = newProvider.getSigner();

                window.ethereum.on("accountsChanged", (accounts) => {
                    console.log("Accounts changed:", accounts);
                });

                window.ethereum.on("chainChanged", (chainId) => {
                    console.log("Network changed:", chainId);
                });

                setProvider(newProvider);
                setSigner(newSigner);
            } catch (error) {
                console.error("Error connecting to MetaMask:", error);
                alert("install metamask.");
            }
        } else {
            alert("MetaMask not instaled Please install it.");
        }
    };

    const checkout = async (totalPrice) => {
        const totalPriceInWei = utils.parseEther(totalPrice.toString());

        if (signer) {
            try {
                const transaction = await signer.sendTransaction({
                    to: "0x7030aab4523EEDeB6562d22CA9F21F9b258fE0d9", // reciever wallet public address
                    value: totalPriceInWei,
                });

                await transaction.wait();
                alert("Transaction successful");
                setCart([]);
                setIsCheckedOut(true);
            } catch (error) {
                console.error("Transaction failed", error);
                alert("Transaction failed. Please try again.");
            }
        } else {
            alert("Please connect to MetaMask first.");
        }
    };

    const addToCart = (product) => {
        setCart((prevCart) => [...prevCart, product]);
        setSoldProducts((prevIds) => [...prevIds, product.id]);
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const availableProducts = products.filter(
        (product) => !soldProducts.includes(product.id)
    );

    return (
        <div className="App">
            <h1>Flower NFT Shop</h1>
            {!isCheckedOut ? (
                <>
                    <button onClick={connectToMetamask}>Connect to MetaMask</button>
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
