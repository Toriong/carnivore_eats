import React, { useState, useEffect } from 'react';
import Cart from './Cart';





const NavBar = () => {

    useEffect(() => {
        console.log("hello world");
        console.log("testing")
    })
    return <div className="unfixed-wrapper">
        <div className="navbar">
            <div className="cart-container">
                <Cart />
            </div>
        </div>
    </div>
}

export default NavBar;