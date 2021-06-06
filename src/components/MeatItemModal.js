import React, { useState, useEffect, useContext } from 'react';
import meatShops from '../data/Meat-Shops.json';
import AddOnItem from '../components/AddOnItem';
import getPriceOfAddOn from '../functions/getPriceOfAddOn'
import { CartInfoContext } from '../providers/CartInfoProvider';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import '../css/meatItemModal.css'



// NOTES:
// -this is where all of the computations/editing for an order will occur
// orderInfo will take in the followning object if it was opened from the Restaurant component:
// {
//  meatItemId: (id of the meat item)
//  restaurant: (name of restaurant)
// }

const MeatItemModal = ({ meatItemInfo, setIsMeatItemModalOpen, orderInfo, isMeatModalOpenWithCartInfo, isCartButtonsOnModal, setIsCartOpen }) => {
    const { _cartOrdersInfo } = useContext(CartInfoContext);


    const [cartOrdersInfo, setCartOrdersInfo] = _cartOrdersInfo;

    // will keep track the of the quantity of the order
    const [orderCount, setOrderCount] = useState(1);
    const [orderPriceTotal, setOrderPriceTotal] = useState(0);
    const [isAddOnMenuOpen, setIsAddOnMenuOpen] = useState(false);
    const [isMinusButtonDisabled, setIsMinusButtonDisabled] = useState(false);
    // if true, will compute the total price of the order in the meatItemModal
    const [wasAddOnOrCountBtnPressed, setWasAddOnOrCountBtnPressed] = useState(false);

    // will store the info that will be edited by the user (having the quantity of the order be changed or an add-on keyName inserted in)
    const [meatOrder, setMeatOrder] = useState(orderInfo);

    // will store all of the info pertaining to the restaurant of the selected meatItem
    const restaurantInfo = meatShops.find((restaurant) => restaurant.name === orderInfo.restaurant);

    const addOnMenuToggle = () => {
        setIsAddOnMenuOpen(!isAddOnMenuOpen);
    };

    const decreaseCount = () => {
        setOrderCount(orderCount - 1);
        setWasAddOnOrCountBtnPressed(true);
    };

    const increaseCount = () => {
        setOrderCount(orderCount + 1);
        setWasAddOnOrCountBtnPressed(true);
    };

    // will remove the selected cart order from the cart 
    const removeOrder = () => {
        // will find the order that is needed to be deleted by way of its id
        setCartOrdersInfo(cartOrdersInfo.filter((order) => order.orderId !== orderInfo.orderId));
        setIsMeatItemModalOpen(false);
        // will close the cart modal so that the user can enter in a new order from the menu of the restaurant
        setIsCartOpen(false);
    };

    // will respond to the user pressing the update button
    const updateOrder = () => {
        // will check if there are any add-ons in the order
        if (meatOrder.addOns) {
            // will check if the array that is in the addOns key of the order is empty
            const noAddOnsArePresent = meatOrder.addOns.length === 0;
            if (noAddOnsArePresent) {
                setMeatOrder(delete meatOrder.addOns);
            };
        };
        // will update the selected order via its ID 
        const updatedOrder = cartOrdersInfo.map((order) => {
            if (order.orderId === meatOrder.orderId) {
                return {
                    ...meatOrder,
                    quantity: orderCount
                }
            }
            return order;
        });
        setCartOrdersInfo(updatedOrder);
        // will close the meat modal 
        setIsMeatItemModalOpen(false);
    };


    // must be available in the following useEffects below
    let addOnsSum = 0;

    // will check if there exist an addOn key in the meatOrder state value
    if (meatOrder.addOns) {
        const addOnsPrices = restaurantInfo.add_ons.map((addOn) => getPriceOfAddOn(addOn, meatOrder));
        addOnsSum = addOnsPrices.reduce((numA, numB) => numA + numB)
    };

    useEffect(() => {
        if (orderCount === 1) {
            setIsMinusButtonDisabled(true);
        } else if (orderCount !== 1) {
            setIsMinusButtonDisabled(false);
        }
    }, [orderCount]);

    // there will be multiple re-renders of the component when the user increases the quantity count (the component will re-render when the orderCount is changed and when orderPriceTotal changes as well)
    // this useEffect will update the total price of the order when the user clicks on the quantity button or the add-on button
    useEffect(() => {
        if (wasAddOnOrCountBtnPressed) {
            const cartOrderPriceTotal = (meatItemInfo.price + addOnsSum) * orderCount;
            // chose this way because the price of the order kept on being reseted back to the default price of the meat item (with one count) on the initial render of this component without a conditional (without the condtional--wasAddOnOrCountBtnPressed--the orderPriceTotal will set to the intital price of the meat item (the price of the meat item times the default value stored in order count, which is 1))
            setOrderPriceTotal(cartOrderPriceTotal.toFixed(2));
            setWasAddOnOrCountBtnPressed(false);
        };
    }, [wasAddOnOrCountBtnPressed, meatOrder, addOnsSum, meatItemInfo.price, orderCount]);

    // will present the cart order info onto the modal on the initial render of this component when the component was invoked from the Cart component
    useEffect(() => {
        if (isMeatModalOpenWithCartInfo) {
            const cartOrderPriceTotal = (meatItemInfo.price + addOnsSum) * meatOrder.quantity;
            setOrderCount(meatOrder.quantity);
            setOrderPriceTotal(cartOrderPriceTotal.toFixed(2));
            // assuming that the user might have the intent to update his order with add-ons, the add-on menu will be displayed as a result 
            setIsAddOnMenuOpen(true);
        }
    }, []);

    return <section className="selected-food-modal">
        <article className="picture-container">
            <img src={meatItemInfo.image} alt={meatItemInfo.alt} />
        </article>
        <article className="food-title-container">
            <div id="food-item-name">
                <h1>{meatItemInfo.name}</h1>
                <h2>{orderInfo.restaurant}</h2>
            </div>
        </article>
        <article className="add-ons-text-container">
            {isAddOnMenuOpen ?
                <>
                    <h2>Add-On:</h2>
                    <div className="arrow-container" onClick={addOnMenuToggle}>
                        <i>
                            <FaAngleDown />
                        </i>
                    </div>
                    <div className="add-ons-list-container">
                        {restaurantInfo.add_ons.map((addOnItem) => {
                            return <AddOnItem
                                addOnItem={addOnItem}
                                order={meatOrder}
                                setOrder={setMeatOrder}
                                setWasAddOnOrCountBtnPressed={setWasAddOnOrCountBtnPressed}
                            />
                        })}
                    </div>
                </>
                :
                <>
                    <h2>Add-On:</h2>
                    <div className="arrow-container" onClick={addOnMenuToggle}>
                        <i>
                            <FaAngleUp />
                        </i>
                    </div>
                </>
            }
        </article>
        {/* if a true boolean was passed in for 'isCartButtonsOnModal' then show the 'Remove item' button */}
        {isCartButtonsOnModal &&
            <div className="remove-item-container" onClick={removeOrder}>
                <h4>
                    Remove item
                </h4>
            </div>}
        <article className="quantity-and-add-to-cart-container">
            <article className="add-to-cart-button-quantity-button-container">
                {/* will  disabled the minus button only if the count is at one*/}
                <div className="quantity-button">
                    {isMinusButtonDisabled ?
                        <div className="minus-sign">
                            -
                        </div>
                        :
                        <div className="minus-sign" onClick={decreaseCount}>
                            -
                        </div>
                    }
                    <div className="count">{orderCount}</div>
                    <div className="plus-sign" onClick={increaseCount}>
                        +
                    </div>
                </div>
                {/* will have the update order button on the UI only if a true boolean was passed in for the isCartButtonsOnModal prop */}
                {isCartButtonsOnModal ?
                    <div className="update-order-button" onClick={updateOrder}>
                        <div>
                            Update
                        </div>
                        <div>
                            Order
                        </div>
                        {orderPriceTotal > meatItemInfo.price ?
                            <div>
                                ${orderPriceTotal}
                            </div>
                            :
                            <div>
                                ${meatItemInfo.price.toFixed(2)}
                            </div>
                        }
                    </div>
                    :
                    <div className="add-to-cart-button">
                        <div>
                            Add
                        </div>
                        <div className="count">{orderCount}</div>
                        <div>
                            to order
                        </div>
                        {orderPriceTotal > meatItemInfo.price ?
                            <div>
                                {orderPriceTotal}
                            </div>
                            :
                            <div>
                                {meatItemInfo.price.toFixed(2)}
                            </div>
                        }
                    </div>
                }
            </article>
        </article>
    </section>
}

export default MeatItemModal
