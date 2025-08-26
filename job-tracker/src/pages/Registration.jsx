"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { auth, db } from "../firebase";
import styles from "./css/Registration.module.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    repassword: "",
    phone: "",
  });
  const firebaseErrorMessages = {
    "auth/email-already-in-use": "This email is already registered",
    "auth/invalid-email": "Please enter a valid email address",
    "auth/weak-password": "Password must be at least 6 characters",
    "auth/user-not-found": "No account found with this email",
    "auth/wrong-password": "Incorrect password",
    "auth/too-many-requests": "Too many attempts. Try again later",
    "auth/user-disabled": "This account has been disabled",
  };
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.repassword) {
      alert("Password donot match ");
      setMessage("Password does not match !");
      setFormData({
        email: "",
        username: "",
        password: "",
        repassword: "",
        phone: "",
      });
      return;
    }

    setErrors({});
    setMessage("");
    setLoading(true);

    try {
      const userCredtials = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredtials.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phone,
        role: "user",
      });
      Swal.fire({
        icon: "success",
        title: "Success...",
        text: "Added User Scsusfuly ",
        footer: '<a href="#">Why do I have this issue?</a>',
      });

      navigate("/Login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: firebaseErrorMessages[error.code] + "",
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    }
    // try {
    //   const response = await axios.post(
    //     "http://localhost:3001/auth/Register",
    //     formData
    //   );

    //   const data = await response.data;

    //   if (!response.ok) {
    //     setErrors(data.errors || {});
    //     setMessage(data.message || "Registration failed");
    //     setFormData({
    //       email: "",
    //       username: "",
    //       password: "",
    //       repassword: "",
    //       phone: "",
    //     });
    //   } else {
    //     setMessage("Registration successful!");
    //     setFormData({
    //       email: "",
    //       username: "",
    //       password: "",
    //       repassword: "",
    //       phone: "",
    //     });
    //     setSelectedRole(null);
    //   }
    // } catch (error) {
    //   if (error.response && error.response.status === 409) {
    //     setErrors(error.response.data.errors || {});
    //     setMessage(
    //       error.response.data.message ||
    //         "Registration failed: Email already exists"
    //     );
    //   } else {
    //     setMessage("Registration failed. Please try again.");
    //   }
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create an Account</h1>
        <p className={styles.description}>Enter your details to register.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={styles.input}
              required
            />
            {errors.username && (
              <p className={styles.error}>{errors.username}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              required
            />
            {errors.password && (
              <div className={styles.errorList}>
                <p>Password must:</p>
                <ul>
                  {Array.isArray(errors.password) ? (
                    errors.password.map((err) => <li key={err}>- {err}</li>)
                  ) : (
                    <li>{errors.password}</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="repassword" className={styles.label}>
              Confirm Password
            </label>
            <input
              id="repassword"
              name="repassword"
              type="password"
              value={formData.repassword}
              onChange={handleChange}
              className={styles.input}
              required
            />
            {errors.repassword && (
              <p className={styles.error}>{errors.repassword}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g. 0791234567"
              required
            />
            {errors.phone && <p className={styles.error}>{errors.phone}</p>}
          </div>

          {/* Uncomment and update this if you want role selection */}
          {/* <div className={styles.formGroup}>
            <label className={styles.label}>Select Role</label>
            <div className={styles.roleSelection}>
              <button
                type="button"
                onClick={() => handleRoleSelect("customer")}
                className={`${styles.roleButton} ${
                  selectedRole === "customer" ? styles.activeRole : ""
                }`}
              >
                <UserIcon className={styles.roleIcon} />
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("admin")}
                className={`${styles.roleButton} ${
                  selectedRole === "admin" ? styles.activeRole : ""
                }`}
              >
                <ShieldCheckIcon className={styles.roleIcon} />
                Admin
              </button>
            </div>
            {errors.role && <p className={styles.error}>{errors.role}</p>}
          </div> */}

          {message && <p className={styles.errorMessage}>{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className={styles.loginLink}>
          Already have an account?
          <a href="/login" className={styles.loginAnchor}>
            {" "}
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
