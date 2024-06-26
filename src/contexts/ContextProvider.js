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
    const [userInfo, setuserInfo] = useState({});
    const [toasts, setToasts] = useState([]);
    // const [localhostUrl, setlocalhostUrl] = useState('https://allinoneapi.alwaysdata.net');
    const [localhostUrl, setlocalhostUrl] = useState('https://localhost:7069');

    const urlmember = `${localhostUrl}/Member`;
    const urllogin = `${urlmember}/loginV2`;

    //common
    const urlcommon = `${localhostUrl}/Common`;
    const urlgetTodolistTypes = `${urlcommon}/getTodolistTypes`;
    const urlgetDSTransTypes = `${urlcommon}/getDSTransTypes`;

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
    const urlgetDSTransactionByDSAccount = `${urlDS}/getDSTransactionByDSAccount`;

    //statistic
    const [urlgetDSMonthlyExpenses, seturlgetDSMonthlyExpenses] = useState(`${urlDS}/getDSMonthlyExpenses`);
    const [urlgetDSYearCreditDebitDiff, seturlgetDSYearCreditDebitDiff] = useState(`${urlDS}/getDSYearCreditDebitDiff`);
    const [urlgetDSYearExpenses, seturlgetDSYearExpenses] = useState(`${urlDS}/getDSYearExpenses`);

    //trip
    const [urltrip, seturltrip] = useState(`${localhostUrl}/Trip`);
    const [urlgetTrips, seturlgetTrips] = useState(`${urltrip}/getTrips`);
    const [urlgetTripDetailTypes, seturlgetTripDetailTypes] = useState(`${urltrip}/getTripDetailTypes`);
    const urladdtrip = `${urltrip}/addtrip`;
    const urlupdatetrip = `${urltrip}/updatetrip`;
    const urldeletetrip = `${urltrip}/deletetrip`;
    const urladdtripdetailtype = `${urltrip}/addtripdetailtype`;
    const urlupdatetripdetailtype = `${urltrip}/updatetripdetailtype`;
    const urdeletetripdetailtype = `${urltrip}/deletetripdetailtype`;
    const urladdtripdetail = `${urltrip}/addtripdetail`;
    const urlupdatetripdetail = `${urltrip}/updatetripdetail`;
    const urldeletetripdetail = `${urltrip}/deletetripdetail`;

    //kanban
    const urlKanban = `${localhostUrl}/Kanban`;

    //dashbaord
    const urlgetDSMonthlyPeriodCreditDebit = `${urlDS}/getDSMonthlyPeriodCreditDebit`;
    const urlgetDSMonthlyItemExpenses = `${urlDS}/getDSMonthlyItemExpenses`;
    const urlgetDSMonthlyCommitmentAndOther = `${urlDS}/getDSMonthlyCommitmentAndOther`;

    //shop
    const urlShop = `${localhostUrl}/Shop`;
    const urlgetShops = `${urlShop}/getShops`;
    const urladdShop = `${urlShop}/addShop`;
    const urlupdateShop = `${urlShop}/updateShop`;
    const urldeleteShop = `${urlShop}/deleteShop`;

    const urlgetShopDiaries = `${urlShop}/getShopDiaries`;
    const urlgetShopDiariesByShop = `${urlShop}/getShopDiariesByShop`;
    const urladdShopDiary = `${urlShop}/addShopDiary`;
    const urlupdateShopDiary = `${urlShop}/updateShopDiary`;
    const urldeleteShopDiary = `${urlShop}/deleteShopDiary`;

    const urlgetShopTypes = `${urlShop}/getShopTypes`;
    const urladdShopType = `${urlShop}/addShopType`;
    const urlupdateShopType = `${urlShop}/updateShopType`;
    const urldeleteShopType = `${urlShop}/deleteShopType`;

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
        localStorage.setItem('token', token);
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

    const addToastHandler = (req) => {
        const toast = req;
        setToasts(toasts.concat(toast));
    };

    const removeToast = (removedToast) => {
        setToasts((toasts) =>
            toasts.filter((toast) => toast.id !== removedToast.id)
        );
    };

    //1:success, 2:warning, 3:error
    const getToastReq = (type, title, message, iconValue) => (
        {
            id: `toast${Math.random() * 16}`,
            title: title,
            color: type == 1 ? 'success' : type == 2 ? 'warning' : 'danger',
            iconType: iconValue ?? (type == 1 ? 'check' : type == 2 ? 'warning' : 'error'),
            text: message.map((v, i) => (<p key={i}>{v}</p>)),
        }
    )

    return (
        <StateContext.Provider value={{
            userInfo, setuserInfo,
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
            toasts, setToasts, removeToast, addToastHandler, getToastReq, //toast
            localhostUrl,

            urlmember, urllogin,
            urlgetTodolistTypes, urlgetDSTransTypes, //common
            urlTodolist,
            urlTodolistDone, //todolist            
            urldsAccont, //ds account
            urlDSItem, urlgetDSItemWithSub, urlgetDSItemWithSubV3, urladdWithSubItem, //dsitem
            urlDSItemSub, //dsitem sub
            urlDS, urlgetDSTransactionV2, urlgetDSTransactionWithDate, urlgetDSTransactionByDSAccount,//dsTrans
            urlgetDSMonthlyExpenses, urlgetDSYearCreditDebitDiff, urlgetDSYearExpenses,//statistic
            urlgetTrips, urlupdatetrip, urladdtrip, urldeletetrip, //trip
            urladdtripdetailtype, urlupdatetripdetailtype, urdeletetripdetailtype, //tripdetailtype
            urladdtripdetail, urlupdatetripdetail, urldeletetripdetail, //tripdetail
            urlKanban, //kanban
            urlgetDSMonthlyPeriodCreditDebit, urlgetDSMonthlyItemExpenses, urlgetDSMonthlyCommitmentAndOther,//dashboard
            urlgetShops, urladdShop, urlupdateShop, urldeleteShop, urlgetShopDiariesByShop, //shop
            urlgetShopDiaries, urladdShopDiary, urlupdateShopDiary, urldeleteShopDiary, //shop diary
            urlgetShopTypes, urladdShopType, urlupdateShopType, urldeleteShopType, //shop type,
            dsTransactions,
            dsTrans, setdsTrans, getdstransactions,
            dsTransError
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);