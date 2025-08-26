// src/pages/LoginPage.jsx
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { auth, db } from "../firebase";
import { setUserInfo } from "../store/infoUser";
import styles from "./css/login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  // const [user, setUser] = useState(null);

  const dispatch = useDispatch();

  // function unsubscibe() {
  //   onAuthStateChanged(auth, async (currentUser) => {
  //     // setUser(currentUser);
  //     if (currentUser) {
  //       const userDoc = await getDoc(doc(db, "users", currentUser.uid));

  //       if (userDoc.exists()) {
  //         // setUser({
  //         //   ...currentUser,
  //         //   username: userDoc.data().username,
  //         //   email: userDoc.data().email,
  //         // });

  //         console.log(userDoc.data());
  //         dispatch(
  //           setUserInfo({
  //             uid: currentUser.uid,
  //             email: currentUser.email,
  //             username: userDoc.data().username,
  //             phoneNumber: userDoc.data().phoneNumber,
  //             role: userDoc.data().role,
  //           })
  //         );
  //         //  localStorage.setItem("info", JSON.stringify(userDoc.data()));
  //       }
  //     } else {
  //       // setUser(currentUser);
  //       navigate("/Login");
  //     }
  //   });
  //   // return () => unsubscibe();
  // }
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const currentUser = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        dispatch(
          setUserInfo({
            ...userDoc.data(),
          })
        );
      }
      Swal.fire({
        title: "login successful",
        icon: "success",
        draggable: true,
      });

      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    }
    // try {
    //   const response = await axios.post("http://localhost:3001/auth/login", {
    //     email,
    //     password,
    //   });
    //   localStorage.setItem("typeOfUser", response.data.data.role);

    //   localStorage.setItem("token", response.data.token);
    //   navigate("/");
    // } catch (err) {
    //   console.error("Login error:", err);
    //   setErrorMsg("An error occurred. Please try again.");
    // }
  };

  return (
    <div className={styles.loginPageWrapper}>
      <div className={styles.loginContainer}>
        <h2 className={styles.loginTitle}>Login</h2>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your@example.com"
              required
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="********"
              required
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}
          <button type="submit" className={styles.submitButton}>
            Sign In
          </button>
        </form>

        <p className={styles.registerPrompt}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.registerLink}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
