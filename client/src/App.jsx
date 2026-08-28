import { Toaster } from "react-hot-toast";
import Signup from "./Pages/user/Signup.jsx";
import Login from "./Pages/user/Login.jsx";
import Home from "./Pages/user/Home.jsx";
import Allproducts from "./Pages/user/Allproducts.jsx";
import Singlepage from "./Pages/user/Singlepage.jsx";
import Navbar from "./components/user/Navbar.jsx";
import AdminNavBar from "./components/admin/AdminNavBar.jsx";
import AdminProtectedRoute from "./components/protected-route/AdminProtectedRoute.jsx";
import UserProtectedRoute from "./components/protected-route/UserProtectedRoute.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "./components/admin/AdminSidebar.jsx";
import AddProduct from "./Pages/admin/AddProduct.jsx";
import ShowPage from "./Pages/admin/ShowPage.jsx";
import AddCategory from "./Pages/admin/AddCategory.jsx";
import Category from "./Pages/admin/Category.jsx";
import Cart from "./Pages/user/Cart.jsx";
import ManageProducts from "./Pages/admin/ManageProducts.jsx";
import Profile from "./Pages/user/Profile.jsx";
import Address from "./Pages/user/Address.jsx";
import MyOrders from "./Pages/user/MyOrders.jsx";
import About from "./Pages/user/About.jsx";
import Checkout from "./Pages/user/Checkout.jsx";
import Wishlist from "./Pages/user/Wishlist.jsx";
import AdminOrders from "./Pages/admin/AdminOrders.jsx";
import AdminCustomers from "./Pages/admin/AdminCustomers.jsx";
import Products from "./Pages/admin/Products.jsx";

function App() {
  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            maxWidth: "380px",
            padding: "18px 22px",
            fontSize: "16px",
            fontWeight: "500",
            lineHeight: "1.5",
            borderRadius: "10px",
            boxShadow: "0 4px 18px rgba(0,0,0,0.15)",
          },
          iconTheme: {
            primary: "currentColor",
            secondary: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>

          {/* ==================== PUBLIC ROUTES ==================== */}

          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<Navigate to="/login" replace />} />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/allproducts" element={<Allproducts />} />



          {/* ==================== USER TEST ROUTES ==================== */}

          <Route path="/navbar" element={<Navbar />} />
          <Route path="/about" element={<About />} />



          {/* ==================== USER PROTECTED ROUTES ==================== */}

          <Route element={<UserProtectedRoute />}>


            <Route path="/singlepage" element={<Singlepage />} />

            <Route path="/product/:id" element={<Singlepage />} />

            <Route path="/cart" element={<Cart />} />

            <Route path="/profile" element={<Profile />} />

            <Route path="/address" element={<Address />} />

            <Route path="/myorders" element={<MyOrders />} />


            <Route path="/checkout" element={<Checkout />} />

            <Route path="/wishlist" element={<Wishlist />} />

          </Route>


          {/* ==================== ADMIN PROTECTED ROUTES ==================== */}

          <Route element={<AdminProtectedRoute />}>

            <Route path="/showpage" element={<ShowPage />} />

            <Route path="/addproduct" element={<AddProduct />} />

            <Route path="/addcategory" element={<AddCategory />} />

            <Route path="/category" element={<Category />} />

            <Route path="/manageproducts" element={<ManageProducts />} />

            <Route path="/adminorders" element={<AdminOrders />} />

            <Route path="/customers" element={<AdminCustomers />} />

            <Route path="/products" element={<Products />} />

            <Route path="/adminnavbar" element={<AdminNavBar />} />

            <Route path="/adminsidebar" element={<AdminSidebar />} />

          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;