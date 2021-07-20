import React, { useState, useEffect, useContext } from 'react';
import meatShops from '../data/Meat-Shops.json';
import AddOnItem from '../components/AddOnItem';
import getAddOnsInfo from '../functions/getAddOnsInfo';
import { CartInfoContext } from '../providers/CartInfoProvider';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import '../css/meatItemModal.css'



// NOTES:
// -where all of the computations/editing for an order will occur



// 'order' from restauaddrant component
// {
//     meatItem: "id of meat item",
//     quantity: 1
// }

const MeatItemModal = ({ order, setOrder, isCartButtonsOnModal, setIsMeatItemModalOpen, setIsCartOpen }) => {
    const { _cartOrders } = useContext(CartInfoContext);
    const [cartOrders, setCartOrders] = _cartOrders;
    const [orderCount, setOrderCount] = useState(order.quantity);
    const [orderPriceTotal, setOrderPriceTotal] = useState(0);
    const [isAddOnMenuOpen, setIsAddOnMenuOpen] = useState(false);
    const [computeOrderToggle, setComputeOrderToggle] = useState(false)
    const restaurant = meatShops.find(restaurant => restaurant.name === cartOrders.restaurant);
    const meatItemInfo = restaurant.main_meats.find(meat => meat.id === order.meatItemId);

    const toggleAddOnMenu = () => {
        setIsAddOnMenuOpen(!isAddOnMenuOpen);
    };

    const clickQuantityButton = quantity => () => {
        setOrderCount(quantity);
    }

    const removeOrder = () => {
        const updatedCartOrders = cartOrders.orders.filter(order_ => order_.orderId !== order.orderId);
        setCartOrders({
            ...cartOrders,
            orders: updatedCartOrders
        })
        setIsMeatItemModalOpen(false);
    };

    const updateOrder = () => {
        const updatedCartOrders = cartOrders.orders.map(cartOrder_ => {
            if (cartOrder_.orderId === order.orderId) {
                if (order.addOns) {
                    if (!order.addOns.length) {
                        delete order.addOns;
                    }
                }
                console.log(order);
                return {
                    ...order,
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

    useEffect(() => {
        let addOnsTotalPrice;
        if (order.addOns) {
            addOnsTotalPrice = getAddOnsInfo(order, restaurant, orderCount)._addOnsTotalPrice;
        }
        const meatItemTotalPrice = meatItemInfo.price * orderCount;
        const orderTotalPrice_ = meatItemTotalPrice + (addOnsTotalPrice ?? 0);
        setOrderPriceTotal(orderTotalPrice_.toFixed(2));
    }, [orderCount, computeOrderToggle]);

    useEffect(() => {
        if (order.orderId) {
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
                    {restaurant.add_ons.map(addOnItem =>
                        <AddOnItem
                            addOnItem={addOnItem}
                            order={order}
                            setOrder={setOrder}
                            computeOrderToggle={() => setComputeOrderToggle(!computeOrderToggle)}
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
                            {orderPriceTotal > meatItemInfo.price
                                ?
                                <div className="orderPriceTotal"> ${orderPriceTotal}</div>
                                :
                                <div className="orderPriceTotal"> ${meatItemInfo.price.toFixed(2)}</div>
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
