import React from 'react';
import { Link } from 'react-router-dom';
import "../App.css";
const Navbar = () => {
    return (
        <nav>
            <h2>Flower NFT Shop</h2>
            <div>
                <Link to="/">Products</Link>
                <Link to="/cart">Cart</Link> 
      
            </div>
        </nav>
    );
};

export default Navbar;
