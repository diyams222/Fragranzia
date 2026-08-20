import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import perfume2 from "../../assets/perfume2.png";
import toast from "react-hot-toast";
import "../user/Login.css"; // reuse the same styles — no UI changes

function AdminLogin() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");

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
      localStorage.setItem("user", JSON.stringify(res.data.user));
      // Mark this tab as an active admin tab (tab-local, not shared to new tabs)
      sessionStorage.setItem("adminTab", "true");

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
