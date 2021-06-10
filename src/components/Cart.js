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
    const { _cartOrdersInfo } = useContext(CartInfoContext);
    const [cartOrdersInfo, setCartOrdersInfo] = _cartOrdersInfo;
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMeatItemModalOpen, setIsMeatItemModalOpen] = useState(false);
    const [propsForMeatItemModal, setPropsForMeatItemModal] = useState({});
    const cartIsNotEmpty = cartOrdersInfo.orders.length !== 0;
    let cartTotalQuantity = 0;
    let cartTotalPrice = 0;
    let restaurant;
    let meatItemInfo;

    const closeMeatItemModal = () => {
        setIsMeatItemModalOpen(false);
    };

    const cartToggle = () => {
        setIsCartOpen(!isCartOpen);
    };


    const openMeatItemModal = (cartOrder) => () => {
        setPropsForMeatItemModal(cartOrder);
        setIsMeatItemModalOpen(true);
    };


    // cart computations
    if (cartIsNotEmpty) {
        restaurant = meatShops.find((shop) => shop.name === cartOrdersInfo.restaurant);

        cartTotalQuantity = cartOrdersInfo.orders.reduce((quantityAccumulator, order) => quantityAccumulator + order.quantity, 0);

        cartTotalPrice = cartOrdersInfo.orders.reduce((cartPriceAccumulator, order) => {
            const meatItem = restaurant.main_meats.find((meat) => meat.id === order.meatItemId);
            const totalMeatItemPrice = order.quantity * meatItem.price;

            let addOnsTotalPrice = 0
            if (order.addOns) {
                addOnsTotalPrice = order.addOns.reduce((addOnPriceAccumulator, addOnId) => {
                    const addOn = restaurant.add_ons.find((addOn) => addOn.id === addOnId);
                    return addOnPriceAccumulator + (addOn.price * order.quantity);
                }, 0)
            }

            return cartPriceAccumulator + (totalMeatItemPrice + addOnsTotalPrice);
        }, 0)
    }

    if (isMeatItemModalOpen) {
        // props for MeatItemModal
        meatItemInfo = restaurant.main_meats.find((meat) => meat.id === propsForMeatItemModal.meatItemId);
    }

    // put orders onto UI
    useEffect(() => {
        const savedOrders = localStorage.getItem("confirmed orders");
        if (savedOrders) {
            const parsedSavedOrders = JSON.parse(savedOrders);
            setCartOrdersInfo(parsedSavedOrders);
        } else {
            setCartOrdersInfo(dummyData);
        };
    }, []);


    // save orders 
    useEffect(() => {
        const cartOrders = JSON.stringify(cartOrdersInfo);
        localStorage.setItem("confirmed orders", cartOrders);
    }, [cartOrdersInfo]);

    return <>
        <article id="cart" onClick={cartToggle}>
            <div className="cart-icon">
                <FaShoppingCart />
            </div>
            <div id="cart-text">
                Cart:
            </div>
            <div className="number-of-items">
                {cartTotalQuantity}
            </div>
        </article>
        {/* cart modal */}
        {isCartOpen &&
            <article className="cart-modal">
                <div className="your-order-container" >
                    {cartIsNotEmpty ? <h1>{restaurant.name}</h1> : <h1>Cart is empty</h1>}
                </div>
                {cartIsNotEmpty && cartOrdersInfo.orders.map((order) => {
                    return <>
                        <article className="order-name-edit-button-quantity-container" onClick={openMeatItemModal(order)}>
                            <div className="edit-button">
                                EDIT
                            </div>
                            <div className="quantity-container">
                                {order.quantity} X
                            </div>
                            {/* display the name of the meat item of the user's cart order */}
                            {restaurant.main_meats.map((meat) => meat.id === order.meatItemId &&
                                <div className="name-of-order">
                                    <h4>{meat.name}</h4>
                                </div>
                            )}
                            <div className="price-of-item" >
                                <DisplayOrderPriceSum cartOrder={order} restaurant={restaurant} />
                            </div>
                            {/* if add-ons are present, then display their names and the total cost of the add-ons */}
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
                                        <DisplayAddOnName cartOrder={order} restaurantInfo={restaurant} />
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
                    meatItemInfo={meatItemInfo}
                    setIsMeatItemModalOpen={setIsMeatItemModalOpen}
                    setIsCartOpen={setIsCartOpen}
                    orderInfo={propsForMeatItemModal}
                    isMeatModalOpenWithCartInfo
                    isCartButtonsOnModal
                />
            </>}
    </>
}



export default Cart;

