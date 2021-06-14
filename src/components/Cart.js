import React, { useState, useEffect, useContext } from 'react'
import { CartInfoContext } from "../providers/CartInfoProvider";
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import dummyData from '../data/dummyData.json';
import meatShops from '../data/Meat-Shops.json';
import MeatItemModal from './MeatItemModal';
import DisplayOrderPriceSum from './DisplayOrderPriceSum';
import DisplayTotalCostOfAddOns from './DisplayTotalCostOfAddOns';
import DisplayAddOnName from './DisplayAddOnName'




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


    // cart computations
    if (cartOrders.orders.length) {
        restaurant = meatShops.find((shop) => shop.name === cartOrders.restaurant);

        totalOrders = cartOrders.orders.reduce((totalOrders_, order) => totalOrders_ + order.quantity, 0);

        cartTotalPrice = cartOrders.orders.reduce((cartTotalPrice_, order) => {
            const meatItem = restaurant.main_meats.find((meat) => meat.id === order.meatItemId);
            const totalMeatItemPrice = order.quantity * meatItem.price;

            let addOnsTotalPrice = 0
            if (order.addOns) {
                addOnsTotalPrice = order.addOns.reduce((addOnTotalPrice_, addOnId) => {
                    const addOn = restaurant.add_ons.find((addOn) => addOn.id === addOnId);
                    return addOnTotalPrice_ + (addOn.price * order.quantity);
                }, 0)
            }

            return cartTotalPrice_ + (totalMeatItemPrice + addOnsTotalPrice);
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
            const parsedSavedOrders = JSON.parse(savedOrders);
            setCartOrders(parsedSavedOrders);
        } else {
            setCartOrders(dummyData);
        };
    }, []);


    // save orders 
    useEffect(() => {
        const cartOrders_ = JSON.stringify(cartOrders);
        localStorage.setItem("confirmed orders", cartOrders_);
    }, [cartOrders]);

    return <>
        <article id="cart" onClick={cartToggle}>
            <div className="cart-icon">
                <FaShoppingCart />
            </div>
            <div id="cart-text">
                Cart:
            </div>
            <div className="number-of-items">
                {totalOrders}
            </div>
        </article>
        {/* cart modal */}
        {isCartOpen &&
            <article className="cart-modal">
                <div className="your-order-container" >
                    {cartIsNotEmpty ? <h1>{restaurant.name}</h1> : <h1>Cart is empty</h1>}
                </div>
                {cartIsNotEmpty && cartOrders.orders.map((order) => {
                    return <>
                        <article className="order-name-edit-button-quantity-container" onClick={openMeatItemModal(order)}>
                            <div className="edit-button">
                                EDIT
                            </div>
                            <div className="quantity-container">
                                {order.quantity} X
                            </div>
                            {restaurant.main_meats.map((meat) => meat.id === order.meatItemId &&
                                <div className="name-of-order">
                                    <h4>{meat.name}</h4>
                                </div>
                            )}
                            <div className="price-of-item" >
                                <DisplayOrderPriceSum cartOrder={order} restaurant={restaurant} />
                            </div>
                            {order.addOns &&
                                <article className="addOn-container">
                                    <article className="addOn-header-container">
                                        <div className="addOn-title">
                                            <h5>ADD-ONS</h5>
                                        </div>
                                        <div>
                                            <DisplayTotalCostOfAddOns cartOrder={order} restaurant={restaurant} />
                                        </div>
                                    </article>
                                    <article className="add-on-names-container">
                                        <DisplayAddOnName cartOrder={order} restaurant={restaurant} />
                                    </article>
                                </article>}
                        </article>
                    </>
                })}
                <div className="proceed-to-checkout-button-container">
                    {cartIsNotEmpty &&
                        <Link>
                            <div className="checkout-button">
                                <div className="checkout-button-text">
                                    Go to checkout
                                    </div>
                                <div className="total-price">
                                    <p>${cartTotalPrice.toFixed(2)}</p>
                                </div>
                            </div>
                        </Link>}
                </div>
            </article>}
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

