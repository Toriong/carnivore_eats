import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons'





const AddOnItem = ({ addOnItem, order, setOrder, setWasAddOnOrCountBtnPressed }) => {

    const [boxClicked, setBoxClicked] = useState(false);

    // will add an add-on to the user's order
    const addAddOnToOrder = () => {
        const newAddOn = addOnItem.id
        const addOnList = order.addOns ? [...order.addOns, newAddOn] : [newAddOn]
        setOrder({
            ...order,
            addOns: addOnList
        });
        setBoxClicked(!boxClicked);
        setWasAddOnOrCountBtnPressed(true);
    };

    // deletes an addOn from user's order
    const deleteAddOnFromOrder = () => {
        const deleteThisAddOn = addOnItem.id
        const updatedAddOnList = order.addOns.filter((addOnId) => addOnId !== deleteThisAddOn)
        setOrder({
            ...order,
            addOns: updatedAddOnList
        });
        setBoxClicked(!boxClicked);
        setWasAddOnOrCountBtnPressed(true);
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


    return <article className="add-on">
        <div className="check-container">
            {boxClicked ?
                <FontAwesomeIcon icon={faCheckSquare} onClick={deleteAddOnFromOrder} />
                :
                <FontAwesomeIcon icon={faSquare} onClick={addAddOnToOrder} />
            }
        </div>
        <div className="add-on-name">
            <h1>{addOnItem.name}</h1>
        </div>
        <div>
            +{addOnItem.price}
        </div>
    </article>
}

export default AddOnItem
