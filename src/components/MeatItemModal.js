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

    // will store the info that will be edited by the user (having the quantity of the order be changed or an add-on keyName inserted into the order)
    const [orderInfo_, setOrderInfo_] = useState(orderInfo);

    // will store all of the info pertaining to the restaurant of the selected meatItem
    const restaurantInfo = meatShops.find((restaurant) => restaurant.name === orderInfo.restaurant);

    const addOnMenuToggle = () => {
        setIsAddOnMenuOpen(!isAddOnMenuOpen);
    };

    const decreaseCount = () => {
        setOrderCount(orderCount - 1);
        // set the state value to true in order to update the total price of the user's order
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
        // will close the cart modal assuming that the user wants to access the menu of a restaurant after deleting the order from their cart
        setIsCartOpen(false);
    };

    // will respond to the user pressing the update button
    const updateOrder = () => {
        // will check if there are any add-ons in the order
        if (orderInfo_.addOns) {
            // will check if the array that is in the addOns key of the order is empty
            const noAddOnsArePresent = orderInfo_.addOns.length === 0;
            if (noAddOnsArePresent) {
                setOrderInfo_(delete orderInfo_.addOns);
            };
        };
        // will update the selected order via its ID 
        const updatedOrder = cartOrdersInfo.map((order) => {
            if (order.orderId === orderInfo_.orderId) {
                return {
                    // using the spread operator will also inlcude any of the add-ons that the user may have
                    ...orderInfo_,
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
    // used 'var' so 'addOnsSum' can be accessed globally
    // used var in order to store the sum of the addOns if there any in the user's order
    // if no add-ons, default value will be zero in order to act as a placeholder when computing the total price of the user's order in 'cartOrderPriceTotal'
    var addOnsSum = 0;

    // will check if there exist an addOn key in the meatOrder state value
    if (orderInfo_.addOns) {
        // will get the addOn prices of the add-ons that the user selected
        const addOnsPrices = restaurantInfo.add_ons.map((addOnInfo) => getPriceOfAddOn(addOnInfo, orderInfo_));
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
    // useEffect will run when the quantity button or the add-on button has been pressed
    useEffect(() => {
        if (wasAddOnOrCountBtnPressed) {
            const cartOrderPriceTotal = (meatItemInfo.price + addOnsSum) * orderCount;
            // without the conditional, 'orderCount' will be reseted back to its default (1)
            // poses a problem when I open a cart order in the MeatItemModal
            setOrderPriceTotal(cartOrderPriceTotal.toFixed(2));
            setWasAddOnOrCountBtnPressed(false);
        };
    }, [wasAddOnOrCountBtnPressed, orderInfo_, addOnsSum, meatItemInfo.price, orderCount]);

    // will present the cart order info onto the modal on the initial render of this component when the component was invoked from the Cart component
    useEffect(() => {
        // provided a conditional since I want the info on the meat item modal to display all of the cart info only if the user clicked on a cart order 
        if (isMeatModalOpenWithCartInfo) {
            const cartOrderPriceTotal = (meatItemInfo.price + addOnsSum) * orderInfo_.quantity;
            setOrderCount(orderInfo_.quantity);
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
                                order={orderInfo_}
                                setOrder={setOrderInfo_}
                                // if the user clicked on an add-on button, it will set 'wasAddOnOrCountBtnPressed' in order to update the total price of the user's order. 
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
                    /* if isCartButtonsOnModal is false or undefined, then present the 'Add to cart' button   */
                    <div className="add-to-cart-button">
                        <div>
                            Add
                        </div>
                        <div className="count">{orderCount}</div>
                        <div>
                            to cart
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
