import React, { useState, useEffect, useContext } from 'react';
import MeatItemModal from './MeatItemModal'
import '../css/meat.css'

const Meat = ({ meatItem }) => {
    const [isMeatItemModalOpen, setIsMeatItemModalOpen] = useState(false);
    const defaultOrder = {
        quantity: 1,
        meatItemId: meatItem.id
    }
    const [order, setOrder] = useState(defaultOrder);

    const cancelOrder = () => {
        setIsMeatItemModalOpen(false);
    }

    const openMeatItemModal = () => {
        setIsMeatItemModalOpen(true);
    }



    return isMeatItemModalOpen ? <>
        <div className="blocker" onClick={cancelOrder} />
        <MeatItemModal
            order={order}
            setOrder={setOrder}
            setIsMeatItemModalOpen={setIsMeatItemModalOpen}
        />
        <section className="meatItem">
            <div className="nameAndPriceContainer">
                <h4>{meatItem.name}</h4>
                <span>${meatItem.price.toFixed(2)}</span>
            </div>
            <div className="meatItemImageContainer">
                <img src={meatItem.image} alt={meatItem.alt} />
            </div>
        </section>
    </>
        :
        <section className="meatItem" onClick={openMeatItemModal}>
            <div className="nameAndPriceContainer">
                <h4>{meatItem.name}</h4>
                <span>${meatItem.price.toFixed(2)}</span>
            </div>
            <div className="meatItemImageContainer">
                <img src={meatItem.image} alt={meatItem.alt} />
            </div>
        </section>

}

export default Meat;