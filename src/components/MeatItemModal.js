import React, { useState, useEffect, useContext, useRef } from 'react';
import meatShops from '../data/Meat-Shops.json';
import AddOnItem from '../components/AddOnItem';
import computeAddOnsTotalPrice from '../functions/computeAddOnsTotalPrice';
import { CartInfoContext } from '../providers/CartInfoProvider';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import '../css/meatItemModal.css'



// NOTES:
// -where all of the computations/editing for an order will occur
// orderInfo will take in the following object if it was opened from the Restaurant component:
// {
//  meatItemId: (id of the meat item)
//  restaurant: (name of restaurant)
// }

const MeatItemModal = ({ meatItem, setIsMeatItemModalOpen, selectedOrder, isMeatModalOpenWithCartInfo, isCartButtonsOnModal, setIsCartOpen }) => {
    const { _cartOrders } = useContext(CartInfoContext);
    const [cartOrders, setCartOrders] = _cartOrders;
    const [orderCount, setOrderCount] = useState(1);
    const [orderPriceTotal, setOrderPriceTotal] = useState(0);
    const [isAddOnMenuOpen, setIsAddOnMenuOpen] = useState(false);
    const [isMinusButtonDisabled, setIsMinusButtonDisabled] = useState(false);
    const [wasAddOnOrCountBtnPressed, setWasAddOnOrCountBtnPressed] = useState(false);
    const [selectedOrder_, setSelectedOrder_] = useState(selectedOrder);
    const restaurant = meatShops.find((restaurant) => restaurant.name === cartOrders.restaurant);

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
        const updatedCartOrders = cartOrders.orders.filter((order) => order.orderId !== selectedOrder_.orderId);
        setCartOrders({
            ...cartOrders,
            orders: updatedCartOrders
        })
        setIsMeatItemModalOpen(false);
        setIsCartOpen(false);
    };

    const updateOrder = () => {
        if (selectedOrder_.addOns) {
            if (!(selectedOrder_.addOns.length)) {
                setSelectedOrder_(delete selectedOrder_.addOns);
                console.log("deleted selectedOrder_.addOns")
            };
        };
        const updatedCartOrders = cartOrders.orders.map((cartOrder) => {
            if (cartOrder.orderId === selectedOrder_.orderId) {
                return {
                    ...selectedOrder_,
                    quantity: orderCount
                }
            }
            return cartOrder;
        });
        setCartOrders({
            ...cartOrders,
            orders: updatedCartOrders
        });
        setIsMeatItemModalOpen(false);
    };


    useEffect(() => {
        if (orderCount === 1) {
            setIsMinusButtonDisabled(true);
        } else if (orderCount > 1) {
            setIsMinusButtonDisabled(false);
        }
    }, [orderCount]);

    useEffect(() => {
        if (wasAddOnOrCountBtnPressed) {
            let addOnsTotalPrice = 0
            if (selectedOrder_.addOns) {
                addOnsTotalPrice = computeAddOnsTotalPrice(selectedOrder_, restaurant, orderCount);
            }
            const meatItemTotalPrice = meatItem.price * orderCount;
            const cartOrderPriceTotal = (meatItemTotalPrice + addOnsTotalPrice).toFixed(2);
            setOrderPriceTotal(cartOrderPriceTotal);
            setWasAddOnOrCountBtnPressed(false);
        };
    }, [wasAddOnOrCountBtnPressed, meatItem.price, orderCount, restaurant, selectedOrder_]);

    // puts cartOrder info onto meatItem modal
    useEffect(() => {
        if (isMeatModalOpenWithCartInfo) {
            let addOnsTotalPrice = 0
            if (selectedOrder.addOns) {
                addOnsTotalPrice = computeAddOnsTotalPrice(selectedOrder, restaurant);
            }
            const totalMeatItemPrice = (meatItem.price * selectedOrder.quantity)
            const cartOrderPriceTotal = (totalMeatItemPrice + addOnsTotalPrice).toFixed(2);
            setOrderCount(selectedOrder.quantity);
            setOrderPriceTotal(cartOrderPriceTotal);
            // assuming user wants to add add-ons...
            setIsAddOnMenuOpen(true);
        }
    }, []);

    return <section className="selected-food-modal">
        <article className="picture-container">
            <img src={meatItem.image} alt={meatItem.alt} />
        </article>
        <article className="food-title-container">
            <div id="food-item-name">
                <h1>{meatItem.name}</h1>
                <h2>{cartOrders.restaurant}</h2>
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
                                order={selectedOrder_}
                                setOrder={setSelectedOrder_}
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
                {isCartButtonsOnModal ?
                    <div className="update-order-button" onClick={updateOrder}>
                        <div>
                            Update
                        </div>
                        <div>
                            Order
                        </div>
                        {orderPriceTotal > meatItem.price ?
                            <div>
                                ${orderPriceTotal}
                            </div>
                            :
                            <div>
                                ${meatItem.price.toFixed(2)}
                            </div>
                        }
                    </div>
                    :
                    <div className="add-to-cart-button">
                        <div>
                            Add
                        </div>
                        <div className="count">{orderCount}</div>
                        <div>
                            to cart
                        </div>
                        {orderPriceTotal > meatItem.price ?
                            <div>
                                {orderPriceTotal}
                            </div>
                            :
                            <div>
                                {meatItem.price.toFixed(2)}
                            </div>
                        }
                    </div>
                }
            </article>
        </article>
    </section>
}

export default MeatItemModal
