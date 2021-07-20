import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons'
import '../css/addOnItem.css'


const AddOnItem = ({ addOnItem, order, computeTotalOrderPrice, setOrder }) => {
    const [isAddOnOnOrder, setIsAddOnOnOrder] = useState(false);

    const addAddOnToOrder = () => {
        const addOns_ = order.addOns ? [...order.addOns, addOnItem.id] : [addOnItem.id]
        setOrder({
            ...order,
            addOns: addOns_
        });
        setIsAddOnOnOrder(!isAddOnOnOrder);
    };

    const deleteAddOnFromOrder = () => {
        const addOns_ = order.addOns.filter(addOnId => addOnId !== addOnItem.id);
        if (!addOns_.length) {
            delete order.addOns
        } else {
            setOrder({
                ...order,
                addOns: addOns_
            });
        }
        setIsAddOnOnOrder(!isAddOnOnOrder);
    };


    useEffect(() => {
        computeTotalOrderPrice()
    }, [isAddOnOnOrder]);

    useEffect(() => {
        if (order.addOns) {
            const addOn = order.addOns.find(addOnId => addOnId === addOnItem.id);
            if (addOn) {
                setIsAddOnOnOrder(true);
            }
        }
    }, [])

    return <li className="add-on">
        {isAddOnOnOrder ?
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
