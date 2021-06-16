import React, { useEffect } from 'react'

const AddOnNames = ({ cartOrder, restaurant }) => {
    const addOns = cartOrder.addOns.map((addOnId) => restaurant.add_ons.find((addOn) => addOn.id === addOnId));

    return addOns.map((addOn) => <p>+{addOn.name}</p>)
}

export default AddOnNames
