import React, { useState, useEffect, useContext } from 'react';
import meatShops from '../data/Meat-Shops.json';
import AddOnItem from '../components/AddOnItem';
import { CartInfoContext } from '../providers/CartInfoProvider';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import '../css/meatItemModal.css'

// NOTES
// may not need orderFromCart_ 

// this is where all of the computations/editing for an order will occur
const MeatItemModal = ({ meatItemInfo, restaurantName, setIsMeatItemModalOpen, orderFromCart, isMeatModalOpenWithCartInfo, isCartButtonsOnModal, setIsCartOpen }) => {
    const { _confirmedOrdersInfo } = useContext(CartInfoContext);

    // will store an array of the orders that will presented in the cart
    const [confirmedOrdersInfo, setConfirmedOrdersInfo] = _confirmedOrdersInfo;

    // will keep track the of the quantity of the order
    const [orderQuantityCount, setOrderQuantityCount] = useState(1);
    const [orderPriceTotal, setOrderPriceTotal] = useState(0);
    const [isAddOnMenuOpen, setIsAddOnMenuOpen] = useState(false);
    const [isMinusButtonDisabled, setIsMinusButtonDisabled] = useState(false);

    // will store the selected order from the cart to add add-ons to it or to remove it
    const [orderFromCart_, setOrderFromCart_] = useState(orderFromCart);

    // will store all of the info pertaining to the restaurant of the order
    const restaurantInfo = meatShops.find((restaurant) => restaurant.name === restaurantName);

    const addOnMenuToggle = () => {
        setIsAddOnMenuOpen(!isAddOnMenuOpen);
    };

    const decreaseCount = () => {
        setOrderQuantityCount(orderQuantityCount - 1);
    };

    const increaseCount = () => {
        setOrderQuantityCount(orderQuantityCount + 1);
    };

    // will remove the selected cart order from the cart 
    const removeOrder = () => {
        setConfirmedOrdersInfo(confirmedOrdersInfo.filter((order) => order.orderId !== orderFromCart.orderId));
        setIsCartOpen(false);
        setIsMeatItemModalOpen(false);
    };

    // will respond to the user pressing the update button
    const updateOrder = () => {
        // will check if there are any add-ons in the order
        if (orderFromCart_.addOns) {
            // will check if the array that is in the addOns key of the order is empty
            const noAddOnsArePresent = orderFromCart_.addOns.length === 0;
            if (noAddOnsArePresent) {
                setOrderFromCart_(delete orderFromCart_.addOns);
            };
        };
        // will update the selected order by via its ID 
        const updatedOrder = confirmedOrdersInfo.map((order) => {
            if (order.orderId === orderFromCart_.orderId) {
                return {
                    ...orderFromCart_,
                    quantity: orderQuantityCount
                }
            }
            return order;
        });

        setConfirmedOrdersInfo(updatedOrder);
        // will close the meat modal 
        setIsMeatItemModalOpen(false);
        console.log("updateOrder was executed");
    }

    // will compute the total price of the cart when the following occurs:
    // an add-on was added to the cart
    // an add-on was deleted from the cart
    // when the quantity buttons are pressed 
    useEffect(() => {
        let addOnsPrices = [];
        let addOnsSum;
        // will check if there are any add-ons in the selected cart order
        // if there are add-ons, then get the price of the addo-ons in the add-on list in the ;'restaurantInfo' and store them into the addOnsPricesList
        orderFromCart_.addOns && orderFromCart_.addOns.forEach((addOnId) => {
            restaurantInfo.add_ons.forEach((addOn) => {
                addOn.id === addOnId && addOnsPrices.push(addOn.price);
            })
        });

        const addOnsPricesArePresent = addOnsPrices.length !== 0;
        // store the sum of the 'addOnsPriceList'
        addOnsSum = addOnsPricesArePresent && addOnsPrices.reduce((numA, numB) => numA + numB);
        // will compute the total price of the order
        setOrderPriceTotal(((orderQuantityCount * meatItemInfo.price) + (addOnsSum * orderQuantityCount)).toFixed(2));
    }, [orderFromCart_.addOns, orderQuantityCount, restaurantInfo.add_ons, meatItemInfo.price]);


    useEffect(() => {
        if (orderQuantityCount === 1) {
            setIsMinusButtonDisabled(true);
        } else if (orderQuantityCount !== 1) {
            setIsMinusButtonDisabled(false);
        }
    }, [orderQuantityCount]);

    // computes the total price of the cart order with or without add-ons only on the initial render of the component
    useEffect(() => {
        let totalMeatPrice;
        let addOnsPrices = [];
        let orderPriceSum;
        // will check if the cart order was opened in a meat item modal
        if (isMeatModalOpenWithCartInfo) {
            // will check if there are any addOns in the order
            if (orderFromCart_.addOns) {
                orderFromCart_.addOns.forEach((addOnId) => {
                    restaurantInfo.add_ons.forEach((addOn) => {
                        if (addOnId === addOn.id) {
                            addOnsPrices.push(addOn.price * orderFromCart_.quantity);
                        }
                    });
                });
            };
            // will compute the sum of the addOns
            const addOnsPricesArePresent = addOnsPrices.length !== 0;
            let addOnsSum = addOnsPricesArePresent && addOnsPrices.reduce((numA, numB) => numA + numB);
            totalMeatPrice = meatItemInfo.price * orderFromCart_.quantity
            setOrderQuantityCount(orderFromCart_.quantity);
            orderPriceSum = totalMeatPrice + addOnsSum;
            setOrderPriceTotal(orderPriceSum);
        }
    }, []);

    // will open the add-on menu, when there are add-ons present in the order on the initial render of the component
    useEffect(() => {
        orderFromCart.addOns && setIsAddOnMenuOpen(true);
    }, []);

    return <section className="selected-food-modal">
        <article className="picture-container">
            <img src={meatItemInfo.image} alt={meatItemInfo.alt} />
        </article>
        <article className="food-title-container">
            <div id="food-item-name">
                <h1>{meatItemInfo.name}</h1>
                <h2>{restaurantName}</h2>
            </div>
        </article>
        <article className="add-ons-text-container">
            {isAddOnMenuOpen ?
                <>
                    <h2>Add-On:</h2>
                    <div className="arrow-container" onClick={addOnMenuToggle}>
                        <i>
                            <FaAngleDown />
                        </i>
                    </div>
                    <div className="add-ons-list-container">
                        {restaurantInfo.add_ons.map((addOnItem) => {
                            return <AddOnItem
                                addOnItem={addOnItem}
                                orderFromCart={orderFromCart_}
                                setOrderFromCart={setOrderFromCart_}
                            />
                        })}
                    </div>
                </>
                :
                <>
                    <h2>Add-On:</h2>
                    <div className="arrow-container" onClick={addOnMenuToggle}>
                        <i>
                            <FaAngleUp />
                        </i>
                    </div>
                </>
            }
        </article>
        {/* if a true boolean was passed in for 'isCartButtonsOnModal' then show the 'Remove item' button */}
        {isCartButtonsOnModal &&
            <div className="remove-item-container" onClick={removeOrder}>
                <h4>
                    Remove item
                </h4>
            </div>}
        <article className="quantity-and-add-to-cart-container">
            <article className="add-to-cart-button-quantity-button-container">
                {/* will  disabled the minus button only if the count is at one*/}
                <div className="quantity-button">
                    {isMinusButtonDisabled ?
                        <div className="minus-sign">
                            -
                        </div>
                        :
                        <div className="minus-sign" onClick={decreaseCount}>
                            -
                        </div>
                    }
                    <div className="count">{orderQuantityCount}</div>
                    <div className="plus-sign" onClick={increaseCount}>
                        +
                    </div>
                </div>
                {/* will have the update order button on the UI only if a true boolean was passed in for the isCartButtonsOnModal prop */}
                {isCartButtonsOnModal ?
                    <div className="update-order-button" onClick={updateOrder}>
                        <div>
                            Update
                        </div>
                        <div>
                            Order
                        </div>
                        {orderPriceTotal > meatItemInfo.price ?
                            <div>
                                ${orderPriceTotal}
                            </div>
                            :
                            <div>
                                ${meatItemInfo.price}
                            </div>
                        }
                    </div>
                    :
                    <div className="add-to-cart-button">
                        <div>
                            Add
                        </div>
                        <div className="count">{orderQuantityCount}</div>
                        <div>
                            to order
                        </div>
                        {orderPriceTotal > meatItemInfo.price ?
                            <div>
                                {orderPriceTotal}
                            </div>
                            :
                            <div>
                                {meatItemInfo.price}
                            </div>
                        }
                    </div>
                }
            </article>
        </article>
    </section>
}

export default MeatItemModal
