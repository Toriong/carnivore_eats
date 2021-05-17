import React, { useState, useEffect, useContext, useRef } from 'react'
import { CartInfoContext } from "../providers/CartInfoProvider";
import { Link } from 'react-router-dom';
import dummyData from '../data/dummyData.json';
import MeatItemModal from './MeatItemModal';

const Cart = () => {
    const { _confirmedOrdersInfo, _updateCartInfo } = useContext(CartInfoContext);

    const [confirmedOrdersInfo, setConfirmedOrdersInfo] = _confirmedOrdersInfo;
    const [updateCartInfo, setUpdateCartInfo] = _updateCartInfo
    // WHAT I WANT: I want to get the dummie data and display them onto the DOM in the cart modal. 
    // step -1. the data is displayed onto the cart modal
    // step -2. the data is mapped from confirmedOrdersInfo
    // step -3. the data is stored in confirmedOrdersInfo
    // step -4. the data is stored into confirmedOrdersInfo on mount.
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMeatItemModalOpen, setIsMeatItemModalOpen] = useState(false);
    const [saveDummyData, setSaveDummyData] = useState(false);

    const closeMeatItemModal = () => {
        setIsMeatItemModalOpen(false);
    }

    const [propsForMeatItemModal, setPropsForMeatItemModal] = useState({});
    const openMeatItemModal = (cartOrder) => () => {
        setIsMeatItemModalOpen(true);
        setPropsForMeatItemModal({
            meatItemInfo: cartOrder.infoOfMainMeatItem,
            restaurantName: cartOrder.restaurantName,
            orderFromCart: cartOrder,
        })
    }



    const cartToggle = () => {
        setIsCartOpen(!isCartOpen);
    }





    useEffect(() => {
        const savedOrders = localStorage.getItem("confirmed orders");
        const parsedSavedOrders = JSON.parse(savedOrders);
        if (parsedSavedOrders) {
            console.log("dummy orders not saved")
            setConfirmedOrdersInfo(parsedSavedOrders);
        } else if (parsedSavedOrders === null) {
            setConfirmedOrdersInfo([...confirmedOrdersInfo, ...dummyData]);
            setSaveDummyData(true);
        }
    }, []);


    useEffect(() => {
        if (saveDummyData) {
            const dummyOrdersString = JSON.stringify(confirmedOrdersInfo);
            localStorage.setItem("confirmed orders", dummyOrdersString);
            setSaveDummyData(false);
        }
    }, [saveDummyData])


    const cartQuantityTotal = confirmedOrdersInfo.map((order) => order.confirmedOrderQuantity).reduce((numA, numB) => numA + numB);
    const cartPriceTotal = confirmedOrdersInfo.map((order) => parseFloat(order.totalOrderPrice)).reduce((numA, numB) => numA + numB);

    return <>
        <div id="cart" onClick={cartToggle}>
            <div className="cart-icon">
                <i class="fa fa-shopping-cart" aria-hidden="true"></i>
            </div>
            <div id="cart-text">
                Cart:
            </div>
            <div className="number-of-items">
                {cartQuantityTotal}
            </div>
        </div>
        {/* cart modal */}
        {isCartOpen ?
            <>
                <div className="cart-modal">
                    <div className="your-order-container">
                        <h1>{confirmedOrdersInfo[confirmedOrdersInfo.length - 1].restaurantName}</h1>
                    </div>
                    {confirmedOrdersInfo.slice(1).map((order) => {
                        return <>
                            <div className="order-name-edit-button-quantity-container" onClick={openMeatItemModal(order)}>
                                <div className="edit-button">
                                    EDIT
                                    </div>
                                <div className="quantity-container">
                                    {order.confirmedOrderQuantity} X
                                                        </div>
                                <div className="name-of-order">
                                    <h4>{order.infoOfMainMeatItem.name}</h4>
                                </div>
                                <div className="price-of-item">
                                    <p>${order.totalOrderPrice.toFixed(2)}</p>
                                </div>
                                {order.totalConfirmedAddOnPrice !== 0 && <div className="addOn-container">
                                    <div className="addOn-title">
                                        <h5>ADD-ONS</h5>
                                    </div>
                                    <div>
                                        <p>
                                            ${order.totalConfirmedAddOnPrice.toFixed(2)}
                                        </p>
                                    </div>
                                    {/* addOnsInfo stores the addOns as objects in an array */}
                                    {order.confirmedAddOnsToOrder.map((addOn) => <div className="addOn-names">
                                        <div>
                                            <h6>{addOn.name}</h6>
                                        </div>
                                    </div>
                                    )}
                                </div>}
                            </div>
                        </>
                    })}
                    <div className="proceed-to-checkout-button-container">
                        <Link to="/checkoutPage">
                            <div className="checkout-button">
                                <div className="checkout-button-text">
                                    Go to checkout
                                    </div>
                                <div className="total-price">
                                    <p>${cartPriceTotal.toFixed(2)}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </>
            :
            null
        }
        {isMeatItemModalOpen &&
            <>
                <div className="blocker" onClick={closeMeatItemModal} />
                <MeatItemModal
                    meatItemInfo={propsForMeatItemModal.meatItemInfo}
                    restaurantName={propsForMeatItemModal.restaurantName}
                    setIsMeatItemModalOpen={setIsMeatItemModalOpen}
                    orderFromCart={propsForMeatItemModal.orderFromCart}
                    isMeatModalOpenWithCartInfo
                    isCartButtonsOnModal
                />
            </>
        }
    </>
}



export default Cart
