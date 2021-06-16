import React, { useEffect } from 'react';
import computeAddOnsTotalPrice from '../functions/computeAddOnsTotalPrice';


const OrderPriceSum = ({ cartOrder, restaurant }) => {
    const meatItem = restaurant.main_meats.find(meat => meat.id === cartOrder.meatItemId);
    const totalMeatItemPrice = meatItem.price * cartOrder.quantity;
    let totalAddOnPrice = 0;

    if (cartOrder.addOns) {
        totalAddOnPrice = computeAddOnsTotalPrice(cartOrder, restaurant);
    }

    const cartTotalPrice = (totalAddOnPrice + totalMeatItemPrice).toFixed(2);

    return <div>
        <p>${cartTotalPrice}</p>
    </div>
};

export default OrderPriceSum;






