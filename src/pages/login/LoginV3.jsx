import { useRef, useState } from "react";
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import axios from "axios";
import * as React from 'react';
import { Helmet } from "react-helmet";
// import './LoginV3.css'
import $ from 'jquery';
import jQuery from 'jquery';
window.jQuery = jQuery;
window.$ = $;


function LoginV3() {
    const {
        handleLogin, handleSetToken, token, localhostUrl,
        urllogin, urlgetDSTransactionV2, setdsTrans, setuserInfo,
        addToastHandler, getToastReq
    } = useStateContext();

    const [formData, setFormData] = useState({ name: '', email: '' });
    const [isLogining, setisLogining] = useState(false);
    const [errorMsg, seterrorMsg] = useState(null);

    const getdstransactions = (token) => {
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
            })
            .catch((err) => {
                console.log(token);
                console.log(err);
                console.log(err.response.status);
            });
    }

    const navigate = useNavigate();
    const handleSubmit = (token) => {
        handleSetToken(token);
        handleLogin();
        navigate('/todolists', { replace: true });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const signin = (event) => {
        event.preventDefault();

        setisLogining(true);
        seterrorMsg(null);

        axios.post(`${urllogin}`, formData)
            .then(response => {
                addToastHandler(getToastReq(1, `Welcome ${response.data.name}!`, ['Thanks for your patience!']));
                setisLogining(false);
                handleSubmit(response.data.token);
                getdstransactions(response.data.token);
                setuserInfo(response.data);
            })
            .catch(error => {
                setisLogining(false);
                console.log(error);
                console.log(error.message);
                console.log(error.response?.data);
                seterrorMsg(error.response?.data != '' ? error.response?.data : error.message);
            });
    }

    React.useEffect(() => {

    }, [])

    return (
        <div className="form-structor">
            <Helmet>
                <script type="application/javascript" src="./LoginV3.js" />
            </Helmet>
            <div className="signup slide-up">
                <h2 className="form-title" id="signup"><span>or</span>Sign up</h2>
                <div className="form-holder">
                    <input type="text" className="input" placeholder="Name" />
                    <input type="email" className="input" placeholder="Email" />
                    <input type="password" className="input" placeholder="Password" />
                </div>
                <button className="submit-btn">Sign up</button>
            </div>
            <div className="login">
                <div className="center">
                    <h2 className="form-title" id="login"><span>or</span>Log in</h2>
                    <div className="form-holder">
                        {/* <input type="email" className="input" placeholder="Email" onChange={handleInputChange} required />
                        <input type="password" className="input" placeholder="Password" onChange={handleInputChange} required /> */}
                        <input type="text" name="name" className="input" placeholder="Name" onChange={handleInputChange} required />
                        <input type="password" name="password" className="input" placeholder="Password" onChange={handleInputChange} required />
                    </div>
                    <button className="submit-btn" disabled={isLogining} onClick={signin}>
                        Log in
                        {isLogining && <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="#fff" class="ml-2 inline animate-spin"
                            viewBox="0 0 26.349 26.35">
                            <circle cx="13.792" cy="3.082" r="3.082" data-original="#000000" />
                            <circle cx="13.792" cy="24.501" r="1.849" data-original="#000000" />
                            <circle cx="6.219" cy="6.218" r="2.774" data-original="#000000" />
                            <circle cx="21.365" cy="21.363" r="1.541" data-original="#000000" />
                            <circle cx="3.082" cy="13.792" r="2.465" data-original="#000000" />
                            <circle cx="24.501" cy="13.791" r="1.232" data-original="#000000" />
                            <path
                                d="M4.694 19.84a2.155 2.155 0 0 0 0 3.05 2.155 2.155 0 0 0 3.05 0 2.155 2.155 0 0 0 0-3.05 2.146 2.146 0 0 0-3.05 0z"
                                data-original="#000000" />
                            <circle cx="21.364" cy="6.218" r=".924" data-original="#000000" />
                        </svg>}
                    </button>
                    {errorMsg && <div id="toast-danger" class="mt-5 flex items-center w-full max-w-sm p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
                        <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                            </svg>
                            <span class="sr-only">Error icon</span>
                        </div>
                        <div class="pl-2 ms-3 text-xl font-normal">{errorMsg}</div>
                    </div>}
                </div>
            </div>
        </div>
    );
}
;
export default LoginV3;

