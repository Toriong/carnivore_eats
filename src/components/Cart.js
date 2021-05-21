import React, { useState, useEffect, useContext, useRef } from 'react'
import { CartInfoContext } from "../providers/CartInfoProvider";
import { Link } from 'react-router-dom';
import dummyData from '../data/dummyData.json';
import meatShops from '../data/Meat-Shops.json';
import MeatItemModal from './MeatItemModal';

const Cart = () => {
    const { _confirmedOrdersInfo, _updateCartInfo } = useContext(CartInfoContext);

    const [confirmedOrdersInfo, setConfirmedOrdersInfo] = _confirmedOrdersInfo;
    const [updateCartInfo, setUpdateCartInfo] = _updateCartInfo

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMeatItemModalOpen, setIsMeatItemModalOpen] = useState(false);
    const [propsForMeatItemModal, setPropsForMeatItemModal] = useState({
        props: {
            id: 1,
            restaurant: "Mcdonalds",
            item: {
                id: "A1",
                quantity: 3
            },
            confirmedAddsOnsToOrder: []
        }
    });


    const closeMeatItemModal = () => {
        setIsMeatItemModalOpen(false);
    }

    // useEffect(() => {
    //     console.log(propsForMeatItemModal.props.item.id)
    // }, [propsForMeatItemModal])




    const cartToggle = () => {
        setIsCartOpen(!isCartOpen);
    }

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
        const dummyOrdersString = JSON.stringify(confirmedOrdersInfo);
        localStorage.setItem("confirmed orders", dummyOrdersString);
        console.log("orders saved");
    }, [confirmedOrdersInfo]);

    // will compute the total quantity sum of the cart
    const cartQuantityTotal = confirmedOrdersInfo.map((order) => order.item.quantity).reduce((numA, numB) => numA + numB);

    // stores the meat list of the restaurant where all of the orders come from
    const restaurantInfo = meatShops.find((restaurant) => restaurant.name === dummyData[0].restaurant);

    const openMeatItemModal = (cartOrder) => () => {
        // restaurantInfo.main_meats
        // console.log(restaurantInfo.main_meats.find((meat) => meat.id === cartOrder.item.id))
        setPropsForMeatItemModal({
            props: cartOrder
        });
        setIsMeatItemModalOpen(true);
    }


    // where each price of the orders will be stored
    const cartPriceList = []

    // will find the meat item in the meatShops list, will compute each order price, and push them into 'cartPriceList'
    dummyData.map((order) => {
        restaurantInfo.main_meats.forEach((meat) => {
            if (meat.id === order.item.id) {
                console.log(meat.id)
                cartPriceList.push(order.item.quantity * meat.price)
            }
        })
    });

    // calculate the sum of cartPriceList and stores it into this var to displace onto the UI
    const cartTotalPrice = cartPriceList.reduce((numA, numB) => numA + numB).toFixed(2);




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
        {isCartOpen &&
            <div className="cart-modal">
                <div className="your-order-container" >
                    <h1>{dummyData[confirmedOrdersInfo.length - 1].restaurant}</h1>
                </div>
                {
                    /* order is each order in 'dummyData'  */
                    confirmedOrdersInfo.map((order) => {
                        return <>
                            <div className="order-name-edit-button-quantity-container" onClick={openMeatItemModal(order)}>
                                <div className="edit-button">
                                    EDIT
                                    </div>
                                <div className="quantity-container">
                                    {order.item.quantity} X
                                </div>
                                {/* get the name of the meat item in for each order */}
                                {/* using the id in the item keyName, map through the 'main_meats' that is stored in restaurantInfo and use the id (order.id) to get the specific meat item */}
                                {/* instead of the map function, have the find method be executed when the user clicks here  in order to get the specific meat item and its info*/}
                                {restaurantInfo.main_meats.map((meat) => meat.id === order.item.id && <div className="name-of-order"><h4>{meat.name}</h4>
                                </div>
                                )}
                                <div className="price-of-item" >
                                    {restaurantInfo.main_meats.map((meat) => meat.id === order.item.id && <div className="price-of-item">
                                        <p>${(meat.price * order.item.quantity).toFixed(2)}</p>
                                    </div>)}
                                </div>
                            </div>
                        </>
                    })
                }
                <div className="proceed-to-checkout-button-container">
                    <Link>
                        <div className="checkout-button">
                            <div className="checkout-button-text">
                                Go to checkout
                                    </div>
                            <div className="total-price">
                                <p>${cartTotalPrice}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        }
        {isMeatItemModalOpen &&
            <>
                <div className="blocker" onClick={closeMeatItemModal} />
                <MeatItemModal
                    meatItemInfo={restaurantInfo.main_meats.find((meat) => meat.id === propsForMeatItemModal.props.item.id)}
                    restaurantName={propsForMeatItemModal.props.restaurant}
                    setIsMeatItemModalOpen={setIsMeatItemModalOpen}
                    setIsCartOpen={setIsCartOpen}
                    orderFromCart={propsForMeatItemModal.props}
                    isMeatModalOpenWithCartInfo
                    isCartButtonsOnModal
                />
            </>
        }
    </>
}



export default Cart



// {
//     order.totalConfirmedAddOnPrice !== 0 && <div className="addOn-container">
//         <div className="addOn-title">
//             <h5>ADD-ONS</h5>
//         </div>
//         <div>
//             {/* display the total price of the add-ons here */}
//             <p>
//                 ${order.totalConfirmedAddOnPrice.toFixed(2)}
//             </p>
//         </div>
//         {/* display all of the add-ons that the user selected here */}
//         {order.confirmedAddOnsToOrder.map((addOn) => <div className="addOn-names">
//             <div>
//                 <h6>{addOn.name}</h6>
//             </div>
//         </div>
//         )}
//     </div>
// }