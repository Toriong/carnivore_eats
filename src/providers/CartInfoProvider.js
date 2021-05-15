import React, { createContext, useState } from 'react'

export const CartInfoContext = createContext()
// all info relating to the cart
// all of this values will run on mount
export const CartInfoProvider = (props) => {
    const confirmedOrdersDefaultVal = [{
        id: null,
        restaurantName: null,
        infoOfMainMeatItem: null,
        confirmedAddOnsToOrder: null,
        allAddOns: null,
        confirmedOrderQuantity: 0,
        totalMeatPrice: 0,
        totalConfirmedAddOnPrice: 0,
        totalOrderPrice: 0
    }];

    const [confirmedOrdersInfo, setConfirmedOrdersInfo] = useState(confirmedOrdersDefaultVal);
    // this boolean will be set to true in the navbar component, when the SelectedMeatItemViewerToOrderModal component is invoked, and, as a result of the true boolean, it will compute the price of the add-ons that the user selected in their order in the cart within a useEffect
    // use 'computeConfirmedAddOns' in the AddOn component
    const [computeConfirmedAddOns, setComputeConfirmedAddOns] = useState(false);
    // the updateCartInfo state value must be accessible in multiple components (such as the meat item modal component) in order to update the cart info
    const [updateCartInfo, setUpdateCartInfo] = useState(false);
    // all of the add-ons that might be in the cart order
    const [selectedAddOns, setSelectedAddOns] = useState([{ name: null, price: 0 }]);


    return <CartInfoContext.Provider value={{
        _computeConfirmedAddOns: [computeConfirmedAddOns, setComputeConfirmedAddOns],
        _confirmedOrdersInfo: [confirmedOrdersInfo, setConfirmedOrdersInfo],
        _updateCartInfo: [updateCartInfo, setUpdateCartInfo],
        _selectedAddOns: [selectedAddOns, setSelectedAddOns],
    }}>
        {props.children}
    </CartInfoContext.Provider>
}
