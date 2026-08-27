import { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import Footer from "../../components/user/Footer";
import toast from "react-hot-toast";
import { getUser } from "../../utils/authStorage";
import { getImageUrl } from "../../utils/imageUrl";


import "./Home.css";
import Navbar from "../../components/user/Navbar";
import small1 from "../../assets/small1.png";
import small2 from "../../assets/small2.png";
import small3 from "../../assets/small3.png";
import text1 from "../../assets/text1.png";
import text2 from "../../assets/text2.png";
import text3 from "../../assets/text3.png";
import per1 from "../../assets/per1.png";
import per2 from "../../assets/per2.png";
import per3 from "../../assets/per3.png";
import per4 from "../../assets/per4.png";
import per5 from "../../assets/per5.png";
import pcard1 from "../../assets/pcard1.png";
import pcard2 from "../../assets/pcard2.png";
import pcard3 from "../../assets/pcard3.png";
import pcard4 from "../../assets/pcard4.png";
import pcard5 from "../../assets/pcard5.png";
import pic from "../../assets/pic.png";
import pic2 from "../../assets/pic2.png";
import pic3 from "../../assets/pic3.png";
import sp1 from "../../assets/sp1.png";
import sp2 from "../../assets/sp2.png";
import sp3 from "../../assets/sp3.png";
import sp4 from "../../assets/sp4.png";
import sp5 from "../../assets/sp5.png";
import endsec from "../../assets/endsec.png";
import bluebig from "../../assets/bluebig.jpg";
import yellowbig from "../../assets/yellowbig.png";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../axios";



function home() {

    const navigate = useNavigate();

    const banners = [bluebig, yellowbig];

    const [currentSlide, setCurrentSlide] = useState(0);
    
    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [featuredPage, setFeaturedPage] = useState(0);
    const user = getUser();



useEffect(() => {
    fetchProducts();
    if (user) fetchWishlist();
}, []);

useEffect(() => {
    const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
}, []);

const fetchProducts = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/api/products`);
        if (Array.isArray(res.data)) {
            setProducts(res.data);
        }
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }
};

const fetchWishlist = async () => {
    try {
        const currentUser = getUser();
        if (!currentUser || !currentUser._id) return;

        const res = await axios.get(
            `${BASE_URL}/api/users/wishlist/${currentUser._id}`
        );
        if (Array.isArray(res.data)) {
            setWishlist(res.data.filter(Boolean).map((p) => p._id));
        }
    } catch (error) {
        console.error("Failed to fetch wishlist:", error);
    }
};

const handleToggleWishlist = async (e, productId) => {
    e.stopPropagation();
    const currentUser = getUser();
    if (!currentUser) {
        toast.error("Please login first!");
        return;
    }
    const isWishlisted = wishlist.includes(productId);
    try {
    if (isWishlisted) {
        await axios.delete(
            `${BASE_URL}/api/users/wishlist/${currentUser._id}/${productId}`
        );
        setWishlist((prev) => prev.filter((id) => id !== productId));
    } else {
        await axios.post(`${BASE_URL}/api/users/wishlist`, {
            userId: currentUser._id,
            productId,
        });
        setWishlist((prev) => [...prev, productId]);
    }
    } catch (error) {
        console.error(error);
        toast.error("Failed to update wishlist.");
    }
};


    const handleAddToCart = async (productId) => {
    const user = getUser();

    if (!user) {
        toast.error("Please login first!");
        return;
    }

    try {
      const res = await axios.post(
  `${BASE_URL}/api/users/cart`,
  {
    userId: user._id,
    productId,
  }
);

        toast.success(res.data.message);

    } catch (error) {
        console.error(error);
        toast.error("Failed to add product to cart");
    }
};

    return(
        <>
        
<Navbar/>

        <div className="logsign-btn"> 
        <button><Link to="/signup" className={Location.pathname === "/Signup" ? "active" : ""}>SignUp</Link></button>
        <br />
        <button><Link to="/login" className={Location.pathname === "/Login" ? "active" : ""}>Login</Link></button>
        </div>
                

        <div className="hero-slider">

    <img
        src={banners[currentSlide]}
        alt="Banner"
        className="hero-banner"
    />

    <button
        className="shop-now-btn"
        onClick={() => navigate("/allproducts")}
    >
        Shop Now
    </button>

    <div className="slider-dots">

        {banners.map((_, index) => (

            <span
                key={index}
                className={currentSlide === index ? "dot active-dot" : "dot"}
                onClick={() => setCurrentSlide(index)}
            ></span>

        ))}

    </div>

</div>

        <div className="smalls">
            <img src={small1} alt="per" />
            <img src={small2} alt="perr" />
            <img src={small3} alt="perf" />

        </div>


        <div className="text">

            {/* <div className="text1"> */}
        <img src={text1}  alt="text" />
        {/* </div> */}

            {/* <div className="text2"> */}
        <img src={text2}  alt="text" />
        {/* </div> */}

            {/* <div className="text3"> */}
        <img src={text3}  alt="text" />
        {/* </div> */}

        </div>


<div className="feau">
    <h2>Feautured Collections</h2>
</div>

<div className="featured-section">

    {featuredPage > 0 && (
        <button
            className="featured-prev-btn"
            onClick={() => setFeaturedPage(prev => prev - 1)}
        >
            &#8249;
        </button>
    )}

    <div className="perfumes">
        {products.slice(featuredPage * 5, featuredPage * 5 + 5).map((product) => (
            <div className="product-card" key={product._id}>

                <button
                    className="wishlist-heart-btn"
                    onClick={(e) => handleToggleWishlist(e, product._id)}
                    title={wishlist.includes(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <FaHeart className={`heart-icon ${wishlist.includes(product._id) ? "heart-active" : ""}`} />
                </button>

                {product.images?.length > 0 && (
                    <img
                        src={getImageUrl(product.images[0])}
                        alt={product.title}
                    />
                )}

                <h3>{product.title}</h3>

                <p className="sprice">RS {product.salePrice}</p>
                <p className="oprice">RS {product.Price}</p>

                <button onClick={() => handleAddToCart(product._id)}>
                    Add to Cart
                </button>
            </div>
        ))}
    </div>

    {products.length > (featuredPage * 5 + 5) && (
        <button
            className="featured-next-btn"
            onClick={() => setFeaturedPage(prev => prev + 1)}
        >
            &#8250;
        </button>
    )}

</div>

  

        <div className="para">
            <p>"It's an art. A craft. A science. At Fragranzia, we're in <br /> the business of creating memories that last forever <br /> through our fragrances."</p>
        </div>




        <div className="pics">
            <div>
                <img src={pic} alt="" />
            </div>
            <div>
                <img src={pic2} alt="" />
            </div>
            <div>
                <img src={pic3} alt="" />
            </div>
        </div>



        <div className="explore">
        <h2>Explore Categories</h2>
        </div>

        <div className="sprays">

           <div><img src={sp1} alt="" /></div> 
            <div><img src={sp2} alt="" /></div>
            <div><img src={sp3} alt="" /></div>
            <div><img src={sp4} alt="" /></div>
            <div><img src={sp5} alt="" /></div>



            
        </div>
        



<div className="offers">
<h2>Offers Zone</h2>
</div>


<div className="perfumes">
  {products.slice(5, 10).map((product) => (
    <div className="product-card" key={product._id}>

      <button
        className="wishlist-heart-btn"
        onClick={(e) => handleToggleWishlist(e, product._id)}
        title={wishlist.includes(product._id) ? "Remove from wishlist" : "Add to wishlist"}
      >
        <FaHeart className={`heart-icon ${wishlist.includes(product._id) ? "heart-active" : ""}`} />
      </button>

      {product.images?.length > 0 && (
        <img
          src={getImageUrl(product.images[0])}
          alt={product.title}
        />
      )}

      <h3>{product.title}</h3>

      <p className="sprice">RS {product.salePrice}</p>
      <p className="oprice">RS {product.Price}</p>

      <button onClick={() => handleAddToCart(product._id)}>
        Add to Cart
      </button>
    </div>
  ))}
</div>



<div className="endsection">
        <img src={endsec} alt="" />
        </div>


<div className="end"> 
<div>
        <h2>Fragranzia</h2>
        </div>

        <div>
            <h6>Pages</h6>
            <p>Home</p>
            <p>Products</p>
            <p>Gifting</p>
            <p>About</p>
            <p>Profile</p>
        </div>

        <div>
            <h6>Quick Links</h6>
            <p>Privacy Policy</p>
            <p>Terms and <br/>conditions</p>
            <p>FAQs</p>
            <p>Customer <br/>service</p>

            </div>
            </div>


        </>


    )
}

export default home