import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RiShoppingCartLine } from "react-icons/ri";
import { CiBellOn } from "react-icons/ci";
import { MdManageAccounts } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import "./Allproducts.css";
import Navbar from "../../components/user/Navbar";
// import per1 from "../../assets/per1.png";
// import per2 from "../../assets/per2.png";
// import per3 from "../../assets/per3.png";
// import per4 from "../../assets/per4.png";
// import per5 from "../../assets/per5.png";

function Allproduct() {

        const [products, setProducts] = useState([]);
        const [wishlist, setWishlist] = useState([]);
        const navigate = useNavigate();
        const user = JSON.parse(localStorage.getItem("user"));

        const handleAddToCart = async (productId) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Please login first!");
        return;
    }

    try {
        const res = await axios.post(
            "http://localhost:5000/api/users/cart",
            {
                userId: user._id,
                productId,
            }
        );

        alert(res.data.message);

    } catch (error) {
        console.error(error);
        alert("Failed to add product to cart");
    }
};

useEffect(() => {
    fetchProducts();
    if (user) fetchWishlist();
}, []);

const fetchProducts = async () => {
    try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
    } catch (error) {
        console.error(error);
    }
};

const fetchWishlist = async () => {
    try {
        const res = await axios.get(`http://localhost:5000/api/users/wishlist/${user._id}`);
        setWishlist(res.data.map((p) => p._id));
    } catch (error) {
        console.error(error);
    }
};

const handleToggleWishlist = async (e, productId) => {
    e.stopPropagation();
    if (!user) {
        alert("Please login first!");
        return;
    }
    const isWishlisted = wishlist.includes(productId);
    try {
        if (isWishlisted) {
            await axios.delete(`http://localhost:5000/api/users/wishlist/${user._id}/${productId}`);
            setWishlist((prev) => prev.filter((id) => id !== productId));
        } else {
            await axios.post("http://localhost:5000/api/users/wishlist", {
                userId: user._id,
                productId,
            });
            setWishlist((prev) => [...prev, productId]);
        }
    } catch (error) {
        console.error(error);
        alert("Failed to update wishlist.");
    }
};

    return(
        <>
<Navbar/>         
        

<div className="allprr">
<div className="allpr">
    <div className="hed">
<h1>All Products</h1>
</div>

<div className="allpr2">
    <h5>Sorted by:</h5>
    <h4>Relevance</h4>
    <h4>Newest First</h4>
    <h4>Popularity</h4>
    <h4>Price low to high</h4>
    <h4>Price high to low</h4>
</div>
</div>
</div>

        
        <div className="sect1-all">
    {products.map((product) => (
        <div
    className="product-card-all"
    key={product._id}
    onClick={() => navigate(`/product/${product._id}`)}
        >

            <button
                className="wishlist-heart-btn-all"
                onClick={(e) => handleToggleWishlist(e, product._id)}
                title={wishlist.includes(product._id) ? "Remove from wishlist" : "Add to wishlist"}
            >
                <FaHeart className={`heart-icon-all ${wishlist.includes(product._id) ? "heart-active-all" : ""}`} />
            </button>

            {product.images?.length > 0 && (
                <img
                    src={`http://localhost:5000/uploads/${product.images[0]}`}
                    alt={product.title}
                />
            )}

            <h3>{product.title}</h3>

            <p className="sprice-all">RS {product.salePrice}</p>
            <p className="oprice-all">RS {product.price}</p>

            <button
            onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(product._id);
            }}>
    Add to Cart
</button>

        </div>
    ))}
</div>
        
        {/* <div className="sect1">
        <div className="per1-a">
                <img src={per1} alt="" />
                <button>Add to cart</button>
        
             </div>
        <div className="per2-a">
                <img src={per2} alt="" />
                <button>Add to cart</button>
                
        
        </div>
        <div className="per3-a">
                <img src={per3} alt="" />
                <button>Add to cart</button>
        
        
        </div>
        </div>
        <div className="sect2">
        <div className="per4-a">
                <img src={per4} alt="" />
                <button>Add to cart</button>
        
        
        </div>
        <div className="per5-a">
                <img src={per5} alt="" />
                <button>Add to cart</button>
        
        
        </div>


        <div className="per6-a">
                <img src={per1} alt="" />
                <button>Add to cart</button>
        
             </div>
             </div>
             <div className="sect3">
        <div className="per7-a">
                <img src={per2} alt="" />
                <button>Add to cart</button>
                
        
        </div>
        <div className="per8-a">
                <img src={per3} alt="" />
                <button>Add to cart</button>
        
        
        </div>
        <div className="per9-a">
                <img src={per4} alt="" />
                <button>Add to cart</button>
        
        
        </div>
        </div> */}
        
        
                {/* </div> */}





        </>
    )
}

export default Allproduct