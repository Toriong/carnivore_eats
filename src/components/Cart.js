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
        ordrId: 0,
        meatItemId: "",
        restaurant: "Mcdonalds",
        confirmedAddsOnsToOrder: []
    });


    const closeMeatItemModal = () => {
        setIsMeatItemModalOpen(false);
    }

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
            console.log("confirmedOrdersInfo set");
            setConfirmedOrdersInfo([...dummyData]);

        };
    }, []);



    // this will save the orders into the local storage everytime the cart gets updated 
    useEffect(() => {
        console.log(confirmedOrdersInfo);
        const dummyOrdersString = JSON.stringify(confirmedOrdersInfo);
        localStorage.setItem("confirmed orders", dummyOrdersString);
        console.log("orders saved");
    }, [confirmedOrdersInfo]);

    // will compute the total quantity sum of the cart
    // will check if there is anything in the cart
    // if there is something in the cart, then it will compute the total quantity of the cart
    // if not, it will return a zero. 
    const cartQuantityTotal = confirmedOrdersInfo.length !== 0 ? confirmedOrdersInfo.map((order) => order.quantity).reduce((numA, numB) => numA + numB) : 0;

    useEffect(() => {
        console.log(cartQuantityTotal);
    }, [cartQuantityTotal]);

    // stores the meat list of the restaurant where all of the orders come from
    const restaurantInfo = meatShops.find((restaurant) => restaurant.name === dummyData[0].restaurant);

    const openMeatItemModal = (cartOrder) => () => {
        setPropsForMeatItemModal(
            cartOrder
        );
        setIsMeatItemModalOpen(true);
    }




    // where each price of the orders will be stored
    const cartMeatItemPriceList = []

    // total price of the meat items
    confirmedOrdersInfo.forEach((order) => {
        restaurantInfo.main_meats.map((meat) => {
            if (meat.id === order.meatItemId) {
                cartMeatItemPriceList.push(order.quantity * meat.price)
            }
        })
    });

    const addOnPriceList = []

    confirmedOrdersInfo.forEach((order) => {
        order.addOns.map((addOnId) => {
            restaurantInfo.add_ons.map((addOn) => {
                addOn.id === addOnId && addOnPriceList.push(addOn.price * order.quantity);
            });
        })
    });

    // calculate the sum of cartPriceList and stores it into this var to displace onto the UI
    const cartTotalPrice = cartMeatItemPriceList.length !== 0 && cartMeatItemPriceList.reduce((numA, numB) => numA + numB) + addOnPriceList.reduce((numA, numB) => numA + numB);


    // create a function that will display the total sum of the add-ons of an order
    const DisplayAddOnProduct = ({ order, restaurantInfo }) => {
        const AddOnPrices = [];
        order.addOns.map((addOnId) => restaurantInfo.add_ons.map((addOn) => addOn.id === addOnId && AddOnPrices.push(addOn.price)));

        const AddOnsSum = AddOnPrices.reduce((numA, numB) => numA + numB);
        const AddOnProduct = (AddOnsSum * order.quantity)
        return <p>${AddOnProduct.toFixed(2)}</p>
    };

    const DisplayOrderPriceSum = ({ cartOrder, restaurantInfo }) => {
        let orderPriceList = []
        let meatItemPriceSum;
        let addOnPriceList = [];

        // compute the product between the meat item and the quantity of the order
        restaurantInfo.main_meats.map((meat) => {
            if (meat.id === cartOrder.meatItemId) {
                meatItemPriceSum = (cartOrder.quantity * meat.price);
                orderPriceList.push(meatItemPriceSum);
            };
        });

        // compute the product between the addOn
        cartOrder.addOns && cartOrder.addOns.map((addOnId) => {
            restaurantInfo.add_ons.map((addOn) => {
                if (addOn.id === addOnId) {
                    addOnPriceList.push(addOn.price);
                }
            })
        })

        const addOnsSum = addOnPriceList.length !== 0 && addOnPriceList.reduce((numA, numB) => numA + numB);

        addOnsSum > 0 && orderPriceList.push(addOnsSum * cartOrder.quantity);

        const totalOrderPrice = orderPriceList.reduce((numA, numB) => numA + numB);

        return <div>
            <p>${totalOrderPrice.toFixed(2)}</p>
        </div>

    }



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
                    {confirmedOrdersInfo.length !== 0 ? <h1>{confirmedOrdersInfo[0].restaurant}</h1> : <h1>Cart Empty</h1>}
                </div>
                {
                    /* order is each order in 'dummyData'  */
                    confirmedOrdersInfo.map((order) => {
                        return <>
                            <article className="order-name-edit-button-quantity-container" onClick={openMeatItemModal(order)}>
                                <div className="edit-button">
                                    EDIT
                                    </div>
                                <div className="quantity-container">
                                    {order.quantity} X
                                </div>
                                {restaurantInfo.main_meats.map((meat) => meat.id === order.meatItemId && <div className="name-of-order"><h4>{meat.name}</h4>
                                </div>
                                )}
                                <div className="price-of-item" >
                                    <DisplayOrderPriceSum cartOrder={order} restaurantInfo={restaurantInfo} />
                                </div>
                                {order.addOns && <article className="addOn-container">
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
                    })
                }
                <div className="proceed-to-checkout-button-container">
                    {confirmedOrdersInfo.length !== 0 && <Link>
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
            </div>
        }
        {isMeatItemModalOpen &&
            <>
                <div className="blocker" onClick={closeMeatItemModal} />
                <MeatItemModal
                    meatItemInfo={restaurantInfo.main_meats.find((meat) => meat.id === propsForMeatItemModal.meatItemId)}
                    restaurantName={propsForMeatItemModal.restaurant}
                    setIsMeatItemModalOpen={setIsMeatItemModalOpen}
                    setIsCartOpen={setIsCartOpen}
                    orderFromCart={propsForMeatItemModal}
                    isMeatModalOpenWithCartInfo
                    isCartButtonsOnModal
                />
            </>
        }
    </>
}



export default Cart;



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