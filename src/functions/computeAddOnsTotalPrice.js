// use this fn in DisplayOrderPriceSum.js, MeatItemModal.js, Cart.js

const computeAddOnsTotalPrice = (order, restaurant, newOrderQuantity) => {
    let addOnsTotalPrice = 0;
    addOnsTotalPrice = order.addOns.reduce((addOnsTotalPrice_, addOnId) => {
        const addOn = restaurant.add_ons.find((addOn) => addOn.id === addOnId);
        if (newOrderQuantity) {
            // the num value stored in changedOrderQuantity can be changeed constantly
            return addOnsTotalPrice_ + (addOn.price * newOrderQuantity)
        } else {
            // order.quantity will be a fixed num value
            return addOnsTotalPrice_ + (addOn.price * order.quantity);
        }
    }, 0);

    return addOnsTotalPrice;
};

export default computeAddOnsTotalPrice;