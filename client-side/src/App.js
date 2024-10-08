// src/App.js
import React from "react";
import { Container } from "@mui/material";
import Listing from "./Listing";

function App() {
    return (
      <div className="MainApp">
                <Container maxWidth="lg">
            <h1>NFT Marketplace</h1>
            <Listing />
        </Container>
      </div>

    );
}

export default App;
