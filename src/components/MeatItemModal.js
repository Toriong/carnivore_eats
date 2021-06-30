import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import meatShops from '../data/Meat-Shops.json';
import AddOnItem from '../components/AddOnItem';
import getAddOnsInfo from '../functions/getAddOnsInfo';
import { CartInfoContext } from '../providers/CartInfoProvider';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import '../css/meatItemModal.css'



// NOTES:
// -where all of the computations/editing for an order will occur
// selectedOrder will take in the following object if it was opened from the Restaurant component:
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
    const [selectedOrder_, setSelectedOrder_] = useState(selectedOrder);
    const restaurant = meatShops.find((restaurant) => restaurant.name === cartOrders.restaurant);

    const addOnMenuToggle = () => {
        setIsAddOnMenuOpen(!isAddOnMenuOpen);
    };

    const clickQuantityButton = quantity => () => {
        setOrderCount(quantity);
    }

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

    const computeOrderTotalPrice = useCallback((order, newQuantity) => {
        let addOns = {
            totalPrice: 0
        };
        let meatItemTotalPrice;

        if (order.addOns) {
            addOns = getAddOnsInfo(order, restaurant, newQuantity)
        };

        if (newQuantity) {
            meatItemTotalPrice = meatItem.price * newQuantity;
        } else {
            meatItemTotalPrice = meatItem.price * order.quantity;
        };

        const cartOrderPriceTotal = (meatItemTotalPrice + addOns.totalPrice).toFixed(2);

        setOrderPriceTotal(cartOrderPriceTotal);
    }, [meatItem, restaurant]);

    useEffect(() => {
        computeOrderTotalPrice(selectedOrder_, orderCount)
    }, [orderCount, selectedOrder_, computeOrderTotalPrice]);

    useEffect(() => {
        if (isMeatModalOpenWithCartInfo) {
            computeOrderTotalPrice(selectedOrder);
            setOrderCount(selectedOrder.quantity);
            setIsAddOnMenuOpen(true);
        }
    }, []);

    return <section className="selected-food-modal">
        <section className="picture-container">
            <img src={meatItem.image} alt={meatItem.alt} />
        </section>
        <section className="food-title-container">
            <h1>{meatItem.name}</h1>
        </section>
        {isAddOnMenuOpen ?
            <>
                <span className="add-ons-text">
                    <h4>Add-ons:</h4>
                    <FaAngleDown onClick={addOnMenuToggle} />
                </span>
                <ul className="add-ons-list-container">
                    {restaurant.add_ons.map((addOnItem) =>
                        <AddOnItem
                            addOnItem={addOnItem}
                            order={selectedOrder_}
                            setOrder={setSelectedOrder_}
                            computeOrderTotalPrice={() => computeOrderTotalPrice(selectedOrder_, orderCount)}
                        />
                    )}
                </ul>
            </>
            :
            <span className="add-ons-text">
                <h4>Add-ons:</h4>
                <FaAngleUp onClick={addOnMenuToggle} />
            </span>
        }
        <section className="quantity-and-add-to-cart-container">
            <span className="quantity-button-container">
                <button className="quantity-button" disabled={orderCount <= 1} onClick={clickQuantityButton(orderCount - 1)}>-</button>

                <div className="quantity-count">{orderCount}</div>

                <button className="quantity-button" onClick={clickQuantityButton(orderCount + 1)}>+</button>

                {
                    isCartButtonsOnModal
                        ?
                        <button className="add-to-cart-button" onClick={updateOrder}>
                            <span>Update Order</span>
                            {orderPriceTotal > meatItem.price
                                ?
                                <div className="orderPriceTotal"> ${orderPriceTotal}</div>
                                :
                                <div className="orderPriceTotal"> ${meatItem.price.toFixed(2)}</div>
                            }
                        </button>
                        :
                        <button className="add-to-cart-button" onClick>
                            <span>Add {orderCount} to cart</span>
                            {orderPriceTotal > meatItem.price
                                ?
                                <div className="orderPriceTotal"> ${orderPriceTotal}</div>
                                :
                                <div className="orderPriceTotal"> ${meatItem.price.toFixed(2)}</div>
                            }
                        </button>
                }

            </span>
        </section>
        {isCartButtonsOnModal &&
            <section className="remove-item-button-container">
                <button className="remove-item-button" onClick={removeOrder}>
                    <h4>Remove item</h4>
                </button>
            </section>
        }
    </section>
}

export default MeatItemModal;
