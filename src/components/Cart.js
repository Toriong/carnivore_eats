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

// an order is the price of a meat item and the price of the add-on(s) multiplied by the quantity of the order


// will display the cart icon and the cart modal
const Cart = () => {
    const { _cartOrdersInfo } = useContext(CartInfoContext);

    const [cartOrdersInfo, setCartOrdersInfo] = _cartOrdersInfo;

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMeatItemModalOpen, setIsMeatItemModalOpen] = useState(false);
    // will store the props for the meat item modal 
    const [propsForMeatItemModal, setPropsForMeatItemModal] = useState({});

    const cartIsNotEmpty = cartOrdersInfo.length !== 0;
    // will throw an error if I used the 'cartOrdersInfo' as the determinated to compute the total quantity sum of the user's cart
    const quantitiesForEachCartOrder = cartIsNotEmpty && cartOrdersInfo.map((order) => order.quantity);
    const cartItemsTotalQuantity = cartIsNotEmpty ? quantitiesForEachCartOrder.reduce((numA, numB) => numA + numB) : 0;

    // stores all of the info pertaining to the restaurant of the orders in the cart
    // will throw an error if 'cartOrdersInfo' is empty
    // need to access to the add_ons of the restaurant and the list of meats found in main_meats
    const restaurantInfo = cartIsNotEmpty && meatShops.find((restaurant) => restaurant.name === cartOrdersInfo[0].restaurant);


    const closeMeatItemModal = () => {
        setIsMeatItemModalOpen(false);
    };

    const cartToggle = () => {
        setIsCartOpen(!isCartOpen);
    };

    // 'cartOrder' represents all of the info pertaining to the cart order that was selected by the user 
    // opens the meat item modal w/ the selected cart order and gets the info of the cart order that was selected (cartOrder)
    const openMeatItemModal = (cartOrder) => () => {
        setPropsForMeatItemModal(cartOrder);
        setIsMeatItemModalOpen(true);
    };


    // 'addOnInfo' = the info object of the available add-ons from the selected restaurant
    // compute total price for each add-on for all of the orders in the user's cart
    const computeCartAddOnTotalPrice = (addOnInfo) => {
        // (getPriceOfAddOn(addOn, order) * order.quantity) will compute the total price for each add-on for each order in the user's cart
        // addOnTotalPrices will store an array of each add-on total price for each order of the cart. If there are no particular add-on in an order, then return a zero as a placeholder for the computations that will occur in cartOrdersAddOnsSum
        // if add-ons are part of an order (orderInfo), then return the price of the add-on multiplied by the quantity of its order to get the total cost of add-ons for that order. If no add-ons are present, then return a zero
        const noAddOnsPresent = 0;
        const addOnTotalPrices = cartOrdersInfo.map(orderInfo => orderInfo.addOns ? (getPriceOfAddOn(addOnInfo, orderInfo) * orderInfo.quantity) : noAddOnsPresent);

        const totalAddOnPriceOfCart = addOnTotalPrices.reduce((numA, numB) => numA + numB);
        console.log(`total cart  price for ${addOnInfo.name} in the user's cart is ${totalAddOnPriceOfCart}`);

        return totalAddOnPriceOfCart;
    };



    // will map through the restaurantInfo.add_ons in order to get the price of the add-ons that are part of the user's orders 
    // the 'addOn' parameter will be passed down to the fn 'getPriceOfAddOn' that is within the fn 'computeAddOnsTotalPriceOfCart' in order to get the price of the add-on that the user selected
    // the return value of the map function will be an array of the total prices of each add-on in the user's whole entire cart
    const totalPriceOfEachCartAddOn = cartIsNotEmpty && restaurantInfo.add_ons.map((addOnInfo) => computeCartAddOnTotalPrice(addOnInfo));

    // stores the total price of all add-ons that are in the user's cart
    const totalPriceOfAllCartAddOns = cartIsNotEmpty && totalPriceOfEachCartAddOn.reduce((numA, numB) => numA + numB);

    // will compute the total meat item price for each 'order' in 'cartOrdersInfo'
    // having a map fn within 'cartOrdersInfo.map()' in the var 'totalPricesOfEachCartMeatItem' is hard to read
    // created this function so that I can return primitive values--numbers--instead of an array that contains numbers
    // and to show my intent in what I want to do
    const computeMeatItemTotalPrice = (orderInfo) => {
        let meatItemTotalPrice;
        restaurantInfo.main_meats.forEach((meat) => meat.id === orderInfo.meatItemId && (meatItemTotalPrice = meat.price * orderInfo.quantity))
        return meatItemTotalPrice;
    };

    // will store an array of the total price for each meat item from the user's cart orders
    const totalPriceOfEachCartMeatItem = cartIsNotEmpty && cartOrdersInfo.map(orderInfo => computeMeatItemTotalPrice(orderInfo));


    // stores the sum of the meat item prices in the user's cart
    const totalPriceOfAllCartMeatItems = cartIsNotEmpty && totalPriceOfEachCartMeatItem.reduce((numA, numB) => numA + numB);


    const cartTotalPrice = cartIsNotEmpty && (totalPriceOfAllCartMeatItems + totalPriceOfAllCartAddOns).toFixed(2);

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
        <article id="cart" onClick={cartToggle}>
            <div className="cart-icon">
                <FaShoppingCart />
            </div>
            <div id="cart-text">
                Cart:
            </div>
            <div className="number-of-items">
                {cartItemsTotalQuantity}
            </div>
        </article>
        {/* cart modal */}
        {isCartOpen &&
            <article className="cart-modal">
                <div className="your-order-container" >
                    {cartIsNotEmpty ? <h1>{restaurantInfo.name}</h1> : <h1>Cart is empty</h1>}
                </div>
                {cartIsNotEmpty && cartOrdersInfo.map((order) => {
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
                    {cartIsNotEmpty &&
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



