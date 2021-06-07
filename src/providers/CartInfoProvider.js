import React, { createContext, useState } from 'react'

export const CartInfoContext = createContext()
// all info relating to the cart
// all of this values will run on mount
export const CartInfoProvider = (props) => {


    const [cartOrdersInfo, setCartOrdersInfo] = useState([]);
    // this boolean will be set to true in the navbar component, when the SelectedMeatItemViewerToOrderModal component is invoked, and, as a result of the true boolean, it will compute the price of the add-ons that the user selected in their order in the cart within a useEffect
    // use 'computeConfirmedAddOns' in the AddOn component
    const [computeConfirmedAddOns, setComputeConfirmedAddOns] = useState(false);
    // the updateCartInfo state value must be accessible in multiple components (such as the meat item modal component) in order to update the cart info
    const [updateCartInfo, setUpdateCartInfo] = useState(false);

    return <CartInfoContext.Provider value={{
        _computeConfirmedAddOns: [computeConfirmedAddOns, setComputeConfirmedAddOns],
        _cartOrdersInfo: [cartOrdersInfo, setCartOrdersInfo],
        _updateCartInfo: [updateCartInfo, setUpdateCartInfo],
    }}>
        {props.children}
    </CartInfoContext.Provider>
}
