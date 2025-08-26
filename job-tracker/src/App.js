import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import { auth, db } from "./firebase";
import NavigationBar from "./NavBar/NavBar";
import Admin from "./pages/Admin";
import Dash from "./pages/DashBoard";
import LoginPage from "./pages/login";
import NotFoundPage from "./pages/NotFoundPages";
import Profile from "./pages/Profile";
import RegisterPage from "./pages/Registration";
import { clearUser, setUserInfo } from "./store/infoUser";

function Layout({ children }) {
  const location = useLocation();

  const hideNavRoutes = ["/login", "/register"];

  const shouldHideNav = hideNavRoutes.includes(location.pathname.toLowerCase());
  const [admin, setAdmin] = useState(
    localStorage.getItem("typeOfUser") === "Admin"
  );
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          dispatch(
            setUserInfo({
              uid: currentUser.uid,
              email: currentUser.email,
              username: userDoc.data().username,
              phoneNumber: userDoc.data().phoneNumber,
              role: userDoc.data().role,
            })
          );
        }
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe(); // إزالة الـ listener عند فك التركيب
  }, [dispatch]);
  // useEffect(() => {
  //   // Whenever typeOfUser changes in localStorage, update the state
  //   const handleStorageChange = () => {
  //     setAdmin(localStorage.getItem("typeOfUser") === "Admin");
  //   };

  //   window.addEventListener("storage", handleStorageChange);

  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, []);
  return (
    <>
      {!shouldHideNav && (
        <NavigationBar
        // onScroll={(section) => {
        //   if (section === "Partner") scrollToComponent(Partner);
        //   else if (section === "Client") scrollToComponent(Client);
        //   else if (section === "OurValue ") scrollToComponent(OurValue);
        //   else if (section === "Owners") scrollToComponent(Owners);
        //   else if (section === "AboutCompany ")
        //     scrollToComponent(AboutCompany);
        // }}
        ></NavigationBar>
      )}
      {children}
      {/* <Footer /> */}
    </>
  );
}

function App() {
  const userInfo = useSelector((state) => state.UserInfo.user);

  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/dashboard" element={<Dash />} />
            <Route path="/profile" element={<Profile />} />
            {userInfo?.role === "admin" ? (
              <Route path="/admin" element={<Admin />} />
            ) : null}
            <Route path="/Login" element={<LoginPage />} />
            {/* <Route path="/logout" element={<Logout />} /> */}
            <Route path="/Register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
