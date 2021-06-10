import React, { useEffect } from 'react';
import computeAddOnsTotalPrice from '../functions/computeAddOnsTotalPrice';


const DisplayOrderPriceSum = ({ cartOrder, restaurant }) => {
    const meatItem = restaurant.main_meats.find(meat => meat.id === cartOrder.meatItemId);
    const totalMeatPriceOfCartOrder = meatItem.price * cartOrder.quantity;
    let totalAddOnPriceOfCartOrder = 0;

    if (cartOrder.addOns) {
        totalAddOnPriceOfCartOrder = computeAddOnsTotalPrice(cartOrder, restaurant);
    }

    const cartTotalPrice = (totalAddOnPriceOfCartOrder + totalMeatPriceOfCartOrder).toFixed(2);

    return <div>
        <p>${cartTotalPrice}</p>
    </div>
};

export default DisplayOrderPriceSum;






