import React, { useState, useEffect, useContext } from 'react'
import { CartInfoContext } from "../providers/CartInfoProvider";
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import getPriceOfAddOn from '../functions/getPriceOfAddOn'
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
    // will store the props for the meat item modal 
    const [propsForMeatItemModal, setPropsForMeatItemModal] = useState({});

    const areCartOrdersPresent = cartOrdersInfo.length !== 0;
    const cartItemsQuantityTotal = areCartOrdersPresent ? cartOrdersInfo.map((order) => order.quantity).reduce((numA, numB) => numA + numB) : 0;

    // stores all of the info pertaining to the restaurant of the orders in the cart
    // will throw an error if 'cartOrdersInfo' is empty
    const restaurantInfo = areCartOrdersPresent && meatShops.find((restaurant) => restaurant.name === cartOrdersInfo[0].restaurant);


    const closeMeatItemModal = () => {
        setIsMeatItemModalOpen(false);
    };

    const cartToggle = () => {
        setIsCartOpen(!isCartOpen);
    };

    // opens the meat item modal w/ the selected cart order and gets the info of the cart order that was selected
    const openMeatItemModal = (cartOrder) => () => {
        setPropsForMeatItemModal(
            cartOrder
        );
        setIsMeatItemModalOpen(true);
    };


    // this function will compute the total add-on price for each order in 'cartOrdersInfo'
    const computeOrderAddOnTotalPrice = (addOn) => {
        // if there are addOns, then loop through order.addOns and return the price multiplied by the quantity of the order. If there are no addOns selected for a order, then return a zero
        const proxyForAddOnsComputation = 0;
        const addOnPrices = cartOrdersInfo.map(order => order.addOns ? (getPriceOfAddOn(addOn, order) * order.quantity) : proxyForAddOnsComputation);
        let addOnSum = addOnPrices.reduce((numA, numB) => numA + numB);
        console.log("addOnSum", addOnSum)
        return addOnPrices;
    };

    useEffect(() => {
        console.log(cartAddOnPrices);
    });

    const cartAddOnPrices = restaurantInfo && restaurantInfo.add_ons.map((addOn) => computeOrderAddOnTotalPrice(addOn));

    const cartAddOnsPriceTotal = cartAddOnPrices && cartAddOnPrices.flat().reduce((numA, numB) => numA + numB);


    // will compute the total meat item price for each order in 'cartOrdersInfo'
    const computeMeatItemTotalPrice = (order) => {
        let meatItemTotalPrice;
        restaurantInfo.main_meats.forEach((meat) => {
            if (meat.id === order.meatItemId) {
                meatItemTotalPrice = (meat.price * order.quantity)
            }
        })
        return meatItemTotalPrice;
    };

    const cartMeatPrices = restaurantInfo && cartOrdersInfo.map(order => computeMeatItemTotalPrice(order));

    const cartMeatsPriceTotal = cartMeatPrices && cartMeatPrices.reduce((numA, numB) => numA + numB);

    const cartTotalPrice = areCartOrdersPresent ? (cartMeatsPriceTotal + cartAddOnsPriceTotal).toFixed(2) : 0;

    // the prop for the meatItemModal component
    const meatItemInfo = restaurantInfo && restaurantInfo.main_meats.find((meat) => meat.id === propsForMeatItemModal.meatItemId)

    // gets the data from the local storage and puts them into confirmedOrdersInfo on the intial render of the component
    useEffect(() => {
        const savedOrders = localStorage.getItem("confirmed orders");
        if (savedOrders) {
            console.log("orders restored")
            const parsedSavedOrders = JSON.parse(savedOrders);
            setCartOrdersInfo(parsedSavedOrders);
        } else {
            console.log("dummyData inserted")
            setCartOrdersInfo([...dummyData]);
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
                {cartItemsQuantityTotal}
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
                            {/* display the name of the meat item of the user's cart order */}
                            {restaurantInfo.main_meats.map((meat) => meat.id === order.meatItemId &&
                                <div className="name-of-order">
                                    <h4>{meat.name}</h4>
                                </div>
                            )}
                            <div className="price-of-item" >
                                <DisplayOrderPriceSum cartOrder={order} restaurantInfo={restaurantInfo} />
                            </div>
                            {/* if add-ons are present, then display their names and the total cost of the add-ons */}
                            {order.addOns &&
                                <article className="addOn-container">
                                    <article className="addOn-header-container">
                                        <div className="addOn-title">
                                            <h5>ADD-ONS</h5>
                                        </div>
                                        <div>
                                            <DisplayTotalCostOfAddOns cartOrder={order} restaurantInfo={restaurantInfo} />
                                        </div>
                                    </article>
                                    <article className="add-on-names-container">
                                        <DisplayAddOnName cartOrder={order} restaurantInfo={restaurantInfo} />
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



