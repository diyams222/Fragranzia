import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";
import perfume from "../../assets/perfume.png";
import { Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/signup",
        {
          name,
          email,
          password,
        }
      );

      alert(res.data.message);

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Go to Home page
      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.message || "Signup Failed");
    }
  };

  return (
    <>
      <div className="first-main">
        <div className="first-sec">

          <div className="left">
            <img src={perfume} alt="perfume" />
            <div className="text1">
              <h2>Let's Get Started!</h2>
              <p>Create your account and unlock the full <br />potential of Fragnanzia.</p>
            </div>
          </div>

          <div className="signup">
            <h3>Sign Up</h3>
            <br />

            <input
              type="text"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
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

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button onClick={handleSignup}>Sign Up</button><br />
            <p>
  Already have an account?{" "}
  <Link to="/login" className="signin-link">
    Sign In
  </Link>
</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;