import React, { useEffect, useState, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons'


// when the user clicks on an order from the cart, have the add-ons be computed and have the box of the particular be checked

// passed down computeConfirmedAddOns and its function
// pass down the id of the addOnItem
const AddOnItem = ({ addOnItem, mainMeatCount, setOrderTotal, meatItemInfoPrice, confirmedAddOnsInfoInCart, orderTotal, setAddOns, addOns, computeConfirmedAddOns, setComputeConfirmedAddOns }) => {
    // check for matching names in the selectedAddOns and addOnItem.name. If the names match then set boxClicked to true.

    const [boxClicked, setBoxClicked] = useState(false);

    // pass down function that will keep track of what add-ons that are selected by the user. Call this function addOns and create in the MeatItem modal.
    const addOnAddedToOrder = () => {
        // find a way to first get the id of the addOn that was clicked, second, use it to find the add-on in the array that holds all of the add-ons in the object that holds all of the info the restaurant. 
        setAddOns([...addOns, {
            name: addOnItem.name,
            price: addOnItem.price
        }]);
        setBoxClicked(!boxClicked);
    };

    // deletes an addOn from user's order
    const addOnTakenOffOrder = () => {
        setBoxClicked(!boxClicked);
        setAddOns(addOns.filter((addOn) => addOn.name !== addOnItem.name
        ));
    };

    // adds the price of the addOns to the total price of the order 
    useEffect(() => {
        setOrderTotal(((mainMeatCount * meatItemInfoPrice) + (addOns.map((addOn) => addOn.price).reduce((priceN, priceNPlus1) => priceN + priceNPlus1) * mainMeatCount)).toFixed(2));
    }, [boxClicked, mainMeatCount, meatItemInfoPrice, setOrderTotal]);

    useEffect(() => {
        if (confirmedAddOnsInfoInCart.length !== 0 && computeConfirmedAddOns) {
            confirmedAddOnsInfoInCart.forEach((addOn) => {
                if (addOn.name === addOnItem.name) {
                    setBoxClicked(true);
                };
            });
        }
    }, [confirmedAddOnsInfoInCart, addOnItem]);

    // compute the sum of the add-ons, times it by the quantity of the order, and add it to the product between the quantity of the order and the price of the meat 
    useEffect(() => {
        // console.log(selectedAddOnsInfoToOrder)
        if (computeConfirmedAddOns) {
            setOrderTotal(orderTotal + (mainMeatCount * (confirmedAddOnsInfoInCart.map((addOn) => addOn.price)).reduce((priceN, priceNMinus1) => priceN + priceNMinus1)))
            //put the cart add-ons here
            setAddOns([...addOns, ...confirmedAddOnsInfoInCart.map((addOn) => addOn)]);
            setComputeConfirmedAddOns(false);
        }
    }, [computeConfirmedAddOns, confirmedAddOnsInfoInCart, mainMeatCount, orderTotal, setOrderTotal,]);

    return <div className="add-on">
        <div className="check-container">
            {boxClicked ?
                <FontAwesomeIcon icon={faCheckSquare} onClick={() => { addOnTakenOffOrder(addOnItem.price) }} />
                :
                <FontAwesomeIcon icon={faSquare} onClick={addOnAddedToOrder} />
            }
        </div>
        <div className="add-on-name">
            <h1>{addOnItem.name}</h1>
        </div>
        <div>
            +{addOnItem.price}
        </div>
    </div>
}

export default AddOnItem
