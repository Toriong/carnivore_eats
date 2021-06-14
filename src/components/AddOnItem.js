import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons'





const AddOnItem = ({ addOnItem, order, setOrder, setWasAddOnOrCountBtnPressed }) => {

    const [boxClicked, setBoxClicked] = useState(false);

    // will add an add-on to the user's order
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
        // compute the total price of order
        setWasAddOnOrCountBtnPressed(true);
    };

    // deletes an addOn from user's order
    const deleteAddOnFromOrder = () => {
        const addOns = order.addOns.filter((addOnId) => addOnId !== addOnItem.id)
        setOrder({
            ...order,
            addOns: addOns
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
