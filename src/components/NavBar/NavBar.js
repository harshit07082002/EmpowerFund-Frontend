import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './NavBar.css';
import { NavLink, useNavigate } from "react-router-dom";
import defaultImage from "../../image/default.jpg"
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../store/authSlice';
import Cookies from 'universal-cookie';


const NavBar = (props) => {
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const login = useSelector(state => state.auth.isLogin);

  const logoutHandler = () => {
    cookies.remove('jwt');
    dispatch(authActions.logOutUser());
  }
  return (
    <>
      <Navbar bg="light" variant="primary">
        <Container>
          <NavLink to={'/'} id='nav-bar' className='underline'>
            <Navbar.Brand>Placement Cell</Navbar.Brand>
          </NavLink>
          {!login && <Nav className="d-flex">
            <NavDropdown title="Login" id="navbarScrollingDropdown" className='comp'>
              <NavLink to="/user/login" className={"underline"}>
                <a data-rr-ui-dropdown-item="" class="dropdown-item" role="button" tabindex="0">Student Login</a>
              </NavLink>
              <NavLink to={'/admin/login'} className="underline">
              <a data-rr-ui-dropdown-item="" class="dropdown-item" role="button" tabindex="0">Admin Login</a>
              </NavLink>
            </NavDropdown>
            <NavLink to="/register" className='underline comp'>
            <a className='nav-link' tabIndex={'0'}>Register</a>
            </NavLink>
            <NavLink to={"/about"} className='underline comp'>
              <a className='nav-link' tabIndex={'0'}>About</a>
            </NavLink>
          </Nav>}
          {login && <Nav className="d-flex">
            <NavLink to={'/profile'} className='underline comp my-profile'>
              <img src={defaultImage} alt="profile" />
              <a className='nav-link' tabIndex={'0'}>Your Profile</a>
            </NavLink>
            <NavLink onClick={logoutHandler} to={'/'} className='underline comp'>
            <a className='nav-link' tabIndex={'0'}>Logout</a>
            </NavLink>
            <NavLink to={"/about"} className='underline comp'>
              <a className='nav-link' tabIndex={'0'}>About</a>
            </NavLink>
          </Nav>}
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;