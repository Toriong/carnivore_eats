import React, { useEffect, useState, useContext } from 'react'
import meatShops from '../data/Meat-Shops.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons'
import { CartInfoContext } from '../providers/CartInfoProvider'



// when the user clicks on an order from the cart, have the add-ons be computed and have the box of the particular be checked

// passed down computeConfirmedAddOns and its function
// pass down the id of the addOnItem
const AddOnItem = ({ addOnItem, mainMeatCount, setOrderTotal, meatItemInfoPrice, confirmedAddOnsInfoInCart, orderTotal, setAddOns, addOns, computeConfirmedAddOns, setComputeConfirmedAddOns, orderFromCart, setOrderFromCart }) => {

    const { _confirmedOrdersInfo } = useContext(CartInfoContext);

    const [confirmedOrdersInfo, setConfirmedOrdersInfo] = _confirmedOrdersInfo;

    const [boxClicked, setBoxClicked] = useState(false);
    const restaurantInfo = meatShops.find((restaurant) => restaurant.name === confirmedOrdersInfo[0].restaurant);

    // when this function is executed, create a new keyName value pair in the object that is stored in orderFromCart, call this keyName 'addOn', insert the id of the addOn there
    // get the id of the add-on that was selected
    const addOnAddedToOrder = () => {
        // check if there is an existing add-on in the orderFromCart object, if there is then use the spread operator to add another add-on to the existing list
        const updatedAddOnList = orderFromCart.addOns !== undefined ? [...orderFromCart.addOns, addOnItem.id] : [addOnItem.id]
        setOrderFromCart({
            ...orderFromCart,
            addOns: updatedAddOnList
        });
        setBoxClicked(!boxClicked);
    };

    // deletes an addOn from user's order
    const addOnTakenOffOrder = () => {
        // if there is only one add-on in the array that is stored in orderFromCart.addOns, then delete the whole key-name value pair of the addOn
        const updatedAddOnList = orderFromCart.addOns.filter((addOnId) => addOnId !== addOnItem.id)
        setOrderFromCart({
            ...orderFromCart,
            addOns: updatedAddOnList
        });

        console.log(orderFromCart);
        setBoxClicked(!boxClicked);
    };



    // checking off the box
    useEffect(() => {
        if (orderFromCart.addOns !== undefined) {
            orderFromCart.addOns.forEach((addOnId) => {
                if (addOnId === addOnItem.id) {
                    setBoxClicked(true);
                }
            })
        }
    }, []);



    return <div className="add-on">
        <div className="check-container">
            {boxClicked ?
                <FontAwesomeIcon icon={faCheckSquare} onClick={addOnTakenOffOrder} />
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
