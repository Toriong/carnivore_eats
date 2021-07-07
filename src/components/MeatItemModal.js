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
// need to use the meatItem variable in order to display the info of the meat item when the user clicks on the meat item from the restaurant menu page 


// pass down the id of the order in order to get all of the info for the order
const MeatItemModal = ({ cartOrders_, cartOrder, isMeatModalOpenWithCartInfo, isCartButtonsOnModal, setIsMeatItemModalOpen, setIsMeatModalOpenWithCartInfo, setIsCartOpen }) => {
    const { _cartOrders } = useContext(CartInfoContext);
    const [cartOrders, setCartOrders] = _cartOrders;
    const [orderCount, setOrderCount] = useState(1);
    const [orderPriceTotal, setOrderPriceTotal] = useState(0);
    const [isAddOnMenuOpen, setIsAddOnMenuOpen] = useState(false);
    const [addOnBtnToggled, setAddOnBtnToggled] = useState(false);
    const restaurant = meatShops.find((restaurant) => restaurant.name === cartOrders.restaurant);
    const meatItem = restaurant.main_meats.find((meat) => meat.id === cartOrder.meatItemId)

    const addOnMenuToggle = () => {
        setIsAddOnMenuOpen(!isAddOnMenuOpen);
    };

    const clickQuantityButton = quantity => () => {
        setOrderCount(quantity);
    }

    const removeOrder = () => {
        const updatedCartOrders = cartOrders.orders.filter((order) => order.orderId !== cartOrder.orderId);
        setCartOrders({
            ...cartOrders,
            orders: updatedCartOrders
        })
        setIsMeatItemModalOpen(false);
    };

    const updateOrder = () => {
        const updatedCartOrders = cartOrders.orders.map((cartOrder_) => {
            if (cartOrder_.orderId === cartOrder.orderId) {
                if (cartOrder_.addOns) {
                    if (!(cartOrder_.addOns.length)) {
                        delete cartOrder_.addOns
                    }
                }

                return {
                    ...cartOrder_,
                    quantity: orderCount
                }
            }

            return cartOrder_;
        });
        setCartOrders({
            ...cartOrders,
            orders: updatedCartOrders
        });
        setIsMeatItemModalOpen(false);
        setIsCartOpen(true);
    };

    useEffect(() => {
        if (isMeatModalOpenWithCartInfo) {
            cartOrders_.forEach((order) => {
                if (order.id === cartOrder.orderId) {
                    setOrderPriceTotal(order.orderTotalPrice.toFixed(2));
                    setOrderCount(cartOrder.quantity)
                    setIsAddOnMenuOpen(true);
                    setIsMeatModalOpenWithCartInfo(false);
                }
            });
        } else {
            const order = cartOrders.orders.find(order => order.orderId === cartOrder.orderId);
            // getAddOnsInfo || 0
            const { totalPrice: addOnsTotalPrice } = getAddOnsInfo(order, restaurant, orderCount);
            const meatItemTotalPrice = meatItem.price * orderCount;
            setOrderPriceTotal((meatItemTotalPrice + addOnsTotalPrice).toFixed(2));
        }
    }, [orderCount, addOnBtnToggled]);

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
                            orderId={cartOrder.orderId}
                            setAddOnBtnToggle={() => setAddOnBtnToggled(!addOnBtnToggled)}
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
                        <button className="add-to-cart-button"
                            onClick={updateOrder}
                        >
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
                <button className="remove-item-button"
                    onClick={removeOrder}
                >
                    <h4>Remove item</h4>
                </button>
            </section>
        }
    </section>
}

export default MeatItemModal;
