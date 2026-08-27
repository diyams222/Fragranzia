import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Singlepage.css";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import { getImageUrl } from "../../utils/imageUrl";
import { BASE_URL } from "../../axios";

function Singlepage() {
  const { id } = useParams();
  const navigate = useNavigate(); // NEW

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]); // NEW
  const [suggestedPage, setSuggestedPage] = useState(0);

  useEffect(() => {
    fetchProduct();
    fetchProducts(); // NEW
  }, [id]);

  const fetchProduct = async () => {
    try {
     const res = await axios.get(
  `${BASE_URL}/api/products/${id}`
);

      console.log("Product:", res.data);

      setProduct(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // NEW
  const fetchProducts = async () => {
    try {
     const res = await axios.get(
  `${BASE_URL}/api/products`
);
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!product) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <Navbar />

      <div className="mainsec-s">

        <div className="left-side-s">

          <div className="sec1-s">

            {product.images?.length > 0 && (
              <img
                src={getImageUrl(product.images[0])}
                alt={product.title}
                className="single-image"
              />
            )}

          </div>

        </div>

        <div className="writings">

          <h2>{product.title}</h2>

          <p>⭐⭐⭐⭐☆ 4.5 (1000 Ratings)</p>

          <p>Only {product.quantity} left!</p>

          <h3>₹{product.salePrice}</h3>

          <p className="old-price">₹{product.price}</p>

          <p className="offer">{product.offer}</p>

          <div className="quantity-box">
            <button>-</button>
            <span>1</span>
            <button>+</button>
          </div>

          <h4>Delivery</h4>

          <p>
            Delivery by 28 Aug, Wednesday <br />
            Free if ordered before 9:24 PM
          </p>

          <h4>Description</h4>

          <p>{product.description}</p>

          <div className="buttons">

            <button className="buy-btn">
              Purchase Now
            </button>

            <button className="cart-btn">
              Add To Cart
            </button>

          </div>

        </div>

      </div>

      {/* ---------- Suggested Products ---------- */}

      <div className="sforu">
        <h2>Suggested For You</h2>
      </div>

<div className="featured-section">

    {suggestedPage > 0 && (
        <button
            className="featured-prev-btn"
            onClick={() => setSuggestedPage(prev => prev - 1)}
        >
            &#8249;
        </button>
    )}

    <div className="perfumes">

        {products
            .filter(item => item._id !== product._id)
            .slice(suggestedPage * 5, suggestedPage * 5 + 5)
            .map((item) => (

                <div
                    className="product-card"
                    key={item._id}
                    onClick={() => navigate(`/product/${item._id}`)}
                >

                    {item.images?.length > 0 && (
                        <img
                            src={getImageUrl(item.images[0])}
                            alt={item.title}
                        />
                    )}

                    <h3>{item.title}</h3>

                    <p className="sprice">
                        RS {item.salePrice}
                    </p>

                    <p className="oprice">
                        RS {item.Price}
                    </p>

                    <button>
                        Add to Cart
                    </button>

                </div>

            ))}

    </div>

    {products.filter(item => item._id !== product._id).length >
        (suggestedPage * 5 + 5) && (

        <button
            className="featured-next-btn"
            onClick={() => setSuggestedPage(prev => prev + 1)}
        >
            &#8250;
        </button>

    )}

</div>

      <Footer />
    </>
  );
}

export default Singlepage;