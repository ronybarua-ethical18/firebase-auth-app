import { faFacebook, faGithub, faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faLock, faSignature } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import './Authentication.css';
import SignIn from './sign-in.png';
import avatar from './avatar.png';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from '../../firebase.config';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}


const Authentication = () => {
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        success: false
    });
    const [newUser, setNewUser] = useState(false);

    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const facebookProvider = new firebase.auth.FacebookAuthProvider();
    const githubProvider = new firebase.auth.GithubAuthProvider();

    const serviceProvider = (provider) => {
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;
                var user = result.user;
                var accessToken = credential.accessToken;
                setUser(user);
                console.log(user);
            })
            .catch((error) => {

                var errorCode = error.code;
                var errorMessage = error.message;
                var email = error.email;
                console.log('error', errorCode, errorMessage, email);
            });
    }
    const handleGoogleSignIn = () => {
        serviceProvider(googleProvider);
    }
    const handleFacebookSignIn = () => {
        serviceProvider(facebookProvider);
    }
    const handleGithubSignIn = () => {
        serviceProvider(githubProvider);
    }
    const handleBlur = (event) => {
        let isFormValid = true;
        if (event.target.name === 'email') {
            isFormValid = /\S+@\S+\.\S+/.test(event.target.value);
            console.log(isFormValid);
        }
        if (event.target.name === 'password') {
            const passwordLength = event.target.value.length > 6;
            const hasNumber = /\d{1}/.test(event.target.value);
            isFormValid = passwordLength && hasNumber;
            console.log(isFormValid);
        }
        if (isFormValid) {
            const newUserInfo = { ...user };
            newUserInfo[event.target.name] = event.target.value;
            setUser(newUserInfo);
        }
    }
    const handleSubmit = (event) => {
        if (newUser && user.email && user.password) {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    const newUserInfo = { ...user };
                    newUserInfo.success = true;
                    newUserInfo.error = '';
                    updateUserInfo(user.name);
                    setUser(newUserInfo);
                    console.log('Saved user', res.user);
                })
                .catch((error) => {
                    const newUserInfo = { ...user };
                    newUserInfo.success = false;
                    newUserInfo.error = error.message;
                    setUser(newUserInfo);
                });
        }
        if (!newUser && user.email && user.password) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    const newUserInfo = { ...user };
                    newUserInfo.success = true;
                    newUserInfo.error = '';
                    setUser(newUserInfo);
                    console.log('sign in user info', res.user);
                })
                .catch((error) => {
                    const newUserInfo = { ...user };
                    newUserInfo.success = false;
                    newUserInfo.error = error.message;
                    setUser(newUserInfo);
                });
        }
        event.preventDefault();
    }
    const updateUserInfo = name => {
        let user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: name
        }).then(function () {
            console.log('User name Updated Successfully');
        }).catch(function (error) {
            console.log(error);
        });
    }
    return (
        <div className="authentic-field">
            <Container className="h-100">
                <Row className="m-3 shadow">
                    <Col md={7} sm={12} xs={12} className="mx-auto p-5" >
                        <h4 className="display-5">User Information</h4>
                        <img src={SignIn} className="img-fluid" alt="" />
                        <p className="text-left">Firebase Authentication provides backend services, easy-to-use SDKs, and ready-made UI libraries to authenticate users to your app. It supports authentication using passwords, phone numbers, popular federated identity providers like Google, Facebook and Twitter, and more.</p>
                    </Col>
                    <Col md={5} sm={12} xs={12} className="p-4 text-center shadow">
                        <img src={avatar} className="img-fluid rounded avatar mb-2" alt="" />
                        <h4 className="display-6">User Authentication</h4>
                        <p style={{ color: 'red' }}>{user.error}</p>
                        {user.success && <p style={{ color: 'green' }}>User {newUser ? 'Created' : 'Logged In'} Successfully</p>}
                        <form action="" onSubmit={handleSubmit} className="mt-4">
                            {newUser && <div className="input-field mb-3">
                                <FontAwesomeIcon icon={faSignature} className="icons"></FontAwesomeIcon>
                                <input onBlur={handleBlur} type="text" name="name" placeholder="name" required />
                            </div>}
                            <div className="input-field mb-3">
                                <FontAwesomeIcon className="icons" icon={faUser}></FontAwesomeIcon>
                                <input onBlur={handleBlur} type="text" name="email" placeholder="Enter your email" />
                            </div>
                            <div className="input-field mb-3">
                                <FontAwesomeIcon className="icons" icon={faLock}></FontAwesomeIcon>
                                <input onBlur={handleBlur} type="password" name="password" placeholder="Enter password" id="" />
                            </div>
                            <div className="checkbox mb-2">
                                <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
                                <label htmlFor="newUser" className="ml-2">Sign up if you are new here </label>
                            </div>
                            <button type="submit" className="submit-button mb-2">{newUser ? 'Sign Up' : 'Sign In'}</button>
                            <p>Sign in with social platforms</p>
                            <div className="social-icons d-flex w-100 justify-content-center  ">
                                <FontAwesomeIcon onClick={handleFacebookSignIn} icon={faFacebook} className="social-icon mr-3"></FontAwesomeIcon>
                                <FontAwesomeIcon onClick={handleGoogleSignIn} icon={faGoogle} className="social-icon mr-3"></FontAwesomeIcon>
                                <FontAwesomeIcon onClick={handleGithubSignIn} icon={faGithub} className="social-icon mr-3"></FontAwesomeIcon>
                                <FontAwesomeIcon icon={faTwitter} className="social-icon"></FontAwesomeIcon>
                            </div>
                        </form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Authentication;