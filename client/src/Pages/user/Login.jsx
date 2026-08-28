import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import perfume2 from "../../assets/perfume2.png";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getUser, getAdminUser, setUserSession, setAdminSession } from "../../utils/authStorage";
import { BASE_URL } from "../../axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // If already logged in, redirect to respective dashboard/home
  useEffect(() => {
    const admin = getAdminUser();
    if (admin) {
      navigate("/showpage", { replace: true });
      return;
    }
    const user = getUser();
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      let res;
      try {
        res = await axios.post(
          `${BASE_URL}/api/users/login`,
          {
            email,
            password,
          }
        );
      } catch (loginErr) {
        const msg = loginErr.response?.data?.message || "";
        // If live backend throws the legacy admin restriction error, automatically authenticate via admin-login
        if (
          loginErr.response?.status === 403 &&
          (msg.toLowerCase().includes("admin") || msg.toLowerCase().includes("user login"))
        ) {
          res = await axios.post(
            `${BASE_URL}/api/users/admin-login`,
            {
              email,
              password,
            }
          );
        } else {
          throw loginErr;
        }
      }

      const loggedUser = res.data.user;

      if (loggedUser && loggedUser.role && loggedUser.role.trim().toLowerCase() === "admin") {
        setAdminSession(loggedUser);
        toast.success(res.data.message || "Admin Login Successful");
        navigate("/showpage", { replace: true });
      } else {
        setUserSession(loggedUser);
        toast.success(res.data.message || "Login Successful");
        navigate("/home", { replace: true });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login Failed"
      );
    }
  };

  return (
    <>
      <div className="second-main">
        <div className="second-sec">
          <div className="right">
            <img src={perfume2} alt="perfumee" />

            <div className="text2">
              <h2>Welcome Back</h2>
              <br />
              <p>Glad to see you again! Access  your <br />account to explore more.</p>
            </div>
          </div>

          <div className="login">
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>Login</button>
            <br />
             <p>
  Don't have an account?{" "}
  <Link to="/Signup" className="login-link">
    Sign Up
  </Link>
</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;