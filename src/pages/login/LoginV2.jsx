import { useRef, useState } from "react";
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import axios from "axios";
import * as React from 'react';
import { Helmet } from "react-helmet";
import './LoginV2.css'
import $ from 'jquery';
import jQuery from 'jquery';
window.jQuery = jQuery;
window.$ = $;


function LoginV2() {
    const { handleLogin, handleSetToken, token, localhostUrl,
        urllogin, urlgetDSTransactionV2, setdsTrans } = useStateContext();

    const [formData, setFormData] = useState({ name: '', email: '' });

    const getdstransactions = (token) => {
        axios
            .get(`${urlgetDSTransactionV2}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
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

        axios.post(`${urllogin}`, formData)
            .then(response => {
                console.log(response);
                console.log(response.data['token']);
                handleSubmit(response.data['token']);
                getdstransactions(response.data['token']);
            })
            .catch(error => {
                console.log(error);
            });
    }

    React.useEffect(() => {

    }, [])

    //-----DATA AREA-------------------------------//

    //-----DATAEND-------------------------------// 

    //-----END-------------------------------//

    return (
        <div className="bodyClass">
            <meta charSet="UTF-8" />
            <title>CodePen - Neumorphism Login Form</title>
            {/* <link rel="stylesheet" href="./style.css" /> */}
            {/* partial:index.partial.html */}
            <Helmet>
                <script type="application/javascript" src="./LoginV2.js" />
            </Helmet>
            <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0" />
            <meta charSet="utf-8" />
            <link rel="stylesheet" type="text/css" href="main.css" /><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&display=swap" rel="stylesheet" />
            <div className="main">
                <div className="container a-container" id="a-container">
                    <form className="form" id="a-form" method action>
                        <h2 className="form_title title">Sign in to Website</h2>
                        <input type="text" name="name" placeholder="Email" className="form__input" onChange={handleInputChange} required />
                        {/* <input className="form__input" type="text" placeholder="Email" /> */}
                        {/* <input className="form__input" type="password" placeholder="Password" /><a className="form__link">Forgot your password?</a> */}
                        <input type="password" name="password" placeholder="Password" className="form__input" onChange={handleInputChange} required />
                        <a className="form__link">Forgot your password?</a>
                        <button className="form__button button submit" onClick={signin} >SIGN IN</button>
                    </form>
                </div>
                <div className="container b-container" id="b-container">
                    <form className="form" id="b-form" method action>

                        <h2 className="form_title title">Create Account</h2>
                        <input className="form__input" type="text" placeholder="Name" />
                        <input className="form__input" type="text" placeholder="Email" />
                        <input className="form__input" type="password" placeholder="Password" />
                        <button className="form__button button submit">SIGN UP</button>
                    </form>
                </div>
                <div className="switch" id="switch-cnt">
                    <div className="switch__circle" />
                    <div className="switch__circle switch__circle--t" />
                    <div className="switch__container" id="switch-c1">
                        <h2 className="switch__title title">Hello Friend !</h2>
                        <p className="switch__description description">Enter your personal details and start journey with us</p>
                        <button className="switch__button button switch-btn">SIGN UP</button>
                    </div>
                    <div className="switch__container is-hidden" id="switch-c2">
                        <h2 className="switch__title title">Welcome Back !</h2>
                        <p className="switch__description description">To keep connected with us please login with your personal info</p>
                        <button className="switch__button button switch-btn">SIGN IN</button>
                    </div>
                </div>
            </div>
            {/* partial */}
        </div>
    );
}
;
export default LoginV2;

