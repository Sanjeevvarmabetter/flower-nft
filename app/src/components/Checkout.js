

import React, { useEffect,useState } from "react";
import "../App.css";
const Checkout = ({setIsCheckedOut}) => {
    const [timeRemaining,settimeRemaining] = useState(3);

    useEffect(() => {
            const timer = setInterval(()=>{
                settimeRemaining((prev)=> prev -1);
            },1000);

            const redirectTimer = setTimeout(() => {
                setIsCheckedOut(false);
            }, 3000);
            return () => {
                clearInterval(timer);
                clearTimeout(redirectTimer);
            };
        },[setIsCheckedOut]);

        

    return (
        <div className="checkout">
            <h2>Thank You for Your Purchase!</h2>
            <p>Your order has been placed successfully.</p>
            <p>redirecting in {timeRemaining} seconds ... </p>
        </div>
    );
};

export default Checkout;
