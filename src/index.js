import React from 'react';
import ReactDOM from "react-dom/client";

import './index.css'
import App from './App';
import '@elastic/eui/dist/eui_theme_dark.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ContextProvider } from './contexts/ContextProvider';
import '@elastic/eui/dist/eui_theme_dark.css';

import { EuiProvider, EuiText } from '@elastic/eui';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ContextProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* <EuiProvider colorMode="dark">

            </EuiProvider> */}
            <App />
        </LocalizationProvider>
    </ContextProvider>
);