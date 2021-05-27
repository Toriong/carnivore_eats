import React, { useState, useEffect, useContext } from 'react';
import { CartInfoContext } from '../providers/CartInfoProvider';
import { FaAngleUp } from 'react-icons/fa';
import meatShops from '../data/Meat-Shops.json';
import '../css/meatItemModal.css'

const MeatItemModal = ({ meatItemInfo, restaurantName, setIsMeatItemModalOpen, orderFromCart, isMeatModalOpenWithCartInfo, isCartButtonsOnModal, setIsCartOpen }) => {
    const { _computeConfirmedAddOns, _confirmedOrdersInfo } = useContext(CartInfoContext);




    // will store an array of the orders that will presented in the cart
    const [confirmedOrdersInfo, setConfirmedOrdersInfo] = _confirmedOrdersInfo;

    const [mainMeatCount, setMainMeatCount] = useState(1);
    const [orderTotal, setOrderTotal] = useState(0);
    const [isAddOnMenuOpen, setIsAddOnMenuOpen] = useState(false);
    const [isMinusButtonDisabled, setIsMinusButtonDisabled] = useState(false);


    // decreases the quantity count of the order
    const decreaseCount = () => {
        setMainMeatCount(mainMeatCount - 1);
    }

    // increases the quantity count of the order
    const increaseCount = () => {
        setMainMeatCount(mainMeatCount + 1)
    }

    // will remove the selected cart order from the cart 
    const removeOrder = () => {
        setConfirmedOrdersInfo(confirmedOrdersInfo.filter((order) => order.orderId !== orderFromCart.orderId));
        setIsCartOpen(false);
        setIsMeatItemModalOpen(false);
    }

    // will respond to the user pressing the update button
    // will change the quantity of the order
    const updateOrder = () => {
        setConfirmedOrdersInfo(confirmedOrdersInfo.map((order) => {
            if (order.orderId === orderFromCart.orderId) {
                return {
                    ...order,
                    quantity: mainMeatCount
                }
            }
            return order;
        }))
        // will close the meat modal 
        setIsMeatItemModalOpen(false);
        console.log("updateOrder was executed");
    }

    const restaurantInfo = meatShops.find((restaurant) => restaurant.name === confirmedOrdersInfo[0].restaurant);

    // presents the meat item modal with the info of the selected order from the cart
    useEffect(() => {
        if (isMeatModalOpenWithCartInfo) {
            // find the sum of the add-ons
            // get the price of the add-ons by getting the ids from the confirmedOrdersInfo and comparing their ids with the ids of the add-ons in the array that has all of the add-ons info in confirmedOrdersInfo
            let addOnsPriceList = [];
            if (orderFromCart.addOns) {
                orderFromCart.addOns.forEach((addOnId) => {
                    restaurantInfo.add_ons.forEach((addOn) => {
                        if (addOnId === addOn.id) {
                            addOnsPriceList.push(addOn.price);
                        }
                    })
                })
            }
            let addOnsSum = addOnsPriceList.length !== null ? addOnsPriceList.reduce((numA, numB) => numA + numB) : 0;
            setMainMeatCount(orderFromCart.quantity);
            setOrderTotal((orderFromCart.quantity * (meatItemInfo.price + addOnsSum)));
        }
    }, []);


    // will update the 'orderTotal' (the total price of the selected order) everytime the quantity of the order (mainMeatCount) changes 
    useEffect(() => {
        setOrderTotal((mainMeatCount * meatItemInfo.price));
    }, [mainMeatCount])

    // checks if the count is at one. If it is, then disable the minus button
    useEffect(() => {
        if (mainMeatCount === 1) {
            setIsMinusButtonDisabled(true);
            console.log("minus button disabled")
        } else if (mainMeatCount !== 1) {
            setIsMinusButtonDisabled(false);
            console.log("minus button enabled")
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
            <h2>Add-On:</h2>
            <div className="arrow-container">
                <i>
                    <FaAngleUp />
                </i>
            </div>
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
                    /* will have the 'Add to order' button on the modal only if the 'isCartButtonsOnModal' has a true boolean*/
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
