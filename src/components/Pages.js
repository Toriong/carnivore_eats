import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Menu from './Menu';
import Restaurants from './Restaurants';
import NavBar from "./NavBar"
import Footer from './Footer'
import CheckoutPage from './CheckoutPage'
import Restaurant from './Restaurants';

const Pages = () => {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route exact path="/" component={Restaurant} />
                <Route exact path="/menu/:restaurant_" component={Menu} />
            </Switch>
            <Footer />
        </Router>
    )
}


export default Pages;