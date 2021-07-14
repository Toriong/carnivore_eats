import React, { useEffect, useState, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons'
import '../css/addOnItem.css'


const AddOnItem = ({ addOnItem, meatItem, computeOrderPrice, setMeatItem }) => {
    const [boxClicked, setBoxClicked] = useState(false);

    const addAddOnToOrder = () => {
        const addOns_ = meatItem.addOns ? [...meatItem.addOns, addOnItem.id] : [addOnItem.id]
        setMeatItem({
            ...meatItem,
            addOns: addOns_
        });
        setBoxClicked(!boxClicked);
    };

    const deleteAddOnFromOrder = () => {
        const addOns_ = meatItem.addOns.filter(addOnId => addOnId !== addOnItem.id);
        if (!addOns_.length) {
            delete meatItem.addOns
        } else {
            setMeatItem({
                ...meatItem,
                addOns: addOns_
            });
        }
        setBoxClicked(!boxClicked);
    };

    useEffect(() => {
        computeOrderPrice()
    }, [boxClicked]);

    useEffect(() => {
        if (meatItem.addOns) {
            const addOn = meatItem.addOns.find(addOnId => addOnId === addOnItem.id);
            if (addOn) {
                setBoxClicked(true);
            }
        }
    }, [])

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
