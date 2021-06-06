import React, { useEffect } from 'react';
import getPriceOfAddOn from '../functions/getPriceOfAddOn';




// this will display the total sum of each order in the cart
// cartOrder: each order in the user's cart
// restaurantInfo: all of the info pertaining to the restaurant of the user's order
const DisplayOrderPriceSum = ({ cartOrder, restaurantInfo }) => {

    const meatItemInfo = restaurantInfo.main_meats.find(meatItem => meatItem.id === cartOrder.meatItemId);

    const totalMeatPriceOfOrder = meatItemInfo.price * cartOrder.quantity;

    // addOn prices will hold all of the prices of the add-ons that the user seleected
    // have to map through the restaurant.add_ons, becasue the user might have selected multiple add-ons in their order
    // if there exist addOns in the user's order, then get their prices. if there are no add-ons, then return a zero to avoid returning a undefined value
    // the zero is used as a placeholder when the computations occurs for the addOnsSum var when the user has no add-ons in their order
    const proxyForAddOnComputations = 0
    const addOnPrices = restaurantInfo.add_ons.map((addOn) => cartOrder.addOns ? getPriceOfAddOn(addOn, cartOrder) : proxyForAddOnComputations);

    // have to make a conditional if there weren't any add-ons 
    const addOnsSum = addOnPrices.reduce((addOnA, addOnB) => addOnA + addOnB);

    // stores the total price of the add-ons for the user's order
    const totalAddOnsPriceOfOrder = (addOnsSum * cartOrder.quantity);

    const cartTotalPrice = (totalMeatPriceOfOrder + totalAddOnsPriceOfOrder).toFixed(2);

    return <div>
        <p>${cartTotalPrice}</p>
    </div>
};

export default DisplayOrderPriceSum;






