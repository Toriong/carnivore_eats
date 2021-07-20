// use this fn in MeatItemModal.js and Cart.js

const getAddOnsInfo = (order, restaurant, newQuantity) => {
    let addOnNames = []

    const addOnsTotalPrice = order.addOns.reduce((addOnsTotalPrice, addOnId) => {
        let addOn = restaurant.add_ons.find(addOn => addOn.id === addOnId);

        addOnNames = [...addOnNames, addOn.name];

        return addOnsTotalPrice + (addOn.price * (newQuantity ?? order.quantity));
    }, 0);

    return {
        _addOnNames: addOnNames,
        _addOnsTotalPrice: addOnsTotalPrice
    };
};

export default getAddOnsInfo;