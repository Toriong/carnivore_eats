import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import meatShops from '../data/Meat-Shops.json';
import AddOnItem from '../components/AddOnItem';
import getAddOnsInfo from '../functions/getAddOnsInfo';
import { CartInfoContext } from '../providers/CartInfoProvider';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import '../css/meatItemModal.css'



// NOTES:
// -where all of the computations/editing for an order will occur
// selectedOrder will take in the following object if it was opened from the Restaurant component:
// {
//  meatItemId: (id of the meat item)
//  restaurant: (name of restaurant)
// }
// need to use the meatItem variable in order to display the info of the meat item when the user clicks on the meat item from the restaurant menu page 


const MeatItemModal = ({ meatItem, setMeatItem, isCartButtonsOnModal, setIsMeatItemModalOpen, setIsCartOpen }) => {
    const { _cartOrders } = useContext(CartInfoContext);
    const [cartOrders, setCartOrders] = _cartOrders;
    const defaultOrderCount = meatItem.quantity ? meatItem.quantity : 1
    const [orderCount, setOrderCount] = useState(defaultOrderCount);
    const [orderPriceTotal, setOrderPriceTotal] = useState(0);
    const [isAddOnMenuOpen, setIsAddOnMenuOpen] = useState(false);
    const restaurant = meatShops.find(restaurant => restaurant.name === cartOrders.restaurant);
    let meatItemInfo = restaurant.main_meats.find(meat => meat.id === meatItem.meatItemId);


    const toggleAddOnMenu = () => {
        setIsAddOnMenuOpen(!isAddOnMenuOpen);
    };

    const clickQuantityButton = quantity => () => {
        setOrderCount(quantity);
    }

    const removeOrder = () => {
        const updatedCartOrders = cartOrders.orders.filter((order) => order.orderId !== meatItem.orderId);
        setCartOrders({
            ...cartOrders,
            orders: updatedCartOrders
        })
        setIsMeatItemModalOpen(false);
    };

    const updateOrder = () => {
        const updatedCartOrders = cartOrders.orders.map(cartOrder_ => {
            if (cartOrder_.orderId === meatItem.orderId) {
                return {
                    ...meatItem,
                    quantity: orderCount
                }
            };

            return cartOrder_;
        });
        setCartOrders({
            ...cartOrders,
            orders: updatedCartOrders
        });
        setIsMeatItemModalOpen(false);
        setIsCartOpen(true);
    };

    const computeOrderPrice = () => {
        const { totalPrice: addOnsTotalPrice } = getAddOnsInfo(meatItem, restaurant, orderCount);
        const meatItemTotalPrice = meatItemInfo.price * orderCount;
        setOrderPriceTotal((meatItemTotalPrice + addOnsTotalPrice).toFixed(2));
    }

    useEffect(() => {
        computeOrderPrice()
    }, [orderCount]);

    useEffect(() => {
        if (meatItem.orderId) {
            setIsAddOnMenuOpen(true);
        }
    }, []);

    return <section className="selected-food-modal">
        <section className="picture-container">
            <img src={meatItemInfo.image} alt={meatItemInfo.alt} />
        </section>
        <section className="food-title-container">
            <h1>{meatItemInfo.name}</h1>
        </section>
        {isAddOnMenuOpen ?
            <>
                <span className="add-ons-text">
                    <h4>Add-ons:</h4>
                    <FaAngleDown onClick={toggleAddOnMenu} />
                </span>
                <ul className="add-ons-list-container">
                    {restaurant.add_ons.map((addOnItem) =>
                        <AddOnItem
                            addOnItem={addOnItem}
                            meatItem={meatItem}
                            setMeatItem={setMeatItem}
                            computeOrderPrice={computeOrderPrice}
                        />
                    )}
                </ul>
            </>
            :
            <span className="add-ons-text">
                <h4>Add-ons:</h4>
                <FaAngleUp onClick={toggleAddOnMenu} />
            </span>
        }
        <section className="quantity-and-add-to-cart-container">
            <span className="quantity-button-container">
                <button className="quantity-button" disabled={orderCount <= 1} onClick={clickQuantityButton(orderCount - 1)}>-</button>

                <div className="quantity-count">{orderCount}</div>

                <button className="quantity-button" onClick={clickQuantityButton(orderCount + 1)}>+</button>

                {
                    isCartButtonsOnModal
                        ?
                        <button className="add-to-cart-button"
                            onClick={updateOrder}
                        >
                            <span>Update Order</span>
                            <div className="orderPriceTotal"> ${orderPriceTotal}</div>
                        </button>
                        :
                        <button className="add-to-cart-button" onClick>
                            <span>Add {orderCount} to cart</span>
                            {orderPriceTotal > meatItem.price
                                ?
                                <div className="orderPriceTotal"> ${orderPriceTotal}</div>
                                :
                                <div className="orderPriceTotal"> ${meatItem.price.toFixed(2)}</div>
                            }
                        </button>
                }

            </span>
        </section>
        {isCartButtonsOnModal &&
            <section className="remove-item-button-container">
                <button className="remove-item-button"
                    onClick={removeOrder}
                >
                    <h4>Remove item</h4>
                </button>
            </section>
        }
    </section>
}

export default MeatItemModal;
