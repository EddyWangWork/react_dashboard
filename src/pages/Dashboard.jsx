import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { Navbar, Footer, Sidebar, ThemeSettings } from '../components';
import {
    Ecommerce, Ecommerce2, Orders, Calendar, Employees, Stacked, Pyramid, Customers, Trip, Kanban, Line,
    Area, Bar, Pie, Financial, ColorPicker, ColorMapping, Editor, Login, LoginV2, Todolists, Transaction, TripManage,
    TransactionCompare
} from '../pages';

import { useStateContext } from '../contexts/ContextProvider';

import '../App.css'

const Dashboard = () => {

    const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode, isLogin, token, handleLogin } = useStateContext();

    useEffect(() => {
        if (token) {
            handleLogin();
        }
    }, []);

    const getDashboard = () => {
        if (!isLogin) {
            console.log('not login');
            return (
                <div>
                    <LoginV2 />
                </div>
            )
        }
        else {
            console.log('login');
            return (
                <div className="flex relative dark:bg-main-dark-bg">
                    <div className='fixed right-4 bottom-4' style={{ zIndex: '1000' }}>
                        <TooltipComponent content="Settings" position='Top'>
                            <button
                                type='button'
                                className='text-3x1 p-3 hower:drop-shadow-x1 hover:bg-light-gray text-white'
                                onClick={() => setThemeSettings(true)}
                                style={{ background: currentColor, borderRadius: '50%' }}>
                                <FiSettings />
                            </button>
                        </TooltipComponent>
                    </div>

                    <div>
                        {activeMenu ? (
                            <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white'>
                                <Sidebar />
                            </div>
                        ) : (
                            <div className='w-0 dark:bg-secondary-dark-bg'>
                                <Sidebar />
                            </div>
                        )}
                    </div>

                    <div className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu && isLogin ? 'md:ml-72' : 'flex-2'}`}>
                        <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
                            <Navbar />
                        </div>

                        <div>
                            {themeSettings && <ThemeSettings />}

                            <Routes>
                                {/* dashboard  */}
                                <Route path="/" element={<Todolists />} />
                                <Route path="/ecommerce" element={(<Ecommerce />)} />
                                <Route path="/ecommerce2" element={(<Ecommerce2 />)} />

                                {/* pages  */}
                                <Route path="/orders" element={<Orders />} />
                                <Route path="/employees" element={<Employees />} />
                                <Route path="/customers" element={<Customers />} />
                                <Route path="/todolists" element={<Todolists />} />
                                <Route path="/transactions" element={<Transaction />} />
                                <Route path="/trips" element={<Trip />} />
                                <Route path="/tripsbo" element={<TripManage />} />
                                <Route path="/transcompare" element={<TransactionCompare />} />

                                {/* apps  */}
                                <Route path="/kanban" element={<Kanban />} />
                                <Route path="/editor" element={<Editor />} />
                                <Route path="/calendar" element={<Calendar />} />
                                <Route path="/color-picker" element={<ColorPicker />} />

                                {/* charts  */}
                                <Route path="/line" element={<Line />} />
                                <Route path="/area" element={<Area />} />
                                <Route path="/bar" element={<Bar />} />
                                <Route path="/pie" element={<Pie />} />
                                <Route path="/financial" element={<Financial />} />
                                <Route path="/color-mapping" element={<ColorMapping />} />
                                <Route path="/pyramid" element={<Pyramid />} />
                                <Route path="/stacked" element={<Stacked />} />

                                {/* login  */}
                                <Route path="/login" element={<LoginV2 />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className={currentMode === 'Dark' ? 'dark' : ''}>
            <div>
                <BrowserRouter>
                    {getDashboard()}
                </BrowserRouter>
            </div>
        </div>
    )
}

export default Dashboard