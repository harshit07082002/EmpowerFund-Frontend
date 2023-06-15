import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import axios from 'axios';
import HomePage from "./pages/HomePage/HomePage";
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from './pages/LoginPage/LoginPage';
import Cookies from 'universal-cookie';
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from './store/authSlice';
import AdminNavBar from './components/AdminNavBar/AdminNavBar';
import RegisterJob from './components/RegisterJob/RegisterJob';
import PlacementDetails from './components/PlacementDetails/PlacementDetails';
import StudentDetails from './components/StudentDetails/StudentDetails';
import JobDetails from './components/JobDetails/JobDetails';

const getStatus = async (token) => {
  const data = await axios({
    method: "GET",
    url: `${process.env.REACT_APP_BACKEND}/api/v1/check`,
    headers: {
      'Authorization': `token ${token}`
    }
  });
  return data.data.isAdmin;
}

const App = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const cookies = new Cookies();
  const jwt = cookies.get('jwt');
  if (jwt && !auth.isLogin) {
    try {
      const isAdmin = getStatus(jwt);
      dispatch(authActions.logInUser(isAdmin));
    } catch (error) {
    }
  }
  let styleClass = '';
  if (auth.isLogin) {
    styleClass = 'admin-login';
  }
  return (
    <>
      <NavBar/>
      <main className={styleClass}>
          {auth.isLogin && auth.isAdmin && <AdminNavBar/>}
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/register" element={<RegisterPage/>} />
            <Route path="/user/login" element={<LoginPage/>} />
            <Route path="/user/:email" element={<StudentDetails/>} />
            <Route path="/admin/login" element={<LoginPage/>} />
            <Route path="/about" element={<LoginPage/>} />
            {auth.isAdmin && <Route path="/register-job" element={<RegisterJob/>}/>}
            {auth.isAdmin && <Route path="/placement-details" element={<PlacementDetails/>}/>}
            {/* <Route path="*" element={<Error error={"No Page Found"} />} /> */}
          </Routes>
      </main>
      <footer>
        <Footer/>
      </footer>
    </>
  );
};

export default App;