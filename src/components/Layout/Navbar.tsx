import React from "react";
import { Navbar as BsNavbar, NavItem, Nav, NavDropdown } from "react-bootstrap";
import { IoMenu } from "react-icons/io5";
import { Link } from "react-router-dom";
import { dAppName } from "config";
import { ELROND_NETWORK } from "config";
import { logout } from "helpers";
import { useGetIsLoggedIn } from "hooks";
import { routeNames } from "routes";
import { SwitchButton } from "./SwitchButton";

export const Navbar = () => {
  const isLoggedIn = useGetIsLoggedIn();

  const handleLogout = () => {
    logout(`${window.location.origin}/unlock`);
  };

  return (
    <BsNavbar className="border-bottom px-4 py-3" expand="sm" collapseOnSelect>
      <div className="container-fluid">
        <Link
          className="d-flex align-items-center navbar-brand mr-0"
          to={isLoggedIn ? routeNames.home : routeNames.home}
        >
          <span className="dapp-name text-muted">{dAppName}</span>
        </Link>

        <small className="ml-2">{ELROND_NETWORK.toUpperCase()}</small>

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

            <NavDropdown title="App Marketplace">
              {/* <NavDropdown.Item as="div">
                <Link to={routeNames.cantinacorner} className="nav-link">
                  Cantina Corner
                </Link>
              </NavDropdown.Item> */}

              <NavDropdown.Item as="div">
                <Link to={routeNames.gamerpassportgamer} className="nav-link">
                  Web3 Gamer Passport
                </Link>
              </NavDropdown.Item>

              <NavDropdown.Item as="div">
                <Link
                  to={routeNames.playstationgamerpassport}
                  className="nav-link"
                >
                  Sony Playstation Data Passport
                </Link>
              </NavDropdown.Item>

              <NavDropdown.Item as="div">
                <Link to={routeNames.itheumtrailblazer} className="nav-link">
                  Trailblazer
                </Link>
              </NavDropdown.Item>

              <NavDropdown.Item as="div">
                <Link to={routeNames.esdtBubble} className="nav-link">
                  ESDT Bubbles
                </Link>
              </NavDropdown.Item>
            </NavDropdown>

            {isLoggedIn ? (
              <>
                <NavDropdown title="Account">
                  <NavDropdown.Item as="div">
                    <Link to={routeNames.mylisted} className="nav-link">
                      My Listed
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item as="div">
                    <Link to={routeNames.mywallet} className="nav-link">
                      My Wallet
                    </Link>
                  </NavDropdown.Item>
                </NavDropdown>

                <div style={{ width: "1rem" }}></div>

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

            <div className="ml-3">
              <SwitchButton />
            </div>
          </Nav>
        </BsNavbar.Collapse>
      </div>
    </BsNavbar>
  );
};
