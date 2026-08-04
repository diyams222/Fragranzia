import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import perfume2 from "../../assets/perfume2.png";
import { Link } from "react-router-dom";


function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/api/users/login",
      {
        email,
        password,
      }
    );

    alert(res.data.message);

    // Save logged-in user
    localStorage.setItem("user", JSON.stringify(res.data.user));

    navigate("/home");

  } catch (error) {
    alert(
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