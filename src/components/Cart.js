import React, { useState, useEffect, useContext, useRef } from 'react'
import { CartInfoContext } from "../providers/CartInfoProvider";
import { Link } from 'react-router-dom';

const Cart = () => {
    const { _confirmedOrdersInfo, _updateCartInfo } = useContext(CartInfoContext);

    const [confirmedOrdersInfo, setConfirmedOrdersInfo] = _confirmedOrdersInfo;
    const [updateCartInfo, setUpdateCartInfo] = _updateCartInfo


    const cartQuantityTotal = confirmedOrdersInfo.map((order) => order.confirmedOrderQuantity).reduce((numA, numB) => numA + numB);
    const cartPriceTotal = confirmedOrdersInfo.map((order) => parseFloat(order.totalOrderPrice)).reduce((numA, numB) => numA + numB);


    useEffect(() => {
        const savedOrders = localStorage.getItem("confirmed orders");
        const parsedSavedOrders = JSON.parse(savedOrders);
        if (parsedSavedOrders) {
            setConfirmedOrdersInfo(parsedSavedOrders);
        };
        console.log("hello");

    }, []);

    return <>

    </>
}


export default Cart
