import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons'




// will list all of the add-ons of the selected restaurant
const AddOnItem = ({ addOnItem, orderFromCart, setOrderFromCart }) => {

    const [boxClicked, setBoxClicked] = useState(false);

    // will add an add-on to the user's order
    const addAddOnToOrder = () => {
        // check if there is an existing add-on in the orderFromCart object, if there is then use the spread operator to add another add-on to the existing list
        const newAddOn = addOnItem.id
        const updatedAddOnList = orderFromCart.addOns ? [...orderFromCart.addOns, newAddOn] : [newAddOn]
        setOrderFromCart({
            ...orderFromCart,
            addOns: updatedAddOnList
        });
        setBoxClicked(!boxClicked);
    };

    // deletes an addOn from user's order
    const deleteAddOnFromOrder = () => {
        const deleteThisAddOn = addOnItem.id
        const updatedAddOnList = orderFromCart.addOns.filter((addOnId) => addOnId !== deleteThisAddOn)
        setOrderFromCart({
            ...orderFromCart,
            addOns: updatedAddOnList
        });
        setBoxClicked(!boxClicked);
    };

    // check off the addOn box on the initial render of the component if there are any addOns
    useEffect(() => {
        if (orderFromCart.addOns) {
            orderFromCart.addOns.forEach((addOnId) => {
                if (addOnId === addOnItem.id) {
                    setBoxClicked(true);
                };
            })
        }
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
