// use this fn in DisplayOrderPriceSum.js, MeatItemModal.js, Cart.js

const getAddOnsInfo = (order, restaurant, newQuantity) => {
    let addOns = {
        totalPrice: 0,
        names: []
    };

    addOns.totalPrice = order.addOns.reduce((addOnsTotalPrice_, addOnId) => {
        let addOn = restaurant.add_ons.find((addOn) => addOn.id === addOnId);

        addOns.names = [...addOns.names, addOn.name]

        if (newQuantity) {
            return addOnsTotalPrice_ + (addOn.price * newQuantity)
        } else {
            return addOnsTotalPrice_ + (addOn.price * order.quantity);
        }
    }, 0);



    return addOns;
};

export default getAddOnsInfo;