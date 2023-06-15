import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import useInput from '../../hooks/use-input';
import { Card } from 'react-bootstrap';
import './RegisterPage.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import Cookies from 'universal-cookie';
import ReactDom from 'react-dom';
import Error from '../../components/Error/Error';
import LoadingScreen from '../../components/Loader/LoadingScreen';
import { useDispatch } from 'react-redux'
import { authActions } from '../../store/authSlice';

const cur_year = new Date().getFullYear();
const batches = [cur_year, cur_year + 1, cur_year + 2];

const emailValidity = (email) => {
  if (!email.includes('@') || !email.includes('.')) {
    return false;
  } else {
    return true;
  }
}

const checkValidity = (value) => {
  if (value == '') {
    return false;
  } else {
    return true;
  }
}

const enrollmentValidity = (value) => {
  if (value === '') {
    return false;
  }
  for(let i=0; i < value.length; i++) {
    if (value[i] < '0' || value[i] > '9') {
      return false;
    }
  }
  return true;
}

const phoneValidity = (value) => {
  if (enrollmentValidity(value) && value.length === 10) {
    return true;
  } else {
    return false;
  }
}

const URLValidity = (URL) => {
  const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');    
  return regex.test(URL);
}

const PasswordValidity = (password) => {
  return password.length > 7
}

const semesterValidation = (semester) => {
  return semester <= 8 && semester >= 1;
}

const addressValidation = (address) => {
  return address.length > 5;
}


const RegisterPage = () => {
  const [errorMsg, changeErrorMsg] = useState(undefined);
  const [isLoading, changeLoadingState] = useState(false);
  const cookies = new Cookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    InputValue: nameValue,
    showError: nameShowError,
    onBlur: nameOnBlur,
    onChangeValue: nameOnChangeValue,
    isValid: nameValid,
    onSubmit: nameSubmit,
    reset: namereset,
  } = useInput(checkValidity);
  
  const {
    InputValue: phoneValue,
    showError: phoneShowError,
    onBlur: phoneOnBlur,
    onChangeValue: phoneOnChangeValue,
    isValid: phoneValid,
    onSubmit: phoneSubmit,
    reset: phonereset,
  } = useInput(phoneValidity);
  
  const {
    InputValue: addressValue,
    showError: addressShowError,
    onBlur: addressOnBlur,
    onChangeValue: addressOnChangeValue,
    isValid: addressValid,
    onSubmit: addressSubmit,
    reset: addressreset,
  } = useInput(addressValidation);
  
  const {
    InputValue: passwordValue,
    showError: passwordShowError,
    onBlur: passwordOnBlur,
    onChangeValue: passwordOnChangeValue,
    isValid: passwordValid,
    onSubmit: passwordSubmit,
    reset: passwordreset,
  } = useInput(PasswordValidity);
  
  const confirmPasswordValidity = (password) => {
    return password === passwordValue;
  }

  const {
    InputValue: confirmPasswordValue,
    showError: confirmPasswordShowError,
    onBlur: confirmPasswordOnBlur,
    onChangeValue: confirmPasswordOnChangeValue,
    isValid: confirmPasswordValid,
    onSubmit: confirmPasswordSubmit,
    reset: confirmPasswordreset,
  } = useInput(confirmPasswordValidity);

  const createUser = async (payload) => {
    console.log('sending request',payload);
    const data = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND}/api/v1/user/signup`,
      data: payload
    });
    const token = data.data.data.token;
    const decoded_token = jwtDecode(token);
    cookies.set('jwt', token, {
      expires: new Date(decoded_token.exp * 1000)
    })
  }
  
  const submitHandler = async (e) => {
    e.preventDefault();
    nameSubmit();
    emailSubmit();
    phoneSubmit();
    addressSubmit();
    passwordSubmit();
    confirmPasswordSubmit();
    if (!confirmPasswordValid || !passwordValid || !addressValid || !phoneValid || !nameValid || !emailValid) {
        return;
      }
    const registerUser = {
      name: nameValue,
      email: emailValue,
      phone: phoneValue,
      address: addressValue,
      password: passwordValue,
      confirmPassword: confirmPasswordValue
    }
    try {
    changeLoadingState(true);
    await createUser(registerUser);
    namereset();
    emailreset();
    phonereset();
    addressreset();
    passwordreset();
    confirmPasswordreset();
    dispatch(authActions.logInUser(false));
    changeLoadingState(false);
    return navigate('/');
    } catch (error) {
      changeLoadingState(false);
      if (error?.response?.data?.message) {
        changeErrorMsg(error.response.data.message);
      } else { changeErrorMsg(error.message); }
      setTimeout(() => {
        changeErrorMsg(undefined);
      }, 4000);
    }
  }

  return (
    <>
    {isLoading && <LoadingScreen/>}
    <div id='register-container'>
      <div id='register-card'>
        <Card style={{ width: '40rem' }} id='register-bootstrap-card'>
      <h3 id='register-heading'>User Register</h3>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Name" value={nameValue} required onChange={nameOnChangeValue} onBlur={nameOnBlur}/>
          </Form.Group>
          {nameShowError && <p className='error'>Please Enter your Name!!</p>}

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Email" required value={emailValue} onChange={emailOnChangeValue} onBlur={emailOnBlur}/>
          </Form.Group>
          {emailShowError && <p className='error'>Please Enter a valid Email!!</p>}
          
          <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="number" placeholder="Phone No" required value={phoneValue} onChange={phoneOnChangeValue} onBlur={phoneOnBlur}/>
          </Form.Group>
          {phoneShowError && <p className='error'>Please Enter a valid Phone Number</p>}
          
          <Form.Group className="mb-3" controlId="formBasicAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" placeholder="Address" required value={addressValue} onChange={addressOnChangeValue} onBlur={addressOnBlur}/>
          </Form.Group>
          {addressShowError && <p className='error'>Please Enter correct Address!!</p>}
          
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" required value={passwordValue} onChange={passwordOnChangeValue} onBlur={passwordOnBlur}/>
          </Form.Group>
          {passwordShowError && <p className='error'>Password should be atleast 8 characters long!!</p>}
          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Password" required value={confirmPasswordValue} onChange={confirmPasswordOnChangeValue} onBlur={confirmPasswordOnBlur}/>
          </Form.Group>
          {confirmPasswordShowError && <p className='error'>Confirm Password should be same as password!!</p>}
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        </Card>
      </div>
      <div className='already-acc'>
        <p>Already have a Account?</p>
        <NavLink to={'/student/login'}>
          <Button variant='secondary'>Log In</Button>
        </NavLink>
      </div>
      </div>
      {errorMsg && ReactDom.createPortal(<Error message={errorMsg}/>, document.getElementById('error-overlay'))}
    </>
  )
}

export default RegisterPage
