import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiShoppingCartLine } from "react-icons/ri";
import { CiBellOn } from "react-icons/ci";
import { MdManageAccounts } from "react-icons/md";
import "./Navbar.css";
import { FaSearch } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import axios from "axios";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        fetchWishlistCount();
    }, [location.pathname]); // re-fetch whenever route changes

    const fetchWishlistCount = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            setWishlistCount(0);
            return;
        }
        try {
            const res = await axios.get(
                `http://localhost:5000/api/users/wishlist/${user._id}`
            );
            setWishlistCount(res.data.length);
        } catch (error) {
            console.error("Failed to fetch wishlist count:", error);
        }
    };

    const handleCartClick = () => {
        const user = localStorage.getItem("user");
        if (!user) {
            alert("Please login first!");
            return;
        }
        navigate("/cart");
    };

    const handleWishlistClick = () => {
        const user = localStorage.getItem("user");
        if (!user) {
            alert("Please login first!");
            return;
        }
        navigate("/wishlist");
    };

    return (
        <>
            <div className="navbar">
                <div className="logo">
                    <h2>Fragranzia</h2>

                    <div className="nav-hedings">
                        <li><Link to="/home" className={location.pathname === "/home" ? "active" : ""}>Home</Link></li>
                        <li><Link to="/allproducts" className={location.pathname === "/allproducts" ? "active" : ""}>Products</Link></li>
                        <li><Link to="/" className={location.pathname === "/" ? "active" : ""}>Gifting</Link></li>
                        <li><Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link></li>
                    </div>

                    <div className="nav-right">
                        <div className="search-box">
                            <FaSearch className="search-icon" />
                            <input type="text" placeholder="search here" />
                        </div>
                    </div>

                    <div className="nav-icons">
                        {/* Wishlist Icon with badge */}
                        <button
                            className="nav-wishlist-btn"
                            onClick={handleWishlistClick}
                            title="Wishlist"
                        >
                            <FaRegHeart />
                            {wishlistCount > 0 && (
                                <span className="wishlist-badge">{wishlistCount}</span>
                            )}
                        </button>

                        <button onClick={handleCartClick}>
                            <RiShoppingCartLine />
                        </button>
                        <button><CiBellOn /></button>
                        <button onClick={() => navigate("/profile")}><MdManageAccounts /></button>
                    </div>
                </div>
            </div>

            <h3 className="nav-h3">ENJOY FESTIVE DISCOUNTS! FREE SHIPPING ABOVE 999!</h3>
        </>
    );
}

export default Navbar;