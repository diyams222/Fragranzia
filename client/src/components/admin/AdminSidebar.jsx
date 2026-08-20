import {
  FaThLarge,
  FaBox,
  FaTags,
  FaUsers,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: "Dashboard",  icon: <FaThLarge />,      path: "/showpage"     },
    { label: "Products",   icon: <FaBox />,           path: "/products"    },
    { label: "Categories", icon: <FaTags />,           path: "/addcategory"  },
    { label: "Customers",  icon: <FaUsers />,          path: "/customers"    },
    { label: "Orders",     icon: <FaClipboardList />,  path: "/adminorders"  },
  ];

  return (
    <div className="main-adminsidebar">
      <div className="dashtar">
        <h2>Dashtar</h2>
      </div>

      <nav className="heds-asb">
        {links.map((link) => (
          <button
            key={link.path}
            className={`sidebar-link ${location.pathname === link.path ? "sidebar-active" : ""}`}
            onClick={() => navigate(link.path)}
          >
            <span className="sidebar-icon">{link.icon}</span>
            {link.label}
          </button>
        ))}
      </nav>

      <div className="asb-btn">
        <button
  className="logout-sidebar-btn"
  onClick={() => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("adminTab");
    navigate("/admin-login");
  }}
>
          <FaSignOutAlt /> Log Out
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;