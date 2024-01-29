import React, { createContext, useContext, useState } from 'react';
import axios from "axios";

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
    // const [localhostUrl, setlocalhostUrl] = useState('https://allinoneapi.alwaysdata.net');
    const [localhostUrl, setlocalhostUrl] = useState('https://localhost:7069');

    const [urllogin, seturllogin] = useState(`${localhostUrl}/Member/login`);

    //common
    const [urlgetTodolistTypes, setgetTodolistTypes] = useState(`${localhostUrl}/Common/getTodolistTypes`);
    const [urlgetDSTransTypes, seturlgetDSTransTypes] = useState(`${localhostUrl}/Common/getDSTransTypes`);

    //todolist
    const [urlTodolist, seturlTodolist] = useState(`${localhostUrl}/Todolist`);
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
    const [urlgetDSTransactionWithDate, seturlgetDSTransactionWithDate] = useState(`${urlDS}/getDSTransactionWithDate`);

    //statistic
    const [urlgetDSMonthlyExpenses, seturlgetDSMonthlyExpenses] = useState(`${urlDS}/getDSMonthlyExpenses`);
    const [urlgetDSYearCreditDebitDiff, seturlgetDSYearCreditDebitDiff] = useState(`${urlDS}/getDSYearCreditDebitDiff`);
    const [urlgetDSYearExpenses, seturlgetDSYearExpenses] = useState(`${urlDS}/getDSYearExpenses`);

    //trip
    const [urltrip, seturltrip] = useState(`${localhostUrl}/Trip`);
    const [urlgetTrips, seturlgetTrips] = useState(`${urltrip}/getTrips`);
    const [urlgetTripDetailTypes, seturlgetTripDetailTypes] = useState(`${urltrip}/getTripDetailTypes`);

    //kanban
    const urlKanban = `${localhostUrl}/Kanban`;

    //global
    const [dsTransactions, setdsTransactions] = useState(JSON.parse(localStorage.getItem("transactions")));
    const [dsTrans, setdsTrans] = useState([]);
    const [dsTransError, setdsTransError] = useState(null);

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
    const handleLogin = () => { setIsLogin(true); }

    const handleSetToken = (token) => {
        localStorage.setItem('token', `Bearer ${token}`);
        setToken(localStorage.getItem("token"));
    };

    const handleClearToken = () => {
        localStorage.setItem('token', '');
        setToken('');
    };

    const getdstransactions = () => {
        axios
            .get(`${urlgetDSTransactionV2}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data)
                response.data.map((data, index) => {
                    data.createdDateTime = new Date(data.createdDateTime);
                    data.createdDateTimeDay = new Date(data.createdDateTime);
                });

                setdsTrans(response.data);
                setdsTransError(null);
            })
            .catch((err) => {
                console.log(token);
                console.log(err);
                console.log(err.response.status);
                setdsTransError(err.response.status);
            });
    }

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
            urlTodolist,
            urlTodolistDone, //todolist            
            urldsAccont, //ds account
            urlDSItem, urlgetDSItemWithSub, urlgetDSItemWithSubV3, urladdWithSubItem, //dsitem
            urlDSItemSub, //dsitem sub
            urlDS, urlgetDSTransactionV2, urlgetDSTransactionWithDate, //dsTrans
            urlgetDSMonthlyExpenses, urlgetDSYearCreditDebitDiff, urlgetDSYearExpenses,//statistic
            urlgetTrips, //trip
            urlKanban, //kanban

            dsTransactions,
            dsTrans, setdsTrans, getdstransactions,
            dsTransError
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);