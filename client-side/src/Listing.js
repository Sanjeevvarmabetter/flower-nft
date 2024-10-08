import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button, Card, CardContent, Typography, Grid, CircularProgress, Snackbar } from "@mui/material";
import abi from "./abi.json"; // Ensure the path is correct
import "./ActiveListings.css"; 

const NFTMarketplaceAddress = "0xFbf4B3E81803352f83019d05b8A30b83924500A2";

const Listing = () => {
    const [activeListings, setActiveListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [account, setAccount] = useState("");

    const connectMetaMask = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
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

    const fetchActiveListings = async () => {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const NFTMarketplace = new ethers.Contract(NFTMarketplaceAddress, abi.abi, signer);
            
            try {
                const listings = await NFTMarketplace.fetchActiveListings();
                console.log("Fetched Listings:", listings);
                
                const formattedListings = listings.map((listing, index) => ({
                    listingId: index+1,    /// make sure the transaction id and index is same : wasted time debugging this
                    
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

    const buyNFT = async (listingId, listingPrice) => {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const NFTMarketplace = new ethers.Contract(NFTMarketplaceAddress, abi.abi, signer);
    
            try {
                const priceInWei = ethers.utils.parseEther(listingPrice);
                const gasLimit = ethers.utils.hexlify(300000); // Increased gas limit
    
                const tx = await NFTMarketplace.buyItem(listingId, { 
                    value: priceInWei, 
                    gasLimit 
                });
                await tx.wait();
                
                console.log(`NFT with Listing ID: ${listingId} purchased successfully!`);
                fetchActiveListings(); 
                setErrorMessage(""); 
            } catch (error) {
                console.error("Error buying NFT:", error);
                let errorMessage = "Failed to purchase NFT. Please try again.";
                
                // More detailed error handling
                if (error.code === "CALL_EXCEPTION") {
                    if (error.error && error.error.data && error.error.data.message) {
                        errorMessage = `Transaction failed: ${error.error.data.message}`;
                    } else {
                        errorMessage = "Transaction failed: Check contract conditions.";
                    }
                }
                
                setErrorMessage(errorMessage);
                setOpenSnackbar(true);
            }
        } else {
            alert("MetaMask is not installed. Please install it to use this app.");
        }
    };
    
    useEffect(() => {
        connectMetaMask().then(fetchActiveListings);
    }, []);

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
                <CircularProgress /> 
            ) : (
                <Grid container spacing={2}>
                    {activeListings.map((listing) => (
                        <Grid item xs={12} sm={6} md={4} key={listing.listingId}>
                            <Card>
                                <CardContent>
                                    <img
                                        alt="NFT Image"
                                        style={{ width: '100%', height: 'auto', marginBottom: '16px' }} 
                                    />
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
