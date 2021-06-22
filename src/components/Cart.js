import React, { useState, useEffect, useContext } from 'react'
import { CartInfoContext } from "../providers/CartInfoProvider";
import { Link } from 'react-router-dom';
import { FaShoppingCart, } from 'react-icons/fa';
import dummyData from '../data/dummyData.json';
import meatShops from '../data/Meat-Shops.json';
import MeatItemModal from './MeatItemModal';
import computeAddOnsTotalPrice from '../functions/computeAddOnsTotalPrice'

// use flexbox to center and place your elements in your project
// lessen divs in your project


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
    let meatItem;

    const closeMeatItemModal = () => {
        setIsMeatItemModalOpen(false);
    };

    const cartToggle = () => {
        setIsCartOpen(!isCartOpen);
    };


    const openMeatItemModal = (cartOrder) => () => {
        setSelectedCartOrder(cartOrder);
        setIsMeatItemModalOpen(true);
    };

    let cartOrders_ = [];

    // cart info
    if (cartOrders.orders.length) {
        restaurant = meatShops.find((shop) => shop.name === cartOrders.restaurant);

        totalOrders = cartOrders.orders.reduce((totalOrders_, order) => totalOrders_ + order.quantity, 0);

        cartTotalPrice = cartOrders.orders.reduce((cartTotalPrice_, order) => {

            const meatItem = restaurant.main_meats.find((meat) => meat.id === order.meatItemId);
            const totalMeatItemPrice = order.quantity * meatItem.price;

            let addOnsTotalPrice = 0;


            if (order.addOns) {
                addOnsTotalPrice = computeAddOnsTotalPrice(order, restaurant);

                // get the names of each addOn for each order
                order.addOns.forEach(addOnId => {
                    const addOn = restaurant.add_ons.find((addOn) => addOn.id === addOnId);
                    const isOrderInCarOrders_ = cartOrders_.find((order_) => order_.id === order.orderId) !== undefined;

                    if (isOrderInCarOrders_) {
                        cartOrders_ = cartOrders_.map((order_) => {
                            if (order_.id === order.orderId) {
                                return {
                                    ...order_,
                                    addOnNames: [...order_.addOnNames, addOn.name]
                                }
                            }

                            return order_;
                        })
                    } else {
                        cartOrders_ = [...cartOrders_, { id: order.orderId, addOnNames: [addOn.name] }];
                    }
                })
            };

            const cartOrderTotalPrice = totalMeatItemPrice + addOnsTotalPrice;

            // get the total price of each order
            if (addOnsTotalPrice) {
                cartOrders_ = cartOrders_.map((order_) => {
                    if (order_.id === order.orderId) {
                        return {
                            ...order_,
                            totalPrice: cartOrderTotalPrice
                        };
                    };

                    return order_;
                })
            } else {
                cartOrders_ = [...cartOrders_, { id: order.orderId, totalPrice: cartOrderTotalPrice }];
            };

            return cartTotalPrice_ + cartOrderTotalPrice;
        }, 0);
    }


    if (isMeatItemModalOpen) {
        // 'meatItem' prop for the meatItemModal component
        meatItem = restaurant.main_meats.find((meat) => meat.id === selectedCartOrder.meatItemId);
    }

    // put orders onto UI
    useEffect(() => {
        const savedOrders = localStorage.getItem("confirmed orders");
        if (savedOrders) {
            const savedOrders_ = JSON.parse(savedOrders)
            setCartOrders(savedOrders_);
        } else {
            setCartOrders(dummyData);
        };
    }, []);


    // save orders 
    useEffect(() => {
        const cartOrders_ = JSON.stringify(cartOrders)
        localStorage.setItem("confirmed orders", cartOrders_);
    }, [cartOrders]);

    useEffect(() => {
        console.log(cartOrders.orders);
    })

    return <>
        <section id="cart" onClick={cartToggle}>
            <span id="cart-text"><FaShoppingCart />  Cart : {totalOrders}</span>
        </section>
        {/* cart modal */}
        {isCartOpen &&
            <section className="cart-modal">
                {/* 'wrapper' = scrolling  */}
                <div className="cart-modal-wrapper">
                    <section className="your-order-container" >
                        {totalOrders > 1 ? <h1>Your orders</h1> : <h1>Your order</h1>}
                        {cartIsNotEmpty ? <h5>From {restaurant.name}</h5> : <h1>Cart is empty</h1>}
                    </section>
                    <ul className="cartOrders-list">
                        {cartIsNotEmpty && cartOrders.orders.map((order) => {
                            return <>
                                <li className="cartOrder" onClick={openMeatItemModal(order)}>
                                    <section className="cartOrder-name-and-price">
                                        <span>
                                            {order.quantity} x {restaurant.main_meats.map((meat) => {
                                                if (meat.id === order.meatItemId) {
                                                    return meat.name
                                                }

                                                return null;
                                            })}
                                        </span>
                                        {cartOrders_.map((order_) => {
                                            if (order_.id === order.orderId) {
                                                return <p className="order-total-price">{"$" + (order_.totalPrice).toFixed(2)}</p>
                                            }

                                            return null;
                                        })}
                                    </section>
                                    {order.addOns &&
                                        <section className="addOn-container">
                                            <span>ADD-ONS ${computeAddOnsTotalPrice(order, restaurant).toFixed(2)}</span>

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
                        })}
                    </ul>
                    <div className="proceed-to-checkout-button-bottom-wrapper">
                        <div className="proceed-to-checkout-button-fixed-container">
                            {cartIsNotEmpty &&
                                <Link to="/checkout">
                                    <button>
                                        <span className="checkout-button-text">Go to checkout: <span className="cart-total-price">${cartTotalPrice.toFixed(2)}</span></span>
                                    </button>
                                </Link>}
                        </div>
                    </div>
                </div>
            </section>}
        {isMeatItemModalOpen &&
            <>
                <div className="blocker" onClick={closeMeatItemModal} />
                <MeatItemModal
                    meatItem={meatItem}
                    setIsMeatItemModalOpen={setIsMeatItemModalOpen}
                    setIsCartOpen={setIsCartOpen}
                    selectedOrder={selectedCartOrder}
                    isMeatModalOpenWithCartInfo
                    isCartButtonsOnModal
                />
            </>}
    </>
}



export default Cart;

