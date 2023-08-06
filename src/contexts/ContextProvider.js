import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

const initialState = {
    chat: false,
    cart: false,
    userProfile: false,
    notification: false,
}

export const ContextProvider = ({ children }) => {
    const [activeMenu, setActiveMenu] = useState(true);
    const [isClicked, setIsClicked] = useState(initialState);
    const [screenSize, setScreenSize] = useState(undefined);
    const [currentColor, setCurrentColor] = useState('#03C9D7')
    const [currentMode, setCurrentMode] = useState('Light')
    const [themeSettings, setThemeSettings] = useState(false)
    const [isLogin, setIsLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [localhostUrl, setlocalhostUrl] = useState('https://localhost:7069');

    const [urllogin, seturllogin] = useState(`${localhostUrl}/Member/login`);

    //common
    const [urlgetTodolistTypes, setgetTodolistTypes] = useState(`${localhostUrl}/Common/getTodolistTypes`);
    const [urlgetDSTransTypes, seturlgetDSTransTypes] = useState(`${localhostUrl}/Common/getDSTransTypes`);

    //todolist
    const [urlTodolistDone, seturlTodolistDone] = useState(`${localhostUrl}/TodolistDone`);

    //ds account
    const [urldsAccont, seturldsAccont] = useState(`${localhostUrl}/DSAccount`);

    //dsItem
    const [urlDSItem, seturlDSItem] = useState(`${localhostUrl}/DSItem`);
    const [urlgetDSItemWithSub, seturlgetDSItemWithSub] = useState(`${urlDSItem}/getDSItemWithSub`);
    const [urlgetDSItemWithSubV3, seturlgetDSItemWithSubV3] = useState(`${urlDSItem}/getDSItemWithSubV3`);
    const [urladdWithSubItem, seturladdWithSubItem] = useState(`${urlDSItem}/addWithSubItem`);

    //dsItemSub
    const [urlDSItemSub, seturlDSItemSub] = useState(`${localhostUrl}/DSItemSub`);

    //dsTrans
    const [urlDS, seturlDS] = useState(`${localhostUrl}/DS`);
    const [urlgetDSTransactionV2, seturlgetDSTransactionV2] = useState(`${urlDS}/getDSTransactionV2`);

    const setMode = (e) => {
        setCurrentMode(e.target.value);
        localStorage.setItem('themeMode', e.target.value);
        setThemeSettings(false);
    }
    const setColor = (color) => {
        setCurrentColor(color);
        localStorage.setItem('colorMode', color);
        setThemeSettings(false);
    }
    const handleClicked = (clicked) => { setIsClicked({ ...initialState, [clicked]: true }) };

    const handleLogin = () => {
        setIsLogin(true);
    }

    const handleSetToken = (token) => {
        localStorage.setItem('token', `Bearer ${token}`);
        setToken(localStorage.getItem("token"));
    };

    const handleClearToken = () => {
        localStorage.setItem('token', '');
        setToken('');
    };

    return (
        <StateContext.Provider value={{
            activeMenu,
            setActiveMenu,
            isClicked,
            setIsClicked,
            handleClicked,
            screenSize, setScreenSize,
            currentColor, currentMode,
            themeSettings, setThemeSettings,
            setMode,
            setColor,
            handleLogin, isLogin,
            handleSetToken, token,
            handleClearToken,
            localhostUrl,

            urllogin,
            urlgetTodolistTypes, urlgetDSTransTypes, //common
            urlTodolistDone, //todolist            
            urldsAccont, //ds account
            urlDSItem, urlgetDSItemWithSub, urlgetDSItemWithSubV3, urladdWithSubItem, //dsitem
            urlDSItemSub, //dsitem sub
            urlDS, urlgetDSTransactionV2, //dsTrans
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);