import React, { useEffect } from 'react';
import getPriceOfAddOn from '../functions/getPriceOfAddOn';




// this will display the total sum of each individual order in the cart
// cartOrder: each order in the user's cart
// restaurantInfo: all of the info pertaining to the restaurant of the user's order
const DisplayOrderPriceSum = ({ cartOrder, restaurantInfo }) => {

    const meatItemInfo = restaurantInfo.main_meats.find(meatItem => meatItem.id === cartOrder.meatItemId);

    const totalMeatPriceOfCartOrder = meatItemInfo.price * cartOrder.quantity;


    // have to map through the restaurant.add_ons, becasue the user might have selected multiple add-ons in their order
    // if there exist addOns in the user's order, then get their prices. if there are no add-ons, then return a zero to avoid returning a undefined value
    // the zero is used as a placeholder when the computations occurs for the addOnsSum variable when the user has no add-ons in their order
    const proxyForAddOnComputations = 0
    // addOnPrices will hold all of the prices of the add-ons that the user selected from the cartOrder
    const addOnPrices = restaurantInfo.add_ons.map((addOn) => cartOrder.addOns ? getPriceOfAddOn(addOn, cartOrder) : proxyForAddOnComputations);

    // compute the price sum of all of the add-ons in the user's cart
    const addOnsPriceSum = addOnPrices.reduce((addOnA, addOnB) => addOnA + addOnB);

    // stores the total price of the add-ons for the user's order
    const totalAddOnsPriceOfCartOrder = (addOnsPriceSum * cartOrder.quantity);

    const cartTotalPrice = (totalMeatPriceOfCartOrder + totalAddOnsPriceOfCartOrder).toFixed(2);

    return <div>
        <p>${cartTotalPrice}</p>
    </div>
};

export default DisplayOrderPriceSum;






