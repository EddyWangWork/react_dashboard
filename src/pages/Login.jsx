import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import axios from 'axios';

function Login() {
    const { handleLogin, handleSetToken, token, localhostUrl, urllogin } = useStateContext();

    const [formData, setFormData] = useState({ name: '', email: '' });

    const handleFormSubmit = (event) => {
        event.preventDefault();

        axios.post(`${urllogin}`, formData)
            .then(response => {
                console.log(response);
                console.log(response.data['token']);
                handleSubmit(response.data['token']);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const navigate = useNavigate();
    const handleSubmit = (token) => {
        handleSetToken(token);
        handleLogin();
        navigate('/todolists', { replace: true });
    };

    useEffect(() => {
        if (token) {
            handleLogin();
            navigate('/todolists', { replace: true });
        }
    }, []);

    return (
        <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
            <Header category='' title='Login' />
            <form onSubmit={handleFormSubmit}>
                <div className="mb-6">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                    <input type="text" name="name" onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                    <input type="password" name="password" onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>
        </div>
    );
}

export default Login;