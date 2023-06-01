import React from "react";
import { Navbar as BsNavbar, NavItem, Nav } from "react-bootstrap";
import { IoMenu } from "react-icons/io5";
import { Link } from "react-router-dom";
import { dAppName } from "config";
import { logout } from "helpers";
import { useGetIsLoggedIn } from "hooks";
import { routeNames } from "routes";
import { ReactComponent as MultiversXLogo } from "../../assets/img/multiversx.svg";

export const Navbar = () => {
  const isLoggedIn = useGetIsLoggedIn();

  const handleLogout = () => {
    logout(`${window.location.origin}/unlock`);
  };

  return (
    <BsNavbar
      className="bg-white border-bottom px-4 py-3"
      expand="sm"
      collapseOnSelect
    >
      <div className="container-fluid">
        <Link
          className="d-flex align-items-center navbar-brand mr-0"
          to={isLoggedIn ? routeNames.home : routeNames.home}
        >
          {/* <MultiversXLogo className='dapp-logo' /> */}
          <span className="dapp-name text-muted">{dAppName}</span>
        </Link>

        <BsNavbar.Toggle aria-controls="responsive-navbar-nav">
          <IoMenu />
        </BsNavbar.Toggle>
        <BsNavbar.Collapse id="responsive-navbar-nav" className="nav-menu-wrap">
          <Nav className="ml-auto">
            <NavItem>
              <Link
                to={isLoggedIn ? routeNames.home : routeNames.home}
                className="nav-link"
              >
                Home
              </Link>
            </NavItem>
            {/* <NavItem>
              <Link to={routeNames.cantinacorner} className="nav-link">
                Cantina Corner
              </Link>
            </NavItem> */}
            {/* <NavItem>
              <Link to={routeNames.gamerpassportgamer} className="nav-link">
                Web3 Gamer Passport
              </Link>
            </NavItem> */}
            {/* <NavItem>
              <Link
                to={routeNames.playstationgamerpassport}
                className="nav-link"
              >
                Sony Playstation Data Passport
              </Link>
            </NavItem> */}
            {/* <NavItem>
              <Link to={routeNames.itheumtrailblazer} className="nav-link">
                Itheum Trailblazer
              </Link>
            </NavItem> */}
            {isLoggedIn ? (
              <>
                <NavItem>
                  <Link to={routeNames.mylisted} className="nav-link">
                    My Listed
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to={routeNames.mywallet} className="nav-link">
                    My Wallet
                  </Link>
                </NavItem>
                <NavItem>
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </NavItem>
              </>
            ) : (
              <NavItem>
                <Link to={routeNames.unlock} className="nav-link">
                  Login
                </Link>
              </NavItem>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </div>
    </BsNavbar>
  );
};
