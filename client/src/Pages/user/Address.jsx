import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Address.css";
import Navbar from "../../components/user/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import { getUser } from "../../utils/authStorage";
import { BASE_URL } from "../../axios";

function Address() {
  const navigate = useNavigate();
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [fullName, setFullName] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");
const [city, setCity] = useState("");
const [state, setState] = useState("");
const [landmark, setLandmark] = useState("");
const [pincode, setPincode] = useState("");
const [alternatePhone, setAlternatePhone] = useState("");
const [addressType, setAddressType] = useState("Home");
const [addresses, setAddresses] = useState([]);

const fetchAddresses = async () => {
  try {
    const user = getUser();
    if (!user || !user._id) return;

    const res = await axios.get(
      `${BASE_URL}/api/users/address/${user._id}`
    );

    setAddresses(Array.isArray(res.data) ? res.data : []);

  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchAddresses();
}, []);



const handleSave = async () => {
  try {
    const user = getUser();
    if (!user || !user._id) {
      toast.error("Please login first");
      return;
    }

    await axios.put(
      `${BASE_URL}/api/users/address/${user._id}`,
      {
        fullName,
        phone,
        address,
        city,
        state,
        landmark,
        pincode,
        alternatePhone,
        addressType,
      }
    );

    toast.success("Address Saved Successfully");
    fetchAddresses();
    setShowAddressForm(false);

  } catch (error) {
    console.log(error);
    toast.error("Failed to save address");
  }
};

const handleDelete = async (addressId) => {
  try {
    const user = getUser();
    if (!user || !user._id) return;

    await axios.delete(
      `${BASE_URL}/api/users/address/${user._id}/${addressId}`
    );

    toast.success("Address deleted successfully");

    fetchAddresses();

  } catch (error) {
    console.log(error);
    toast.error("Failed to delete address");
  }
};

const handleSetPrimary = async (addressId) => {
  try {
    const user = getUser();
    if (!user || !user._id) return;

    await axios.put(
       `${BASE_URL}/api/users/address/${user._id}/primary/${addressId}`
    );

    toast.success("Primary address updated");

    fetchAddresses();

  } catch (error) {
    console.log(error);
    toast.error("Failed to update primary address");
  }
};

  return (
    <>
      <Navbar />

      <div className="address-page">
        <h1>Profile</h1>

        <p className="breadcrumb">Home / Address</p>

        <div className="profile-tabs">
          <button onClick={() => navigate("/profile")}>
            Profile
          </button>

          <button className="active">
            Address
          </button>

          <button onClick={() => navigate("/myorders")}>
            My Orders
          </button>
        </div>

       <div className="address-body">

  <div className="address-header">
    <button
      className="add-address-btn"
      onClick={() => setShowAddressForm(true)}
    >
      Add Address
    </button>
  </div>

  {addresses.map((item, index) => (
   <div className="saved-address" key={index}>

  <div className="address-top">

    <h3>{item.addressType}</h3>

    {item.isPrimary && (
      <span className="primary-badge">
        ★ Primary
      </span>
    )}

  </div>

  <p><strong>{item.fullName}</strong></p>

  <p>{item.phone}</p>

  <p>{item.address}</p>

  <p>
    {item.city}, {item.state} - {item.pincode}
  </p>

  <p>Landmark: {item.landmark}</p>

  {item.alternatePhone && (
    <p>Alt Phone: {item.alternatePhone}</p>
  )}

  <div className="address-actions">

    {!item.isPrimary && (
      <button
        className="primary-btn"
        onClick={() => handleSetPrimary(item._id)}
      >
        Set as Primary
      </button>
    )}

    <button
      className="delete-btn"
      onClick={() => handleDelete(item._id)}
    >
      Delete
    </button>

  </div>

</div>
  ))}

</div>

        {showAddressForm && (
          <div className="address-overlay">

            <div className="address-popup">

              <h3>Address Type</h3>

              <div className="address-type">
  <button
    className={addressType === "Home" ? "active-type" : ""}
    onClick={() => setAddressType("Home")}
    type="button"
  >
    Home
  </button>

  <button
    className={addressType === "Office" ? "active-type" : ""}
    onClick={() => setAddressType("Office")}
    type="button"
  >
    Office
  </button>

  <button
    className={addressType === "Other" ? "active-type" : ""}
    onClick={() => setAddressType("Other")}
    type="button"
  >
    Other
  </button>
</div>

              <div className="row">

                <div className="input-box">
                  <label>Full Name</label>
                 <input
  type="text"
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
/>
                </div>

                <div className="input-box">
                  <label>Phone Number</label>
                  <input
  type="text"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
/>
                </div>

              </div>

              <div className="input-box address-box">
                <label>Address</label>
                <textarea
  value={address}
  onChange={(e) => setAddress(e.target.value)}
></textarea>
              </div>

              <div className="row">

                <div className="input-box">
                  <label>City / District</label>
                 <input
  type="text"
  value={city}
  onChange={(e) => setCity(e.target.value)}
/>
                </div>

                <div className="input-box">
                  <label>State</label>
                 <input
  type="text"
  value={state}
  onChange={(e) => setState(e.target.value)}
/>
                </div>

                <div className="input-box">
                  <label>Land Mark</label>
                 <input
  type="text"
  value={landmark}
  onChange={(e) => setLandmark(e.target.value)}
/>
                </div>

              </div>

              <div className="row">

                <div className="input-box">
                  <label>PinCode</label>
                  <input
  type="text"
  value={pincode}
  onChange={(e) => setPincode(e.target.value)}
/>
                </div>

                <div className="input-box">
                  <label>Alternative Phone Number (Optional)</label>
                 <input
  type="text"
  value={alternatePhone}
  onChange={(e) => setAlternatePhone(e.target.value)}
/>
                </div>

              </div>

              <div className="save-section">

                <button
                  className="cancel-btn"
                  onClick={() => setShowAddressForm(false)}
                >
                  Cancel
                </button>

               <button
  className="save-btn"
  onClick={handleSave}
>
  Save
</button>

              </div>

            </div>

          </div>
        )}

      </div>
    </>
  );
}

export default Address;