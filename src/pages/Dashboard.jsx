import {
    EuiGlobalToastList
} from '@elastic/eui';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import React, { useEffect, useMemo } from 'react';
import { FiSettings, FiArrowUpCircle, FiArrowDownCircle } from 'react-icons/fi';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Navbar, Sidebar, ThemeSettings } from '../components';
import {
    Area, Bar,
    Calendar,
    ColorMapping,
    ColorPicker,
    Customers,
    Home,
    Ecommerce, Ecommerce2, Ecommerce3,
    Editor,
    Employees,
    Financial,
    Kanban, Kanban2, Line,
    LoginV2,
    LoginV3,
    Orders,
    Pie,
    Pyramid,
    Stacked,
    Todolists, Transaction,
    Transaction2,
    Shop,
    TransactionCompare,
    Trip,
    TripManage
} from '../pages';

import { useStateContext } from '../contexts/ContextProvider';

import '../App.css';

const Dashboard = () => {

    const {
        activeMenu, themeSettings, setThemeSettings, currentColor, currentMode, isLogin, token, handleLogin,
        toasts, removeToast, screenSize, setScreenSize
    } = useStateContext();

    const ssLess800 = screenSize <= 800;

    const ViewToast = useMemo(
        () => {
            return <EuiGlobalToastList
                toasts={toasts}
                dismissToast={removeToast}
                toastLifeTimeMs={3500}
            />
        },
        [toasts]
    )

    useEffect(() => {
        if (token) {
            handleLogin();
        }

        // const handleResize = () => setScreenSize(window.innerWidth);
        // window.addEventListener('resize', handleResize);
        // handleResize();
        // return () => window.removeEventListener('resize', handleResize);

    }, [token]);

    const getScale = () => {
        switch (true) {
            case screenSize <= 940:
                return 'scale-75'
            case (screenSize > 940 && screenSize <= 1100):
                return 'scale-90'
            case (screenSize > 1100 && screenSize <= 1200):
                return 'scale-85'
            default:
                return 'display'
        }
    }

    const getDashboard = () => (
        <div>
            {/* {
                !token && <div>
                    <div className={ssLess800 ? 'hidden' : `${getScale()} w-0`}>
                        <LoginV2 />
                    </div>
                    <div className={!ssLess800 ? 'hidden' : 'display'}>
                        <LoginV3 />
                    </div>
                </div>
            } */}
            {
                !token && <LoginV2 />
            }
            {
                token && <div className="flex relative dark:bg-main-dark-bg">
                    <div className='fixed right-2 bottom-24' style={{ zIndex: '1000' }}>
                        <TooltipComponent content="Top" position='Top'>
                            <button
                                type='button'
                                className='text-3xl p-3 hower:drop-shadow-x1 hover:opacity-100 hover:bg-light-gray text-black opacity-25'
                                onClick={() => document.documentElement.scrollTop = 0}>
                                <FiArrowUpCircle />
                            </button>
                        </TooltipComponent>
                    </div>
                    <div className='fixed right-2 bottom-14' style={{ zIndex: '1000' }}>
                        <TooltipComponent content="Bottom" position='Top'>
                            <button
                                type='button'
                                className='text-3xl p-3 hower:drop-shadow-x1 hover:opacity-100 hover:bg-light-gray text-black opacity-25'
                                onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
                                <FiArrowDownCircle />
                            </button>
                        </TooltipComponent>
                    </div>
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
                                <Route path="/home" element={(<Home />)} />
                                <Route path="/ecommerce" element={(<Ecommerce />)} />
                                <Route path="/ecommerce2" element={(<Ecommerce2 />)} />
                                <Route path="/ecommerce3" element={(<Ecommerce3 />)} />

                                {/* pages  */}
                                <Route path="/orders" element={<Orders />} />
                                <Route path="/employees" element={<Employees />} />
                                <Route path="/customers" element={<Customers />} />
                                <Route path="/todolists" element={<Todolists />} />
                                <Route path="/transactions" element={<Transaction />} />
                                <Route path="/transactions2" element={<Transaction2 />} />
                                <Route path="/trips" element={<Trip />} />
                                <Route path="/shops" element={<Shop />} />
                                <Route path="/tripsbo" element={<TripManage />} />
                                <Route path="/transcompare" element={<TransactionCompare />} />

                                {/* apps  */}
                                <Route path="/kanban" element={<Kanban />} />
                                <Route path="/kanban2" element={<Kanban2 />} />
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
            }
        </div>
    )

    return (
        <div className={currentMode === 'Dark' ? 'dark' : ''}>
            <div>
                {ViewToast}
                <BrowserRouter>
                    {getDashboard()}
                </BrowserRouter>
            </div>
        </div>
    )
}

export default Dashboard