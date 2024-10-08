// src/components/Listing.js
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button, Card, CardContent, Typography, Grid, CircularProgress, Snackbar } from "@mui/material";
import abi from "./abi.json"; // Ensure the path is correct
import "./ActiveListings.css"; // Optional: for additional styling

const NFTMarketplaceAddress = "0xFbf4B3E81803352f83019d05b8A30b83924500A2";

const Listing = () => {
    const [activeListings, setActiveListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [account, setAccount] = useState("");

    // Connect to MetaMask and get the user's account
    const connectMetaMask = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                // Request account access if needed
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setAccount(accounts[0]);
                console.log("Connected Account:", accounts[0]);
            } catch (error) {
                console.error("Error connecting to MetaMask:", error);
                setErrorMessage("Failed to connect to MetaMask.");
                setOpenSnackbar(true);
            }
        } else {
            alert("MetaMask is not installed. Please install it to use this app.");
        }
    };

    // Fetch active listings from the smart contract
    const fetchActiveListings = async () => {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const NFTMarketplace = new ethers.Contract(NFTMarketplaceAddress, abi.abi, signer);
            
            try {
                const listings = await NFTMarketplace.fetchActiveListings();
                console.log("Fetched Listings:", listings);
                
                // Format listings with listingId as the index
                const formattedListings = listings.map((listing, index) => ({
                    listingId: index,
                    tokenId: listing.tokenId.toString(),
                    price: ethers.utils.formatEther(listing.price.toString()),
                    seller: listing.seller
                }));
                
                setActiveListings(formattedListings);
            } catch (error) {
                console.error("Error fetching active listings:", error);
                setErrorMessage("Failed to fetch active listings. Please try again.");
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle buying an NFT
    const buyNFT = async (listingId, listingPrice) => {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const NFTMarketplace = new ethers.Contract(NFTMarketplaceAddress, abi.abi, signer);

            try {
                // Convert price back to wei
                const priceInWei = ethers.utils.parseEther(listingPrice);
                const tx = await NFTMarketplace.buyItem(listingId, { value: priceInWei });
                await tx.wait();
                console.log(`NFT with Listing ID: ${listingId} purchased successfully!`);
                fetchActiveListings(); // Re-fetch listings after purchase
                setErrorMessage(""); // Clear any previous errors
            } catch (error) {
                console.error("Error buying NFT:", error);
                setErrorMessage("Failed to purchase NFT. Please try again.");
                setOpenSnackbar(true);
            }
        }
    };

    useEffect(() => {
        connectMetaMask().then(fetchActiveListings);
    }, []);

    // Handle Snackbar close event
    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                Active Listings
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Connected Account: {account}
            </Typography>
            {loading ? (
                <CircularProgress /> // Show a spinner while loading
            ) : (
                <Grid container spacing={2}>
                    {activeListings.map((listing) => (
                        <Grid item xs={12} sm={6} md={4} key={listing.listingId}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Listing ID: {listing.listingId}</Typography>
                                    <Typography>Seller: {listing.seller}</Typography>
                                    <Typography>Price: {listing.price} ETH</Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => buyNFT(listing.listingId, listing.price)}
                                    >
                                        Buy
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Snackbar for displaying error messages */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={errorMessage}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
        </div>
    );
};

export default Listing;
