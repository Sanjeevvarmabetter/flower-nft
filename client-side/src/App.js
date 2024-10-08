// src/App.js
import React from "react";
import { Container } from "@mui/material";
import Listing from "./Listing";

function App() {
    return (
        <Container maxWidth="lg">
            <h1>NFT Marketplace</h1>
            <Listing />
        </Container>
    );
}

export default App;
