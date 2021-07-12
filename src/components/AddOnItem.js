import React, { useEffect, useState, useContext } from 'react'
import { CartInfoContext } from '../providers/CartInfoProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons'
import '../css/addOnItem.css'


const AddOnItem = ({ addOnItem, orderId, setAddOnBtnToggle }) => {
    const { _cartOrders } = useContext(CartInfoContext);
    const [cartOrders, setCartOrders] = _cartOrders;
    const [boxClicked, setBoxClicked] = useState(false);


    const addAddOnToOrder = () => {
        const updatedOrders = cartOrders.orders.map((order) => {
            if (order.orderId === orderId) {
                if (order.addOns) {
                    return {
                        ...order,
                        addOns: [...order.addOns, addOnItem.id]
                    }
                } else {
                    return {
                        ...order,
                        addOns: [addOnItem.id]
                    }
                }
            }

            return order
        });

        setCartOrders({
            ...cartOrders,
            orders: updatedOrders
        });
        setAddOnBtnToggle()
        setBoxClicked(!boxClicked);
    };

    const deleteAddOnFromOrder = () => {
        const updatedCartOrders = cartOrders.orders.map(order_ => {
            if (order_.orderId === orderId) {
                const addOnsUpdated = order_.addOns.filter(addOnId => addOnId !== addOnItem.id)
                if (!addOnsUpdated.length) {
                    delete order_.addOns
                } else {
                    return {
                        ...order_,
                        addOns: addOnsUpdated
                    }
                }
            }

            return order_
        });

        setCartOrders({
            ...cartOrders,
            orders: updatedCartOrders
        });
        setAddOnBtnToggle();
        setBoxClicked(!boxClicked);
    };

    useEffect(() => {
        cartOrders.orders.forEach((order) => {
            if (order.orderId === orderId) {
                if (order.addOns) {
                    order.addOns.forEach((addOnId) => {
                        if (addOnId === addOnItem.id) {
                            setBoxClicked(true);
                        }
                    })
                }
            }
        });

    }, []);

    return <li className="add-on">
        {boxClicked ?
            <FontAwesomeIcon icon={faCheckSquare}
                onClick={deleteAddOnFromOrder}

            />
            :
            <FontAwesomeIcon icon={faSquare} onClick={addAddOnToOrder} />
        }
        <span className="addOn-name">{addOnItem.name} </span>
        <span className="addOn-price">+${(addOnItem.price).toFixed(2)}</span>
    </li>
}

export default AddOnItem
