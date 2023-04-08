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
        setToken(token);
        localStorage.setItem('token', token);
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
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);