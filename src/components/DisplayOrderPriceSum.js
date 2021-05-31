import React from 'react'



// this will display the total sum of each order in the cart
const DisplayOrderPriceSum = ({ cartOrder, restaurantInfo }) => {
    const orderPrices = [];
    const addOnPrices = [];
    let meatItemPriceSum;

    // compute the product between the meat item and the quantity of the order
    // will find the price of meat item in 'restaurantInfo' and times it by the quantity of the order
    restaurantInfo.main_meats.forEach((meat) => {
        if (meat.id === cartOrder.meatItemId) {
            meatItemPriceSum = (cartOrder.quantity * meat.price);
            orderPrices.push(meatItemPriceSum);
        };
    });

    // will first check if there are any add-ons in the order
    // if there are, then get their prices in 'restaurantInfo' and push them into 'addOnPriceList'
    cartOrder.addOns && cartOrder.addOns.forEach((addOnId) => {
        restaurantInfo.add_ons.forEach((addOn) => {
            if (addOn.id === addOnId) {
                addOnPrices.push(addOn.price);
            }
        })
    });

    // store the sum of the addOns here
    // will check first if there are any add-ons presents in the order
    const areAddOnsPricesPresent = addOnPrices.length !== 0;
    const addOnsSum = areAddOnsPricesPresent && addOnPrices.reduce((numA, numB) => numA + numB);

    areAddOnsPricesPresent && orderPrices.push(addOnsSum * cartOrder.quantity);

    // will store the total price of each order in confirmedOrdersInfo
    const totalOrderPrice = orderPrices.reduce((numA, numB) => numA + numB).toFixed(2);

    return <div>
        <p>${totalOrderPrice}</p>
    </div>
};

export default DisplayOrderPriceSum;
