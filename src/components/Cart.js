import React, { useState, useEffect, useContext } from 'react'
import { CartInfoContext } from "../providers/CartInfoProvider";
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import dummyData from '../data/dummyData.json';
import meatShops from '../data/Meat-Shops.json';
import MeatItemModal from './MeatItemModal';
import DisplayOrderPriceSum from './DisplayOrderPriceSum';
import DisplayAddOnProduct from './DisplayAddOnProduct';

// will display the cart icon and the cart modal
const Cart = () => {
    const { _confirmedOrdersInfo } = useContext(CartInfoContext);

    const [cartOrdersInfo, setConfirmedOrdersInfo] = _confirmedOrdersInfo;

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMeatItemModalOpen, setIsMeatItemModalOpen] = useState(false);
    // will store the props for the meat item modal 
    const [propsForMeatItemModal, setPropsForMeatItemModal] = useState({
        ordrId: 0,
        meatItemId: "",
        restaurant: "",
    });

    // will store all of the price of the meat items and addOns
    let meatItemPrices = [];
    let addOnPrices = [];


    const areCartOrdersPresent = cartOrdersInfo.length !== 0;

    // will compute the total quantity sum of the cart
    // will check if there is anything in the cart
    // if there is something in the cart, then it will compute the total quantity of the cart
    // if not, it will return a zero. 
    const cartItemQuantityTotal = areCartOrdersPresent ? cartOrdersInfo.map((order) => order.quantity).reduce((numA, numB) => numA + numB) : 0;

    // stores all of the info pertaining to the restaurant of the orders in the cart
    const restaurantInfo = areCartOrdersPresent && meatShops.find((restaurant) => restaurant.name === cartOrdersInfo[0].restaurant);

    const closeMeatItemModal = () => {
        setIsMeatItemModalOpen(false);
    };

    const cartToggle = () => {
        setIsCartOpen(!isCartOpen);
    };

    // opens the meat item modal and gets the cart order that was selected
    const openMeatItemModal = (cartOrder) => () => {
        setPropsForMeatItemModal(
            cartOrder
        );
        setIsMeatItemModalOpen(true);
    };


    // if there are any values in restaurantInfo, then get the prices of the meat items and push them into meatItemPrices
    restaurantInfo && cartOrdersInfo.forEach((order) => {
        restaurantInfo.main_meats.forEach((meat) => {
            if (order.meatItemId === meat.id) {
                meatItemPrices.push(meat.price * order.quantity);
            };
        });
    });

    // will get the prices of the add-ons and push them into the 'addOnPrices'
    restaurantInfo && cartOrdersInfo.forEach((order) => {
        if (order.addOns) {
            order.addOns.forEach((addOnId) => {
                restaurantInfo.add_ons.forEach((addOn) => {
                    if (addOnId === addOn.id) {
                        addOnPrices.push(addOn.price * order.quantity);
                    }
                })
            })
        };
    })

    const areAddOnsPricesPresent = addOnPrices.length !== 0;
    const totalAddOnsPrice = areAddOnsPricesPresent ? addOnPrices.reduce((numA, numB) => numA + numB) : 0;


    const areMeatItemPricesPresent = meatItemPrices.length !== 0;
    const totalMeatItemsPrice = areMeatItemPricesPresent ? meatItemPrices.reduce((numA, numB) => numA + numB) : 0;


    const cartTotalPrice = (totalMeatItemsPrice + totalAddOnsPrice).toFixed(2);

    // 'meatItemInfo' prop for 'MeatItemModal'
    // 'meatItemInfo' will store all of the info pertaining to the selected meat item
    const meatItemInfo = restaurantInfo && restaurantInfo.main_meats.find((meat) => meat.id === propsForMeatItemModal.meatItemId)

    // gets the data from the local storage and puts them into confirmedOrdersInfo
    useEffect(() => {
        const savedOrders = localStorage.getItem("confirmed orders");
        if (savedOrders) {
            const parsedSavedOrders = JSON.parse(savedOrders);
            setConfirmedOrdersInfo(parsedSavedOrders);
        } else {
            setConfirmedOrdersInfo([...dummyData]);
        };
    }, []);


    // this will save the orders into the local storage everytime the cart gets updated 
    useEffect(() => {
        const cartOrders = JSON.stringify(cartOrdersInfo);
        localStorage.setItem("confirmed orders", cartOrders);
    }, [cartOrdersInfo]);

    return <>
        <div id="cart" onClick={cartToggle}>
            <div className="cart-icon">
                <FaShoppingCart />
            </div>
            <div id="cart-text">
                Cart:
            </div>
            <div className="number-of-items">
                {cartItemQuantityTotal}
            </div>
        </div>
        {/* cart modal */}
        {isCartOpen &&
            <div className="cart-modal">
                <div className="your-order-container" >
                    {areCartOrdersPresent ? <h1>{restaurantInfo.name}</h1> : <h1>Cart Empty</h1>}
                </div>
                {areCartOrdersPresent && cartOrdersInfo.map((order) => {
                    return <>
                        <article className="order-name-edit-button-quantity-container" onClick={openMeatItemModal(order)}>
                            <div className="edit-button">
                                EDIT
                            </div>
                            <div className="quantity-container">
                                {order.quantity} X
                            </div>
                            {restaurantInfo.main_meats.map((meat) => meat.id === order.meatItemId &&
                                <div className="name-of-order">
                                    <h4>{meat.name}</h4>
                                </div>
                            )}
                            <div className="price-of-item" >
                                {<DisplayOrderPriceSum cartOrder={order} restaurantInfo={restaurantInfo} />}
                            </div>
                            {order.addOns &&
                                <article className="addOn-container">
                                    <article className="addOn-header-container">
                                        <div className="addOn-title">
                                            <h5>ADD-ONS</h5>
                                        </div>
                                        <div>
                                            <DisplayAddOnProduct order={order} restaurantInfo={restaurantInfo} />
                                        </div>
                                    </article>
                                    <article className="add-on-names-container">
                                        {order.addOns.map((addOnId) => restaurantInfo.add_ons.map((addOn) => addOnId === addOn.id && <p>+{addOn.name}</p>))}
                                    </article>
                                </article>}
                        </article>
                    </>
                })}
                <div className="proceed-to-checkout-button-container">
                    {areCartOrdersPresent &&
                        <Link>
                            <div className="checkout-button">
                                <div className="checkout-button-text">
                                    Go to checkout
                                    </div>
                                <div className="total-price">
                                    <p>${cartTotalPrice}</p>
                                </div>
                            </div>
                        </Link>}
                </div>
            </div>}
        {isMeatItemModalOpen &&
            <>
                <div className="blocker" onClick={closeMeatItemModal} />
                <MeatItemModal
                    meatItemInfo={meatItemInfo}
                    restaurantName={propsForMeatItemModal.restaurant}
                    setIsMeatItemModalOpen={setIsMeatItemModalOpen}
                    setIsCartOpen={setIsCartOpen}
                    orderFromCart={propsForMeatItemModal}
                    isMeatModalOpenWithCartInfo
                    isCartButtonsOnModal
                />
            </>}
    </>
}



export default Cart;



