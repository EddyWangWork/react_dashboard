import {
    EuiButton,
    EuiButtonEmpty,
    EuiCode,
    EuiFieldText,
    EuiFormRow,
    EuiPopover,
    EuiSpacer,
    EuiText,
    EuiTitle,
    EuiFieldPassword
} from '@elastic/eui';
import React, { useState } from 'react';
import axios from "axios";
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';

const UserProfile = () => {

    const { token, handleClearToken, userInfo, urlmember } = useStateContext();
    const navigate = useNavigate();

    const [username, setusername] = useState(userInfo.name);
    const [password, setpassword] = useState('');
    const [rePassword, setrePassword] = useState('');

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const onButtonClick = () => setIsPopoverOpen((isPopoverOpen) => !isPopoverOpen);
    const closePopover = () => setIsPopoverOpen(false);

    const validSubmit = username && password && password == rePassword;

    const signout = () => {
        handleClearToken();
        navigate('/login', { replace: true });
    }

    const editMember = (id, req) => {
        axios.
            put(`${urlmember}/${id}`, req, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log(response);
                signout();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const button = (
        <EuiButtonEmpty iconType="key" iconSide="right" onClick={onButtonClick}>
            Reset Password
        </EuiButtonEmpty>
    );

    const viewEuiPopover = () => (
        <EuiPopover
            initialFocus="#password"
            button={button}
            isOpen={isPopoverOpen}
            closePopover={closePopover}
        >
            <EuiFormRow label="Username" id="username">
                <EuiFieldText
                    compressed
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                />
            </EuiFormRow>

            <EuiSpacer />

            <EuiFormRow label="Password" id="password">
                <EuiFieldPassword
                    compressed
                    type='dual'
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                />
            </EuiFormRow>

            <EuiSpacer />

            <EuiFormRow label="Re-Password" id="rePassword">
                <EuiFieldPassword
                    compressed
                    type='dual'
                    value={rePassword}
                    onChange={(e) => setrePassword(e.target.value)}
                />
            </EuiFormRow>

            <EuiSpacer />

            <EuiButton size="s" fill isDisabled={!validSubmit} onClick={() => editMember(userInfo.id, { name: username, password })}>
                Submit
            </EuiButton>
        </EuiPopover>
    )

    return (
        <div>
            <div>
                <EuiTitle>
                    <h2>{userInfo.name}</h2>
                </EuiTitle>
                <EuiSpacer />
            </div>
            <div>
                {viewEuiPopover()}
            </div>
            <div>
                <EuiButtonEmpty iconType="push" iconSide="right" onClick={signout}>
                    Sign Out
                </EuiButtonEmpty>
            </div>
        </div>
    )
}

export default UserProfile