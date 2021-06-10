import React, { createContext, useState } from 'react'

export const CartInfoContext = createContext()

// all info relating to the cart
export const CartInfoProvider = (props) => {

    const cartOrdersDefaultValue = {
        orders: []
    }
    const [cartOrdersInfo, setCartOrdersInfo] = useState(cartOrdersDefaultValue);
    const [updateCartInfo, setUpdateCartInfo] = useState(false);

    return <CartInfoContext.Provider value={{
        _cartOrdersInfo: [cartOrdersInfo, setCartOrdersInfo],
        _updateCartInfo: [updateCartInfo, setUpdateCartInfo],
    }}>
        {props.children}
    </CartInfoContext.Provider>
}
