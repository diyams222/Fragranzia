import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiShoppingCartLine } from "react-icons/ri";
import { CiBellOn } from "react-icons/ci";
import { MdManageAccounts } from "react-icons/md";
import "./Navbar.css";
import { FaSearch } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import axios from "axios";
import toast from "react-hot-toast";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [wishlistCount, setWishlistCount] = useState(0);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        fetchWishlistCount();
    }, [location.pathname]); // re-fetch whenever route changes

    // Close drawer on route change
    useEffect(() => {
        setDrawerOpen(false);
    }, [location.pathname]);

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
            toast.error("Please login first!");
            return;
        }
        navigate("/cart");
    };

    const handleWishlistClick = () => {
        const user = localStorage.getItem("user");
        if (!user) {
            toast.error("Please login first!");
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

                    {/* Hamburger — visible only on mobile */}
                    <button
                        className="nav-hamburger"
                        onClick={() => setDrawerOpen(true)}
                        aria-label="Open menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>

            <h3 className="nav-h3">ENJOY FESTIVE DISCOUNTS! FREE SHIPPING ABOVE 999!</h3>

            {/* Mobile Overlay */}
            <div
                className={`nav-mobile-overlay ${drawerOpen ? "open" : ""}`}
                onClick={() => setDrawerOpen(false)}
            />

            {/* Mobile Drawer */}
            <nav className={`nav-mobile-drawer ${drawerOpen ? "open" : ""}`}>
                <div className="drawer-header">
                    <h2>Fragranzia</h2>
                    <button className="drawer-close-btn" onClick={() => setDrawerOpen(false)}>✕</button>
                </div>

                <div className="drawer-search">
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder="search here" />
                </div>

                <ul className="drawer-nav-links">
                    <li><Link to="/home" className={location.pathname === "/home" ? "active" : ""}>Home</Link></li>
                    <li><Link to="/allproducts" className={location.pathname === "/allproducts" ? "active" : ""}>Products</Link></li>
                    <li><Link to="/" className={location.pathname === "/" ? "active" : ""}>Gifting</Link></li>
                    <li><Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link></li>
                    <li><Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>Profile</Link></li>
                </ul>

                <div className="drawer-icons">
                    <button
                        className="nav-wishlist-btn"
                        onClick={() => { setDrawerOpen(false); handleWishlistClick(); }}
                        title="Wishlist"
                    >
                        <FaRegHeart />
                        {wishlistCount > 0 && (
                            <span className="wishlist-badge">{wishlistCount}</span>
                        )}
                    </button>
                    <button onClick={() => { setDrawerOpen(false); handleCartClick(); }}>
                        <RiShoppingCartLine />
                    </button>
                    <button><CiBellOn /></button>
                    <button onClick={() => { setDrawerOpen(false); navigate("/profile"); }}>
                        <MdManageAccounts />
                    </button>
                </div>
            </nav>
        </>
    );
}

export default Navbar;