import React, { createContext, useState } from 'react'

export const CartInfoContext = createContext()

// all info relating to the cart
export const CartInfoProvider = (props) => {

    const cartOrdersDefaultValue = {
        orders: []
    }
    const [cartOrders, setCartOrders] = useState(cartOrdersDefaultValue);

    return <CartInfoContext.Provider value={{
        _cartOrders: [cartOrders, setCartOrders],
    }}>
        {props.children}
    </CartInfoContext.Provider>
}
