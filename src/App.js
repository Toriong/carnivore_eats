import React from 'react';
import Pages from "./components/Pages";
import { IsModalOpenProvider } from './providers/IsModalOpenProvider';
import { CartInfoProvider } from "./providers/CartInfoProvider";





const App = () => {

    return <IsModalOpenProvider>
        <CartInfoProvider>
            <Pages />
        </CartInfoProvider>
    </IsModalOpenProvider>
};

export default App
