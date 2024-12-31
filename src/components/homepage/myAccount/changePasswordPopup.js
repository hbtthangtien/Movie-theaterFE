import React, { useState } from "react";
import axios from "axios";
import "../../../css/myAccount/passwordPopup.css";
import { useNavigate } from "react-router-dom";
const ChangePasswordPopup = ({ onClose }) => {
    const [formData, setFormData] = useState({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("role");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userLogged");
        window.location.href = "/"; // Điều hướng về trang chủ
      };
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSave = async () => {
        try {
          setError("");
          setSuccess("");
      
          const response = await axios.put(
            "https://localhost:7127/api/member/accounts/password",
            {
              currentPassword: formData.currentPassword,
              newPassword: formData.newPassword,
              confirmNewPassword: formData.confirmNewPassword,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
      
          // Kiểm tra phản hồi HTTP status
          if (response.status === 200) {
            setSuccess("Password changed successfully!");
            setFormData({
              currentPassword: "",
              newPassword: "",
              confirmNewPassword: "",
            });
            handleLogout();
          }
          console.log("API Response:", response.data);
        } catch (err) {
            console.error("Error:", err.response);
          setError(err.response?.data?.errors?.[0] || "An error occurred.");
        }
      };
      
  
    return (
      <div className="popup-overlay">
        <div className="popup-content">
          <h3>Change Password</h3>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}
          <div className="popup-buttons">
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ChangePasswordPopup;