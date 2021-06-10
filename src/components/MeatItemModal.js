import React, { useState, useEffect, useContext, useRef } from 'react';
import meatShops from '../data/Meat-Shops.json';
import AddOnItem from '../components/AddOnItem';
import computeAddOnsTotalPrice from '../functions/computeAddOnsTotalPrice';
import { CartInfoContext } from '../providers/CartInfoProvider';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import '../css/meatItemModal.css'



// NOTES:
// -this is where all of the computations/editing for an order will occur
// orderInfo will take in the followning object if it was opened from the Restaurant component:
// {
//  meatItemId: (id of the meat item)
//  restaurant: (name of restaurant)
// }

const MeatItemModal = ({ meatItemInfo, setIsMeatItemModalOpen, orderInfo, isMeatModalOpenWithCartInfo, isCartButtonsOnModal, setIsCartOpen }) => {
    const { _cartOrdersInfo } = useContext(CartInfoContext);
    const [cartOrdersInfo, setCartOrdersInfo] = _cartOrdersInfo;
    const [orderCount, setOrderCount] = useState(1);
    const [orderPriceTotal, setOrderPriceTotal] = useState(0);
    const [isAddOnMenuOpen, setIsAddOnMenuOpen] = useState(false);
    const [isMinusButtonDisabled, setIsMinusButtonDisabled] = useState(false);
    const [wasAddOnOrCountBtnPressed, setWasAddOnOrCountBtnPressed] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(orderInfo);
    const restaurant = meatShops.find((restaurant) => restaurant.name === cartOrdersInfo.restaurant);
    // let addOnsTotalPrice = useRef(0);

    const addOnMenuToggle = () => {
        setIsAddOnMenuOpen(!isAddOnMenuOpen);
    };

    const decreaseCount = () => {
        setOrderCount(orderCount - 1);
        setWasAddOnOrCountBtnPressed(true);
    };

    const increaseCount = () => {
        setOrderCount(orderCount + 1);
        setWasAddOnOrCountBtnPressed(true);
    };


    const removeOrder = () => {
        const updatedCartOrders = cartOrdersInfo.orders.filter((order) => order.orderId !== orderInfo.orderId);
        setCartOrdersInfo({
            ...cartOrdersInfo,
            orders: updatedCartOrders
        })
        setIsMeatItemModalOpen(false);
        setIsCartOpen(false);
    };

    const updateOrder = () => {
        if (selectedOrder.addOns) {
            const noAddOnsArePresent = selectedOrder.addOns.length === 0;
            if (noAddOnsArePresent) {
                setSelectedOrder(delete selectedOrder.addOns);
            };
        };
        const updatedCartOrders = cartOrdersInfo.orders.map((cartOrder) => {
            if (cartOrder.orderId === selectedOrder.orderId) {
                return {
                    ...selectedOrder,
                    quantity: orderCount
                }
            }
            return cartOrder;
        });
        setCartOrdersInfo({
            ...cartOrdersInfo,
            orders: updatedCartOrders
        });
        setIsMeatItemModalOpen(false);
    };

    // put the mainMeatCount as the quantity count for selectedOrder
    // compute price of add-ons


    useEffect(() => {
        if (orderCount === 1) {
            setIsMinusButtonDisabled(true);
        } else if (orderCount !== 1) {
            setIsMinusButtonDisabled(false);
        }
    }, [orderCount]);

    useEffect(() => {
        if (wasAddOnOrCountBtnPressed) {
            let addOnsTotalPrice = 0
            if (selectedOrder.addOns) {
                addOnsTotalPrice = computeAddOnsTotalPrice(selectedOrder, restaurant, orderCount);
            }
            const meatItemTotalPrice = meatItemInfo.price * orderCount;
            const cartOrderPriceTotal = (meatItemTotalPrice + addOnsTotalPrice).toFixed(2);
            setOrderPriceTotal(cartOrderPriceTotal);
            setWasAddOnOrCountBtnPressed(false);
        };
    }, [wasAddOnOrCountBtnPressed, setSelectedOrder, meatItemInfo.price, orderCount, restaurant, selectedOrder]);

    useEffect(() => {
        if (isMeatModalOpenWithCartInfo) {
            let addOnsTotalPrice = 0
            if (selectedOrder.addOns) {
                addOnsTotalPrice = computeAddOnsTotalPrice(selectedOrder, restaurant);
            }
            const totalMeatItemPrice = (meatItemInfo.price * selectedOrder.quantity)
            const cartOrderPriceTotal = (totalMeatItemPrice + addOnsTotalPrice).toFixed(2);
            setOrderCount(selectedOrder.quantity);
            setOrderPriceTotal(cartOrderPriceTotal);
            // assuming user wants to add add-ons...
            setIsAddOnMenuOpen(true);
        }
    }, []);

    return <section className="selected-food-modal">
        <article className="picture-container">
            <img src={meatItemInfo.image} alt={meatItemInfo.alt} />
        </article>
        <article className="food-title-container">
            <div id="food-item-name">
                <h1>{meatItemInfo.name}</h1>
                <h2>{cartOrdersInfo.restaurant}</h2>
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
                        {restaurant.add_ons.map((addOnItem) => {
                            return <AddOnItem
                                addOnItem={addOnItem}
                                order={selectedOrder}
                                setOrder={setSelectedOrder}
                                setWasAddOnOrCountBtnPressed={setWasAddOnOrCountBtnPressed}
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
                    <div className="count">{orderCount}</div>
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
                                ${meatItemInfo.price.toFixed(2)}
                            </div>
                        }
                    </div>
                    :
                    /* if isCartButtonsOnModal is false or undefined, then present the 'Add to cart' button   */
                    <div className="add-to-cart-button">
                        <div>
                            Add
                        </div>
                        <div className="count">{orderCount}</div>
                        <div>
                            to cart
                        </div>
                        {orderPriceTotal > meatItemInfo.price ?
                            <div>
                                {orderPriceTotal}
                            </div>
                            :
                            <div>
                                {meatItemInfo.price.toFixed(2)}
                            </div>
                        }
                    </div>
                }
            </article>
        </article>
    </section>
}

export default MeatItemModal
