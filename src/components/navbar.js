import React from 'react';
import {
  Nav,
  NavMenu,
  NavBtn,
  NavBtnLink,
NavLink 
} from './NavbarElements';
  
const Navbar = () => {
  return (
    <>
      <Nav>
  
        <NavMenu>
          <NavLink to='/login' activeStyle>
            Login
          </NavLink>
          <NavLink to='/guide' activeStyle>
            Guide
          </NavLink>
          <NavLink to='/formation' activeStyle>
            Formation
          </NavLink>
          <NavLink to='/nextformation' activeStyle>
            Mes formations
          </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};
  
export default Navbar