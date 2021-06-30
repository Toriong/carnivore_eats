import React, { useState, createContext } from 'react'

export const IsModalOpenContext = createContext()

// the conditionals for opening a modal and what will be displayed on the modal
export const IsModalOpenProvider = (props) => {

    // the conditionals for opening the modal
    const [isModalWithCartInfoOpen, setIsModalWithCartInfoOpen] = useState(false);
    // is the meat item modal displaying the meat item from the search bar? 
    const [isMeatModalFromSearchBarOpen, setIsMeatModalFromSearchBarOpen] = useState(false);
    const [isSearchResultsContainerOpen, setIsSearchResultsContainerOpen] = useState(false);
    const [isNavModalOpen, setIsNavModalOpen] = useState(false);

    return <IsModalOpenContext.Provider value={{
        _openMeatItemModalFromSearchBar: [isMeatModalFromSearchBarOpen, setIsMeatModalFromSearchBarOpen],
        _isModalWithCartInfoOpen: [isModalWithCartInfoOpen, setIsModalWithCartInfoOpen],
        _isOrderMeatOrGoToRestrModalOpen: [isNavModalOpen, setIsNavModalOpen],
        _isSearchResultsContainerOpen: [isSearchResultsContainerOpen, setIsSearchResultsContainerOpen],
    }}>
        {props.children}
    </IsModalOpenContext.Provider>
};


