// use this fn in DisplayOrderPriceSum.js, MeatItemModal.js, Cart.js


// will get the prices of the addOns that the user selected
// have the addOn prop be two possbilities: the the addOn itself or the list of addOns
const getPriceOfAddOn = (addOnInfo, orderInfo) => {
    // if there are no matches in the above forEach loop, hence 'priceOfAddOn' is undefined, then return a zero. The zero is a placeholder for the addOn computations
    let priceOfAddOn = 0;

    orderInfo.addOns.forEach((cartOrderAddOnsId) => {
        // if the id matchess, that means that is the add-on that is part of the user's order
        if (cartOrderAddOnsId === addOnInfo.id) {
            priceOfAddOn = addOnInfo.price;
        };
    });

    return priceOfAddOn;
};

export default getPriceOfAddOn;