import React from 'react';
import { Link } from 'react-router-dom';
import restaurants from '../data/Meat-Shops.json'
import '../css/restaurant.css'


const Restaurants = () => {
  return <>
    <h1 id="restaurantsPageTitle">Restaurants near you</h1>
    <div className="restaurants-list-container">
      {restaurants.map(res => {
        return <Link to={`/menu/${res.url}`}>
          <section className="restaurant-container">
            <div className="image-container">
              <img src={res.image} alt={res.alt} />
            </div>
            <div className="info-container">
              <h5>{res.name}</h5>
            </div>
          </section>
        </Link>
      })
      }
    </div>
  </>
}



export default Restaurants;
