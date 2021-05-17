import React, { useState, useEffect, useContext } from 'react';
import { CartInfoContext } from '../providers/CartInfoProvider';
import { FaAngleUp } from 'react-icons/fa';
import '../css/meatItemModal.css'

const MeatItemModal = ({ meatItemInfo, restaurantName, setIsMeatItemModalOpen, orderFromCart, isMeatModalOpenWithCartInfo, isCartButtonsOnModal }) => {
    const { _computeConfirmedAddOns, _confirmedOrdersInfo, _updateCartInfo } = useContext(CartInfoContext);

    const [updateCartInfo, setUpdateCartInfo] = _updateCartInfo



    // context values to get the info of the meat item of the new restaurant to start a new cart


    // the conditional values that will determine what buttons (the update button and remove button) and values will be displayed on the DOM

    // the values that will be displayed on the cart UI
    const [computeConfirmedAddOns, setComputeConfirmedAddOns] = _computeConfirmedAddOns

    // will store an array of the orders that will presented in the cart
    const [confirmedOrdersInfo, setConfirmedOrdersInfo] = _confirmedOrdersInfo;

    const [mainMeatCount, setMainMeatCount] = useState(1);
    const [orderTotal, setOrderTotal] = useState(meatItemInfo.price);
    const [isAddOnMenuOpen, setIsAddOnMenuOpen] = useState(false);
    const [wasOrderButtonPressed, setWasOrderButtonPressed] = useState(false);
    const [isCartPriceAndQuantityNeededToBeUpdate, setIsCartPriceAndQuantityNeededToBeUpdate] = useState(false);
    const [saveOrdersIntoLocalStorage, setSaveOrdersIntoLocalStorage] = useState(false);
    const [isMinusButtonDisabled, setIsMinusButtonDisabled] = useState(false);



    const decreaseCount = () => {
        setMainMeatCount(mainMeatCount - 1);
    }

    const increaseCount = () => {
        setMainMeatCount(mainMeatCount + 1)
    }

    const removeOrder = () => {
        setConfirmedOrdersInfo(confirmedOrdersInfo.filter((order) => order.id !== orderFromCart.id));
        setIsCartPriceAndQuantityNeededToBeUpdate(true);
        setSaveOrdersIntoLocalStorage(true);
    }

    // will respond to the user pressing the update button
    const updateOrder = () => {
        setConfirmedOrdersInfo(confirmedOrdersInfo.map((order) => {
            if (order.id === orderFromCart.id) {
                return {
                    ...order,
                    confirmedOrderQuantity: mainMeatCount,
                    totalMeatPrice: (mainMeatCount * meatItemInfo.price),
                    totalOrderPrice: orderTotal

                }
            } else if (order.id !== orderFromCart.id) {
                return order;
            }
        }))
        setIsCartPriceAndQuantityNeededToBeUpdate(!isCartPriceAndQuantityNeededToBeUpdate);
        setSaveOrdersIntoLocalStorage(true);
        console.log("updateOrder was executed")
    }



    // presents the meat item modal with the info of the selected order from the cart
    useEffect(() => {
        if (isMeatModalOpenWithCartInfo) {
            setMainMeatCount(orderFromCart.confirmedOrderQuantity);
            setOrderTotal((orderFromCart.confirmedOrderQuantity * meatItemInfo.price));
        }
    }, [isMeatModalOpenWithCartInfo]);


    useEffect(() => {
        setOrderTotal((mainMeatCount * meatItemInfo.price));
    }, [mainMeatCount])

    useEffect(() => {
        if (mainMeatCount === 1) {
            setIsMinusButtonDisabled(true);
            console.log("minus button disabled")
        } else if (mainMeatCount !== 1) {
            setIsMinusButtonDisabled(false)
            console.log("minus button enabled")
        }
    }, [mainMeatCount])

    // save confirmedOrders into local storage
    useEffect(() => {
        if (saveOrdersIntoLocalStorage) {
            console.log(confirmedOrdersInfo)
            localStorage.setItem("confirmed orders", JSON.stringify(confirmedOrdersInfo));
            setSaveOrdersIntoLocalStorage(false);
            console.log('orders saved')
            setIsMeatItemModalOpen(false);
        }
    }, [saveOrdersIntoLocalStorage]);

    useEffect(() => {
        console.log(mainMeatCount)
    })

    return <div className="selected-food-modal">
        <div className="picture-container">
            <img src={meatItemInfo.image} alt={meatItemInfo.alt} />
        </div>
        <div className="food-title-container">
            <div id="food-item-name">
                <h1>{meatItemInfo.name}</h1>
                <h2>{restaurantName}</h2>
            </div>
        </div>
        <div className="add-ons-text-container">
            <h2>Add-On:</h2>
            <div className="arrow-container">
                <i>
                    <FaAngleUp />
                </i>
            </div>
        </div>

        {isCartButtonsOnModal && <div className="remove-item-container" onClick={removeOrder}>
            <h4>
                Remove item
            </h4>
        </div>}
        <div className="quantity-and-add-to-cart-container">
            <div className="add-to-cart-button-quantity-button-container">
                <div className="quantity-buttons-container">
                    <div className="add-button">
                    </div>
                    <div className="count" value="1" />
                    <div className="minus-button">
                    </div>
                </div>
                <div className="quantity-button-container">
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
                {isCartButtonsOnModal ? <div className="update-order-button" onClick={updateOrder}>
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
                            {meatItemInfo.price}
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
            </div>
        </div>
    </div>
}

export default MeatItemModal
