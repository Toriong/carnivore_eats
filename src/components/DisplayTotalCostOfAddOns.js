import React, { useEffect } from 'react'
import computeAddOnsTotalPrice from '../functions/computeAddOnsTotalPrice';

const DisplayTotalCostOfAddOns = ({ cartOrder, restaurant }) => {

    const totalCostOfAddOns = computeAddOnsTotalPrice(cartOrder, restaurant)

    return <p>${totalCostOfAddOns.toFixed(2)}</p>
};

export default DisplayTotalCostOfAddOns;
