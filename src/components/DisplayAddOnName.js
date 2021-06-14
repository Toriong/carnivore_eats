import React from 'react'

const DisplayAddOnName = ({ cartOrder, restaurant }) => {
    const addOns = restaurant.add_ons.filter(addOn => cartOrder.addOns.includes(addOn.id));
    const names = addOns.map((addOn) => <p>+{addOn.name}</p>)

    return <>{names}</>
}

export default DisplayAddOnName
