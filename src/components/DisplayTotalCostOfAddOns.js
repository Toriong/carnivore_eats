import React, { useEffect } from 'react'
import getPriceOfAddOn from '../functions/getPriceOfAddOn'

// will display the total price of the addOns for an order that has addOns in the cart modal
const DisplayTotalCostOfAddOns = ({ cartOrder, restaurantInfo }) => {

    // an array of all of the prices of the add-ons that the user selected for each order
    const addOnPrices = restaurantInfo.add_ons.map((addOn) => getPriceOfAddOn(addOn, cartOrder));

    const addOnsSum = addOnPrices.reduce((numA, numB) => numA + numB);

    // will store the total add-on cost for the user order
    const totalCostOfAddOns = (addOnsSum * cartOrder.quantity).toFixed(2)

    return <p>${totalCostOfAddOns}</p>
};

export default DisplayTotalCostOfAddOns;
