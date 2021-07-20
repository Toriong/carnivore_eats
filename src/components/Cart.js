import React, { useState, useEffect, useContext } from 'react'
import { CartInfoContext } from "../providers/CartInfoProvider";
import { Link } from 'react-router-dom';
import { FaShoppingCart, } from 'react-icons/fa';
import dummyData from '../data/dummyData.json';
import meatShops from '../data/Meat-Shops.json';
import MeatItemModal from './MeatItemModal';
import getAddOnsInfo from '../functions/getAddOnsInfo'



// will display the cart icon and the cart modal
const Cart = () => {
    const { _cartOrders } = useContext(CartInfoContext);
    const [cartOrders, setCartOrders] = _cartOrders;
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMeatItemModalOpen, setIsMeatItemModalOpen] = useState(false);
    const [selectedCartOrder, setSelectedCartOrder] = useState({});
    const cartIsNotEmpty = !!cartOrders.orders.length;
    let totalOrders = 0;
    let cartTotalPrice = 0;
    let restaurant;

    const closeMeatItemModal = () => {
        setIsMeatItemModalOpen(false);
    }


    const cartToggle = () => {
        setIsCartOpen(!isCartOpen);
    };

    const openMeatItemModal = (cartOrder) => () => {
        setSelectedCartOrder(cartOrder);
        setIsMeatItemModalOpen(true);
        setIsCartOpen(false);
    };

    let cartOrders_ = [];


    if (cartOrders.orders.length) {
        restaurant = meatShops.find(shop => shop.name === cartOrders.restaurant);

        totalOrders = cartOrders.orders.reduce((totalOrders_, order) => totalOrders_ + order.quantity, 0);

        cartTotalPrice = cartOrders.orders.reduce((cartTotalPrice_, order) => {
            const meatItem = restaurant.main_meats.find((meat) => meat.id === order.meatItemId);
            const totalMeatItemPrice = order.quantity * meatItem.price;
            let addOnsTotalPrice;

            if (order.addOns) {
                const { _addOnsTotalPrice, _addOnNames } = getAddOnsInfo(order, restaurant);
                addOnsTotalPrice = _addOnsTotalPrice;
                cartOrders_.push({
                    id: order.orderId,
                    addOnNames: _addOnNames,
                    addOnsTotalPrice: addOnsTotalPrice.toFixed(2)
                });
            }

            const cartOrderTotalPrice = totalMeatItemPrice + (addOnsTotalPrice ?? 0);
            if (order.addOns) {
                cartOrders_ = cartOrders_.map(order_ => {
                    if (order_.id === order.orderId) {
                        return {
                            ...order_,
                            orderTotalPrice: cartOrderTotalPrice.toFixed(2)
                        };
                    };

                    return order_;
                })
            } else {
                cartOrders_.push({
                    id: order.orderId,
                    orderTotalPrice: cartOrderTotalPrice.toFixed(2)
                });
            };

            return cartTotalPrice_ + cartOrderTotalPrice;
        }, 0);
    }

    useEffect(() => {
        const savedOrders = localStorage.getItem("confirmed orders");

        if (savedOrders) {
            const savedOrders_ = JSON.parse(savedOrders);
            setCartOrders(savedOrders_);
        } else {
            setCartOrders(dummyData);
        };
    }, []);

    useEffect(() => {
        const cartOrders_ = JSON.stringify(cartOrders);
        localStorage.setItem("confirmed orders", cartOrders_);
    }, [cartOrders]);

    useEffect(() => {
        console.log(cartOrders_)
    })

    return <>
        <section id="cart" onClick={cartToggle}>
            <span id="cart-text"><FaShoppingCart />  Cart : {totalOrders}</span>
        </section>
        {/* cart modal */}
        {isCartOpen &&
            <section className="cart-modal">
                {/* 'cart-modal-wrapper' is for the scrolling*/}
                <div className="cart-modal-wrapper">
                    <section className="your-order-container" >
                        {cartOrders.orders.length > 1 && <h1>Your orders</h1>}
                        {cartOrders.orders.length === 1 && <h1>Your order</h1>}
                        {cartIsNotEmpty ? <h5>From {restaurant.name}</h5> : <h1>Cart is empty</h1>}
                    </section>
                    <ul className="cartOrders-list">
                        {cartIsNotEmpty && cartOrders.orders.map(order =>
                            <>
                                <li className="cartOrder" onClick={openMeatItemModal(order)}>
                                    <section className="cartOrder-name-and-price">
                                        <span>
                                            {order.quantity} x {restaurant.main_meats.map(meat => {
                                                if (meat.id === order.meatItemId) {
                                                    return meat.name
                                                }

                                                return null;
                                            })}
                                        </span>
                                        {cartOrders_.map(order_ => {
                                            if (order_.id === order.orderId) {
                                                return <span className="order-total-price">{"$" + order_.orderTotalPrice}</span>
                                            }

                                            return null;
                                        })}
                                    </section>
                                    {order.addOns &&
                                        <section className="addOn-container">
                                            <span> ADD-ONS ${cartOrders_.map(order_ => {
                                                if (order_.id === order.orderId) {
                                                    return order_.addOnsTotalPrice
                                                }

                                                return null;
                                            })}
                                            </span>

                                            <div className="add-on-names-container">
                                                {cartOrders_.map((order_) => {
                                                    if (order_.id === order.orderId) {
                                                        return order_.addOnNames.map((addOnName) => <p>+{addOnName}</p>)
                                                    }

                                                    return null;
                                                })}
                                            </div>
                                        </section>}
                                </li>
                                {cartOrders.orders[cartOrders.orders.length - 1].orderId !== order.orderId
                                    ? <div className="cartOrder-border" />
                                    : null
                                }
                            </>
                        )}
                    </ul>
                    <div className="proceed-to-checkout-button-bottom-wrapper">
                        <div className="proceed-to-checkout-button-fixed-container">
                            {cartIsNotEmpty &&
                                <Link to="/checkout">
                                    <button>
                                        <span className="checkout-button-text">Go to checkout: <span className="cart-total-price">${cartTotalPrice.toFixed(2)}</span></span>
                                    </button>
                                </Link>
                            }
                        </div>
                    </div>
                </div>
            </section>}
        {isMeatItemModalOpen &&
            <>
                <div className="blocker" onClick={closeMeatItemModal} />
                <MeatItemModal
                    order={selectedCartOrder}
                    setOrder={setSelectedCartOrder}
                    setIsMeatItemModalOpen={setIsMeatItemModalOpen}
                    isCartButtonsOnModal
                    setIsCartOpen={setIsCartOpen}
                />
            </>
        }
    </>
}



export default Cart;