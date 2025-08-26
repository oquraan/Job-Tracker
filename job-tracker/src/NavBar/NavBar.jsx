// "use client"

import { signOut } from "firebase/auth";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import logo from "../images/logo.png";
import { setUserInfo } from "../store/infoUser";
import "./NavBar.css";

export default function NavigationBar({ onScroll }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const navItems = [
  //   { name: "Home", href: "/" },
  //   { name: "Profile", href: "/profile" },
  //   { name: "Dashboard", href: "/dashboard" },
  //   { name: "About", href: "/about" },
  //   { name: "Login", href: "/login" },
  // ];
  const userInfo = useSelector((state) => state.UserInfo.user);

  const navItems = [
    { name: "admin", href: "/admin" },
    {
      name: "Profile",
      href: "/profile",
    },
    {
      name: "profile",
      href: "/profile",
    },
    {
      name: "Dashboard ",
      href: "/dashboard",
    },
    {
      name: "Log out",
      action: () => {
        signOut(auth);
        navigate("/Login");
        dispatch(
          setUserInfo({
            user: null,
          })
        );
        // localStorage.removeItem("info");
      },
    },
  ];

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="logo-section">
          <div className="logo-wrapper">
            <img src={logo} alt="Logo" className="logo-image" />
          </div>
          {/* <h1 className="logo-text">ModernApp</h1> */}
        </div>

        {/* <div className="nav-links-desktop">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`nav-link ${
                location.pathname === item.href ? "active" : ""
              }`}
            >
              <span className="nav-link-text">{item.name}</span>
              <div className="nav-link-glow"></div>
            </Link>
          ))}
        </div> */}
        <div className="nav-links-desktop">
        {navItems.map((item) => {
  // Hide admin link for non-admin users
  if (item.name.trim().toLowerCase() === "admin" && userInfo?.role !== "admin") {
    return null;
  }

  return (
    <div className="nav-item-with-dropdown" key={item.name}>
      {item.href ? (
        <Link
          onClick={() => onScroll?.(item.section)}
          to={item.href}
          className={`nav-link ${location.pathname === item.href ? "active" : ""}`}
        >
          <span className="nav-link-text">{item.name}</span>
          <div className="nav-link-glow"></div>
        </Link>
      ) : (
        <button onClick={item.action} className="nav-link logout-btn">
          {item.name}
        </button>
      )}

      {item.subItems && (
        <div className="dropdown-menu">
          {item.subItems.map((subItem) => (
            <Link key={subItem.name} to={subItem.href} className="dropdown-item">
              {subItem.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
})}

        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className={`hamburger ${isMenuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`nav-links-mobile ${isMenuOpen ? "open" : ""}`}>
        {navItems.map((item) => (
          <>
            {item.href ? (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link-mobile ${
                  location.pathname === item.href ? "active" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ) : (
              <button onClick={item.action} className="nav-link logout-btn">
                {item.name}
              </button>
            )}
            {/* <Link
            key={item.name}
            to={item.href}
            className={`nav-link-mobile ${
              location.pathname === item.href ? "active" : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            {item.name}
          </Link> */}
          </>
        ))}
      </div>
    </nav>
  );
}
