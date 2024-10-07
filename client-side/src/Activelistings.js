import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from "./abi.json";
import './ActiveListings.css'; 

const ActiveListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState("None");

    const contractAddress = "0xFbf4B3E81803352f83019d05b8A30b83924500A2"; 

    // Define styles
    const styles = {
        listItem: {
            backgroundColor: '#FFFFFF',
            border: '1px solid #DDD',
            borderRadius: '5px',
            marginBottom: '10px',
            padding: '10px'
        }
    };

    useEffect(() => {
        const fetchActiveListings = async () => {
            try {
                if (window.ethereum) {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();

                    // Request account access
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    setAccount(accounts[0]);
                    console.log("Connected Account:", accounts[0]);

                    // Create contract instance
                    const nftMarketplaceContract = new ethers.Contract(contractAddress, abi.abi, signer);
                    console.log("Contract Instance:", nftMarketplaceContract);

                    // Fetch active listings
                    const activeListings = await nftMarketplaceContract.fetchActiveListings();
                    console.log("Fetched Active Listings:", activeListings);

                    if (activeListings.length === 0) {
                        console.log("No active listings found.");
                    }

                    // Format listings
                    const formattedListings = activeListings.map((listing) => ({
                        tokenId: listing.tokenId.toString(),
                        price: ethers.utils.formatEther(listing.price),
                        owner: listing.owner
                    }));

                    console.log("Formatted Listings:", formattedListings);

                    setListings(formattedListings);
                } else {
                    alert('Please install MetaMask!');
                }
            } catch (error) {
                console.error("Error fetching listings: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActiveListings();
    }, []);

    if (loading) {
        return <div>Loading active listings...</div>;
    }

    return (
        <div style={{ backgroundColor: "#EFEFEF", padding: "20px" }}>
            <h1>Active NFT Listings</h1>
            <p className="text-muted lead">
                <small>Connected Account: {account}</small>
            </p>
            {listings.length > 0 ? (
                <ul>
                    {listings.map((listing, index) => (
                        <li key={index} style={styles.listItem}>
                            <p><strong>Token ID:</strong> {listing.tokenId}</p>
                            <p><strong>Price:</strong> {listing.price} ETH</p>
                            <p><strong>Owner:</strong> {listing.owner}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No active listings found.</p>
            )}
        </div>
    );
};

export default ActiveListings;
