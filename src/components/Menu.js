import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartInfoContext } from '../providers/CartInfoProvider';
import restaurants from '../data/Meat-Shops.json'
import Meat from './Meat';
import '../css/menu.css'



// menu page
// shows all of the meat items of the restaurant 
const Menu = () => {
    const { restaurant_ } = useParams();
    const restaurant = restaurants.find(res => res.url === restaurant_);

    return <div className="items">
        {/* insert logo or pic of restaurant here */}
        <section className="title-container">
            <h1>{restaurant.name}</h1>
        </section>
        <section className="meatItems-container">
            {restaurant.main_meats.map(meat => {
                return <Meat meatItem={meat} />
            })}
        </section>
    </div>
}

export default Menu;

