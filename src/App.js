import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { Navbar, Footer, Sidebar, ThemeSettings } from './components';
import {
    Ecommerce, Orders, Calendar, Employees, Stacked, Pyramid, Customers, Modal, Kanban, Line,
    Area, Bar, Pie, Financial, ColorPicker, ColorMapping, Editor, Login, Dashboard
} from './pages';

import { useStateContext } from './contexts/ContextProvider';

import './App.css'

const App = () => {

    const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode, isLogin } = useStateContext();
    const token = localStorage.getItem('token', '');

    return (
        <Dashboard />
        // <BrowserRouter>
        //     <Routes>
        //         {/* login  */}
        //         <Route path="/" element={(<Login />)} />
        //         <Route path="/login" element={<Login />} />
        //         <Route path="/dashboard" element={<Dashboard />} />
        //     </Routes>
        // </BrowserRouter>
    )
}

export default App