import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Singlepage.css";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";

function Singlepage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );

      console.log("Product:", res.data);

      setProduct(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!product) {
    return <h2 className="loading">Loading...</h2>;
  }

  return (
    <>
      <Navbar />

      <div className="mainsec-s">

        <div className="left-side-s">

          <div className="sec1-s">

            {product.images?.length > 0 && (
              <img
                src={`http://localhost:5000/uploads/${product.images[0]}`}
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

      <Footer />
    </>
  );
}

export default Singlepage;