import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartInfoContext } from '../providers/CartInfoProvider';
import { IsModalOpenContext } from '../providers/IsModalOpenProvider'
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import meatShops from '../data/Meat-Shops.json';
import AddOnItem from '../components/AddOnItem';
import getAddOnsInfo from '../functions/getAddOnsInfo';
import '../css/meatItemModal.css'


const MeatItemModal = ({ order, setOrder, isCartButtonsOnModal, setIsMeatItemModalOpen }) => {
    const { restaurant_ } = useParams();
    const { _cartOrders } = useContext(CartInfoContext);
    const { _isCartOpen } = useContext(IsModalOpenContext);
    const [cartOrders, setCartOrders] = _cartOrders;
    const [, setIsCartOpen] = _isCartOpen;
    const [orderCount, setOrderCount] = useState(order.quantity);
    const [orderPriceTotal, setOrderPriceTotal] = useState(0);
    const [isAddOnMenuOpen, setIsAddOnMenuOpen] = useState(false);
    const [computeOrderToggle, setComputeOrderToggle] = useState(false)
    const restaurant = meatShops.find(res => isCartButtonsOnModal ? res.name === cartOrders.restaurant : res.url === restaurant_);
    const meatItemInfo = restaurant.main_meats.find(meat => meat.id === order.meatItemId);

    const toggleAddOnMenu = () => {
        setIsAddOnMenuOpen(!isAddOnMenuOpen);
    };

    const clickQuantityButton = quantity => () => {
        setOrderCount(quantity);
    }

    const removeOrder = event => {
        event.preventDefault();
        const updatedCartOrders = cartOrders.orders.filter(order_ => order_.orderId !== order.orderId);
        setCartOrders({
            ...cartOrders,
            orders: updatedCartOrders
        })
        setIsMeatItemModalOpen(false);
    };

    const updateOrder = event => {
        event.preventDefault();
        const updatedCartOrders = cartOrders.orders.map(cartOrder_ => {
            if (cartOrder_.orderId === order.orderId) {
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

    const addToCart = event => {
        event.preventDefault();
        const newOrder = {
            orderId: Math.random().toString(16).slice(2),
            ...order,
            quantity: orderCount
        }
        const orders_ = [...cartOrders.orders, newOrder];
        setCartOrders({
            ...cartOrders,
            orders: orders_
        });
        setIsMeatItemModalOpen(false);
        setIsCartOpen(true);
    }

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

    return <section className={isCartButtonsOnModal ? "selected-food-modal cart" : "selected-food-modal"}>
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
                            onClick={event => { updateOrder(event) }}
                        >
                            <span>Update Order</span>
                            <div className="orderPriceTotal"> ${orderPriceTotal}</div>
                        </button>
                        :
                        <button className="add-to-cart-button"
                            onClick={event => { addToCart(event) }}
                        >
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
                    onClick={event => { removeOrder(event) }}
                >
                    <h4>Remove item</h4>
                </button>
            </section>
        }
    </section>
}

export default MeatItemModal;
