// use this fn in DisplayOrderPriceSum.js, MeatItemModal.js, Cart.js

const computeAddOnsTotalPrice = (order, restaurant, newOrderQuantity) => {
    let addOnsTotalPrice = 0;
    addOnsTotalPrice = order.addOns.reduce((addOnsPriceAccumulator, addOnId) => {
        const addOn = restaurant.add_ons.find((addOn) => addOn.id === addOnId);
        if (newOrderQuantity) {
            return addOnsPriceAccumulator + (addOn.price * newOrderQuantity)
        } else {
            return addOnsPriceAccumulator + (addOn.price * order.quantity);
        }
    }, 0);

    return addOnsTotalPrice;
};

export default computeAddOnsTotalPrice;