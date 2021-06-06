// use this fn in DisplayOrderPriceSum.js and MeatItemModal.js


// will get the prices of the addOns that the user selected
// have the addOn prop be two possbilities: the the addOn itself or the list of addOns
const getPriceOfAddOn = (addOn, order) => {
    // if there are no matches in the above forEach loop, hence 'priceOfAddOn' is undefined, then return a zero. The zero is a placeholder for the addOn computations
    let priceOfAddOn = 0;

    order.addOns.forEach((cartOrderAddOnsId) => {
        if (cartOrderAddOnsId === addOn.id) {
            priceOfAddOn = addOn.price;
        }
    });

    return priceOfAddOn;
};

export default getPriceOfAddOn;
