import React from "react";
import { Navbar as BsNavbar, NavItem, Nav, NavDropdown } from "react-bootstrap";
import { IoMenu } from "react-icons/io5";
import { Link } from "react-router-dom";
import { CopyAddress } from "components/CopyAddress";
import { dAppName, ELROND_NETWORK, SUPPORTED_APPS } from "config";
import { APP_MAPPINGS } from "libs/utils/constant";
import { logout } from "helpers";
import { useGetAccount, useGetIsLoggedIn } from "hooks";
import { routeNames } from "routes";
import { SwitchButton } from "./SwitchButton";
import { returnRoute } from "pages/Home";

export const Navbar = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const { address } = useGetAccount();

  const handleLogout = () => {
    // logout(`${window.location.origin}/unlock`);
    logout(`${window.location.origin}`);
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
              {APP_MAPPINGS.filter((app) =>
                SUPPORTED_APPS.includes(app.routeKey)
              ).map((item) => (
                <NavDropdown.Item key={item.routeKey} as="div">
                  <Link to={returnRoute(item.routeKey)} className="nav-link">
                    {item.appName}
                  </Link>
                </NavDropdown.Item>
              ))}
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
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    as="div"
                    style={{ fontSize: ".8rem" }}
                    disabled
                  >
                    My Address Quick Copy
                  </NavDropdown.Item>
                  <NavDropdown.Item as="div">
                    {/* <a className="nav-link">
                      Copy Wallet
                    </a> */}
                    <CopyAddress address={address} precision={6} />
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
                <Link
                  to={routeNames.unlock}
                  className="nav-link"
                  state={{ from: location.pathname }}
                >
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
