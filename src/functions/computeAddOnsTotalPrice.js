// use this fn in DisplayOrderPriceSum.js, MeatItemModal.js, Cart.js

const computeAddOnsTotalPrice = (order, restaurant, newQuantity) => {
    let addOnsTotalPrice = 0;
    addOnsTotalPrice = order.addOns.reduce((addOnsTotalPrice_, addOnId) => {
        const addOn = restaurant.add_ons.find((addOn) => addOn.id === addOnId);
        if (newQuantity) {
            return addOnsTotalPrice_ + (addOn.price * newQuantity)
        } else {
            return addOnsTotalPrice_ + (addOn.price * order.quantity);
        }
    }, 0);

    return addOnsTotalPrice;
};

export default computeAddOnsTotalPrice;