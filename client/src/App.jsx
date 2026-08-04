import Signup from "./Pages/user/Signup";
import Login from "./Pages/user/Login";
import Home from "./Pages/user/Home";
import Allproducts from "./Pages/user/Allproducts";
import Singlepage from "./Pages/user/Singlepage";
import Navbar from "./components/user/Navbar";
import AdminNavBar from "./components/admin/AdminNavBar";
import AdminProtectedRoute from "./components/protected-route/AdminProtectedRoute.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminSidebar from "./components/admin/AdminSidebar";
import AddProduct from "./Pages/admin/AddProduct";
import ShowPage from "./Pages/admin/ShowPage";
import AddCategory from "./Pages/admin/AddCategory.jsx";
import Category from "./Pages/admin/Category.jsx";
import Cart  from "./Pages/user/Cart.jsx";
import ManageProducts from "./Pages/admin/ManageProducts";
import Profile from "./Pages/user/Profile.jsx";
import Address from "./Pages/user/Address.jsx";
import MyOrders from "./Pages/user/Myorders.jsx";
import About from "./Pages/user/About.jsx";
import Checkout from "./Pages/user/Checkout";
import Wishlist from "./Pages/user/Wishlist.jsx";
import AdminOrders from "./Pages/admin/AdminOrders.jsx";
import AdminCustomers from "./Pages/admin/AdminCustomers.jsx";
import Products from "./Pages/admin/Products.jsx";

function App() {
  return (
    <div>
      <BrowserRouter>
        {/* <Navbar /> */}

        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/allproducts" element={<Allproducts />} />
          <Route path="/singlepage" element={<Singlepage />} />
          <Route path="/showpage" element={<ShowPage />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/adminnavbar" element={<AdminNavBar />} />
          <Route path="/adminsidebar" element={<AdminSidebar />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/addcategory" element={<AddCategory />} />
          <Route path="/category" element={<Category />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/address" element={<Address />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/product/:id" element={<Singlepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />



          

          <Route element={<AdminProtectedRoute />}>
            <Route path="/showpage" element={<ShowPage />} />
            <Route path="/addProduct" element={<AddProduct />} />
            <Route path="/addcategory" element={<AddCategory />} />
            <Route path="/category" element={<Category />} />
            <Route path="/manageproducts" element={<ManageProducts />} />
            <Route path="/adminorders" element={<AdminOrders />} />
            <Route path="/customers" element={<AdminCustomers />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/products" element={<Products />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;