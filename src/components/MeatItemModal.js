import React, { useState, useEffect, useContext } from 'react';
import meatShops from '../data/Meat-Shops.json';
import AddOnItem from '../components/AddOnItem';
import { CartInfoContext } from '../providers/CartInfoProvider';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import '../css/meatItemModal.css'

// NOTES
// may not need orderFromCart_ 

const MeatItemModal = ({ meatItemInfo, restaurantName, setIsMeatItemModalOpen, orderFromCart, isMeatModalOpenWithCartInfo, isCartButtonsOnModal, setIsCartOpen }) => {
    const { _confirmedOrdersInfo } = useContext(CartInfoContext);



    // will store an array of the orders that will presented in the cart
    const [confirmedOrdersInfo, setConfirmedOrdersInfo] = _confirmedOrdersInfo;

    const [mainMeatCount, setMainMeatCount] = useState(1);
    const [orderTotal, setOrderTotal] = useState(0);
    const [isAddOnMenuOpen, setIsAddOnMenuOpen] = useState(false);
    const [isMinusButtonDisabled, setIsMinusButtonDisabled] = useState(false);
    // const [wasQuantityButtonPressed, setWasQuantityButtonPressed] = useState(false);
    // this is the function that will keep track of the changes when an add-on has been added or deleted
    const [orderFromCart_, setOrderFromCart_] = useState(orderFromCart);
    const restaurantInfo = meatShops.find((restaurant) => restaurant.name === confirmedOrdersInfo[0].restaurant);

    // when an add-on is added or deleted, have this useEffect run
    useEffect(() => {
        let addOnsPriceList = [];
        let addOnsSum;
        orderFromCart_.addOns !== undefined && orderFromCart_.addOns.forEach((addOnId) => {
            restaurantInfo.add_ons.forEach((addOn) => {
                addOn.id === addOnId && addOnsPriceList.push(addOn.price);
            })
        });
        addOnsSum = addOnsPriceList.length !== 0 ? addOnsPriceList.reduce((numA, numB) => numA + numB) : 0;
        setOrderTotal((mainMeatCount * meatItemInfo.price) + (addOnsSum * mainMeatCount));
        console.log('cart order udpated');
        console.log(orderFromCart_);
    }, [orderFromCart_.addOns]);


    const addOnMenuToggle = () => {
        setIsAddOnMenuOpen(!isAddOnMenuOpen);
    }

    // decreases the quantity count of the order
    const decreaseCount = () => {
        setMainMeatCount(mainMeatCount - 1);
    }

    // increases the quantity count of the order
    const increaseCount = () => {
        setMainMeatCount(mainMeatCount + 1);
    }

    // will update the total price of the order only when the quantity buttons are pressed
    useEffect(() => {
        let addOnsPriceList = [];
        let addOnsSum;
        orderFromCart_.addOns !== undefined && orderFromCart_.addOns.forEach((addOnId) => {
            restaurantInfo.add_ons.forEach((addOn) => {
                addOn.id === addOnId && addOnsPriceList.push(addOn.price);
            })
        });
        addOnsSum = addOnsPriceList.length !== 0 && addOnsPriceList.reduce((numA, numB) => numA + numB);
        setOrderTotal((mainMeatCount * meatItemInfo.price) + (addOnsSum * mainMeatCount));
    }, [mainMeatCount]);

    // will remove the selected cart order from the cart 
    const removeOrder = () => {
        setConfirmedOrdersInfo(confirmedOrdersInfo.filter((order) => order.orderId !== orderFromCart.orderId));
        setIsCartOpen(false);
        setIsMeatItemModalOpen(false);
    }

    // will respond to the user pressing the update button
    const updateOrder = () => {
        // check if there are any addOns, if there, check if it is empty so that you can delete it
        // have the updated order have the following changes: -the quantity of the order, and if there no add-ons, have the add-ons be deleted. 
        if (orderFromCart_.addOns) {
            if (orderFromCart_.addOns.length === 0) {
                setOrderFromCart_(delete orderFromCart_.addOns)
            }
        }
        const updatedOrder = confirmedOrdersInfo.map((order) => {
            if (order.orderId === orderFromCart_.orderId) {
                return {
                    ...orderFromCart_,
                    quantity: mainMeatCount
                }
            }
            return order;
        });

        setConfirmedOrdersInfo(updatedOrder);
        // will close the meat modal 
        setIsMeatItemModalOpen(false);
        console.log("updateOrder was executed");
    }

    // will open the add-on menu, when there are add-ons present in the order
    useEffect(() => {
        orderFromCart.addOns !== undefined && setIsAddOnMenuOpen(true);
    }, []);



    // computes the total price of the cart order with or without add-ons
    useEffect(() => {
        let totalMeatPrice;
        let addOnsPriceList = [];
        let orderSum;
        // will check if the a cart order was opened in a meat item modal
        if (isMeatModalOpenWithCartInfo) {
            // will check if there are any addOns in the order
            if (orderFromCart_.addOns !== undefined) {
                orderFromCart_.addOns.forEach((addOnId) => {
                    restaurantInfo.add_ons.forEach((addOn) => {
                        if (addOnId === addOn.id) {
                            addOnsPriceList.push(addOn.price * orderFromCart_.quantity);
                        }
                    });
                })
            }
            let addOnsSum = addOnsPriceList.length !== 0 ? addOnsPriceList.reduce((numA, numB) => numA + numB) : 0;
            totalMeatPrice = meatItemInfo.price * orderFromCart_.quantity
            setMainMeatCount(orderFromCart_.quantity);
            orderSum = totalMeatPrice + addOnsSum;
            setOrderTotal(orderSum);
        }
    }, []);





    // checks if the count is at one. If it is, then disable the minus button
    useEffect(() => {
        if (mainMeatCount === 1) {
            setIsMinusButtonDisabled(true);
        } else if (mainMeatCount !== 1) {
            setIsMinusButtonDisabled(false);
        }
    }, [mainMeatCount])



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
                                addOnItem={addOnItem} mainMeatCount={mainMeatCount} setOrderTotal={setOrderTotal} meatItemInfoPrice={meatItemInfo.price} orderFromCart={orderFromCart_} setOrderFromCart={setOrderFromCart_}
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
        {isCartButtonsOnModal && <div className="remove-item-container" onClick={removeOrder}>
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
                    <div className="count">{mainMeatCount}</div>
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
                        {orderTotal > meatItemInfo.price ?
                            <div>
                                {orderTotal.toFixed(2)}
                            </div>
                            :
                            <div>
                                {meatItemInfo.price.toFixed(2)}
                            </div>
                        }
                    </div>
                    :
                    <div className="add-to-cart-button">
                        <div>
                            Add
                        </div>
                        <div className="count">{mainMeatCount}</div>
                        <div>
                            to order
                        </div>
                        {orderTotal > meatItemInfo.price ?
                            <div>
                                {orderTotal.toFixed(2)}
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
