import React, { useEffect } from 'react'

const DisplayAddOnName = ({ cartOrder, restaurantInfo }) => {
    const addOnsInfo = restaurantInfo.add_ons.filter(addOn => cartOrder.addOns.includes(addOn.id));
    const names = addOnsInfo.map((addOn) => <p>+{addOn.name}</p>)

    return <>{names}</>
}

export default DisplayAddOnName
