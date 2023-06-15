import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import useInput from '../../hooks/use-input';
import { Card } from 'react-bootstrap';
import './LoginPage.css';
import { NavLink, useNavigate } from "react-router-dom";
import ReactDom from 'react-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import Cookies from 'universal-cookie';
import Error from '../../components/Error/Error';
import LoadingScreen from '../../components/Loader/LoadingScreen';
import { useDispatch } from 'react-redux'
import { authActions } from '../../store/authSlice';

const emailValidity = (email) => {
  if (!email.includes('@') || !email.includes('.')) {
    return false;
  } else {
    return true;
  }
}

const PasswordValidity = (password) => {
  return password.length > 7
}


const LoginPage = () => {
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [errorMsg, changeErrorMsg] = useState(undefined);
  const [isLoading, changeLoadingState] = useState(false);
  const {
    InputValue: emailValue,
    showError: emailShowError,
    onBlur: emailOnBlur,
    onChangeValue: emailOnChangeValue,
    isValid: emailValid,
    onSubmit: emailSubmit,
    reset: emailreset,
  } = useInput(emailValidity);

  const {
    InputValue: passwordValue,
    showError: passwordShowError,
    onBlur: passwordOnBlur,
    onChangeValue: passwordOnChangeValue,
    isValid: passwordValid,
    onSubmit: passwordSubmit,
    reset: passwordreset,
  } = useInput(PasswordValidity);

  const login = async (payload) => {
    console.log('sending request',payload);
    changeLoadingState(true);
    let url = `${process.env.REACT_APP_BACKEND}/api/v1/user/signin`
    if (isAdmin) {
      url = url.replace('user','admin');
    }
    const data = await axios({
      method: "POST",
      url,
      data: payload
    });
    const token = data.data.token;
    const decoded_token = jwtDecode(token);
    cookies.set('jwt', token, {
      expires: new Date(decoded_token.exp * 1000)
    })
  }
  
  const submitHandler = async (e) => {
    e.preventDefault();
    emailSubmit();
    passwordSubmit();
    if (!passwordValid || !emailValid) {
        return;
      }
    const loginDetails = {
      email: emailValue,
      password: passwordValue,
    }
    try {
    await login(loginDetails);
    emailreset();
    passwordreset();
    dispatch(authActions.logInUser(isAdmin));
    changeLoadingState(false);
    return navigate('/');
    } catch (error) {
      console.log(error);
      changeLoadingState(false);
      if (error?.response?.data?.message) {
        changeErrorMsg(error.response.data.message);
      } else { changeErrorMsg(error.message); }
      setTimeout(() => {
        changeErrorMsg(undefined);
      }, 4000);
    }
  }
  const isAdmin = window.location.pathname.includes('admin');
  let style = {marginBottom: "8rem"};
  if (!isAdmin) {
    style = {};
  }
  return (
    <>
    {isLoading && <LoadingScreen/>}
    <div id='register-container'>
      <div id='register-card' style={style}>
        <Card style={{ width: '40rem' }} id='register-bootstrap-card'>
          {!isAdmin && <h3 id='register-heading'>User Login</h3>}
          {isAdmin && <h3 id='register-heading'>Admin Login</h3>}
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Email" required value={emailValue} onChange={emailOnChangeValue} onBlur={emailOnBlur}/>
            </Form.Group>
            {emailShowError && <p className='error'>Please Enter a valid Email!!</p>}
            
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" required value={passwordValue} onChange={passwordOnChangeValue} onBlur={passwordOnBlur}/>
            </Form.Group>
            {passwordShowError && <p className='error'>Password should be atleast 8 characters long!!</p>}
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card>
      </div>
      {!isAdmin && <div className='already-acc' style={{marginBottom: "3rem"}}>
        <p>Dont have a Account?</p>
        <NavLink to={'/register'}>
          <Button variant='secondary'>Register</Button>
        </NavLink>
      </div>}
      {errorMsg && ReactDom.createPortal(<Error message={errorMsg}/>, document.getElementById('error-overlay'))}
      </div>
    </>
  )
}

export default LoginPage
