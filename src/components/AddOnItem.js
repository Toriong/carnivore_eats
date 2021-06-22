import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons'
import '../css/addOnItem.css'





const AddOnItem = ({ addOnItem, order, setOrder, computeOrderTotalPrice }) => {

    const [boxClicked, setBoxClicked] = useState(false);

    const addAddOnToOrder = () => {
        let addOns;
        if (order.addOns) {
            addOns = [...order.addOns, addOnItem.id]
        } else {
            addOns = [addOnItem.id]
        }
        setOrder({
            ...order,
            addOns: addOns
        });
        setBoxClicked(!boxClicked);
    };

    const deleteAddOnFromOrder = () => {
        const addOns = order.addOns.filter((addOnId) => addOnId !== addOnItem.id)
        setOrder({
            ...order,
            addOns: addOns
        });
        setBoxClicked(!boxClicked);
    };


    useEffect(() => {
        if (order.addOns) {
            order.addOns.forEach((addOnId) => {
                if (addOnId === addOnItem.id) {
                    setBoxClicked(true);
                };
            });
        };
    }, []);

    useEffect(() => {
        computeOrderTotalPrice()
    }, [boxClicked, computeOrderTotalPrice]);

    return <li className="add-on">
        {boxClicked ?
            <FontAwesomeIcon icon={faCheckSquare} onClick={deleteAddOnFromOrder} />
            :
            <FontAwesomeIcon icon={faSquare} onClick={addAddOnToOrder} />
        }
        <span className="addOn-name">{addOnItem.name} </span>
        <span className="addOn-price">+${(addOnItem.price).toFixed(2)}</span>
    </li>
}

export default AddOnItem
