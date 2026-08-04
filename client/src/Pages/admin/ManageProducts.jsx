import { useEffect, useState } from "react";
import axios from "axios";
import "./ManageProducts.css";
import AdminNavBar from "../../components/admin/AdminNavBar";
import AdminSidebar from "../../components/admin/AdminSidebar";

function ManageProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };
   
  const deleteProduct = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts();
  } catch (error) {
    console.log(error);
  }
};
  return (
    <div>
      {/* <AdminNavBar /> */}

      <div className="layout-section2">
        {/* <AdminSidebar /> */}

        <div className="manage-products-container">
          <h1 className="manage-title">Manage Products</h1>

          <table className="products-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Sale Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.title}</td>
                  <td>₹{product.price}</td>
                  <td>₹{product.salePrice}</td>
                  <td>{product.quantity}</td>

                  <td>
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn" onClick={() => deleteProduct (product._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default ManageProducts;