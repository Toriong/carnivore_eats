import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons'




// will list all of the add-ons of the selected restaurant when a meat item is selected from the menu component or when a cart order is clicked from the cart modal
const AddOnItem = ({ addOnItem, order, setOrder, setWasAddOnOrCountBtnPressed }) => {

    const [boxClicked, setBoxClicked] = useState(false);

    // will add an add-on to the user's order
    const addAddOnToOrder = () => {
        // check if there is an existing add-on in the orderFromCart object, if there is then use the spread operator to add another add-on to the existing list
        const newAddOn = addOnItem.id
        // if there are no addOn in the c
        const addOnList = order.addOns ? [...order.addOns, newAddOn] : [newAddOn]
        setOrder({
            ...order,
            addOns: addOnList
        });
        setBoxClicked(!boxClicked);
        // when true, it will updated the total price of the order within the MeatItemModal component
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

    // check off the addOn box on the initial render of the component if there are any addOns
    // did this to show to the user what add-ons are part of their order when the meat item modal is presented onto the UI
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
