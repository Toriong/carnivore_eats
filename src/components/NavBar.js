import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Cart from './Cart';
import '../css/navBar.css';
import '../css/cart.css';





const NavBar = () => {
    const history = useHistory();
    const goToHomePage = () => {
        history.push("/");
    }


    return <div className="unfixed-wrapper">
        <div className="navbar">
            <div className="hamburger-menu-container">
                <div className="hamburger-menu-icon">
                    <div id="hamburger-line-1" className="hamburger-line"></div>
                    <div id="hamburger-line-2" className="hamburger-line"></div>
                    <div id="hamburger-line-3" className="hamburger-line"></div>
                </div>
            </div>
            <div className="logo-container" onClick={goToHomePage}>
                <div id="quick-text">
                    Quick
                    </div>
                <div id="carnivore-text">
                    Carnivore
                    </div>
                <div id="eats-text">
                    Eats
                    </div>
            </div>
            <div className="cart-container">
                <Cart />
            </div>
        </div>
    </div>
}

export default NavBar;