import React from 'react'

// will display the total price of the addOns for an order that has addOns in the cart modal
const DisplayAddOnProduct = ({ order, restaurantInfo }) => {
    const addOnPrices = [];
    // will get the object that stores all of the info for the addOns and will get the price and push it into the 'AddOnPrices'
    order.addOns.map((addOnId) => restaurantInfo.add_ons.map((addOn) => addOn.id === addOnId && addOnPrices.push(addOn.price)));


    const addOnsSum = addOnPrices.reduce((numA, numB) => numA + numB);
    const addOnProduct = (addOnsSum * order.quantity).toFixed(2)
    return <p>${addOnProduct}</p>
};

export default DisplayAddOnProduct;
