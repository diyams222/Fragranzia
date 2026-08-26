import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import perfume2 from "../../assets/perfume2.png";
import toast from "react-hot-toast";
import "../user/Login.css"; // reuse the same styles — no UI changes
import { getUser, getAdminUser, setAdminSession } from "../../utils/authStorage";

function AdminLogin() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");

  // If a User is already logged in, redirect to Home. If Admin is already logged in, go to dashboard.
  useEffect(() => {
    const user = getUser();
    if (user && user.role === "user") {
      navigate("/home", { replace: true });
      return;
    }
    const admin = getAdminUser();
    if (admin && admin.role === "admin") {
      navigate("/showpage", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/admin-login",
        { email, password }
      );

      toast.success(res.data.message);

      // Save admin session
      setAdminSession(res.data.user);

      navigate("/showpage");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <>
      <div className="second-main">
        <div className="second-sec">
          <div className="right">
            <img src={perfume2} alt="perfumee" />
            <div className="text2">
              <h2>Admin Login</h2>
              <br />
              <p>Sign in with your admin credentials<br />to access the dashboard.</p>
            </div>
          </div>

          <div className="login">
            <input
              type="text"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
