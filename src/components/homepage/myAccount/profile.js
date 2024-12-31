import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../css/myAccount/profile.css";
import Sidebar from "../../sidebar/sidebar.js";
import { Link } from "react-router-dom";
import ChangePasswordPopup from "./changePasswordPopup";
const Profile = () => {
  const [showPopup, setShowPopup] = useState(false);

  const [userInfo, setUserInfo] = useState({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    email: "",
    gender: "",
    identityCard: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      setError("Access token is missing. Please log in.");
      setLoading(false);
      return;
    }
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://localhost:7127/api/member/accounts",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = response.data;
        setUserInfo({
          fullName: data.fullname,
          phoneNumber: data.phoneNumber,
          dateOfBirth: data.dateOfBirth,
          address: data.address,
          email: data.email,
          gender: data.gender,
          identityCard: data.identityCard,
          username: data.username,
          image: data.image,
          registerDate: data.registerDate,
        });
      } catch (err) {
        setError("Failed to fetch user information");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="profile-container">
      <Sidebar userInfo={userInfo} />
      <div className="profile-card">
        <h3 className="profile-title">Profile Detail</h3>
        <div className="profile-info">
          <div className="profile-row">
            <strong>Full Name:</strong>
            <span>{userInfo.fullName}</span>
          </div>
          <div className="profile-row">
            <strong>Phone Number:</strong>
            <span>{userInfo.phoneNumber}</span>
          </div>
          <div className="profile-row">
            <strong>Date of Birth:</strong>
            <span>{new Date(userInfo.dateOfBirth).toLocaleDateString()}</span>
          </div>
          <div className="profile-row">
            <strong>Address:</strong>
            <span>{userInfo.address}</span>
          </div>
          <div className="profile-row">
            <strong>Email:</strong>
            <span>{userInfo.email}</span>
          </div>
          <div className="gender-selection">
            <strong>Gender:</strong>
            <label>
              <input
                type="checkbox"
                checked={["Nam", "nam", "Male", "male"].includes(
                  userInfo.gender
                )}
                readOnly
              />{" "}
              Male
            </label>
            <label style={{ marginLeft: "15px" }}>
              <input
                type="checkbox"
                checked={["Nữ", "nu", "Nữ", "Nu", "Female", "female"].includes(
                  userInfo.gender
                )}
                readOnly
              />{" "}
              Female
            </label>
          </div>
          <div className="profile-row">
            <strong>Identity Card:</strong>
            <span>{userInfo.identityCard}</span>
          </div>
        </div>
        <div className="profile-buttons">
          <Link to="/profile/edit" className="btn btn-primary mr-2">
            Edit Profile
          </Link>
          <div>
            <button
              className="btn btn-secondary"
              onClick={() => setShowPopup(true)}
            >
              Change Password
            </button>
            {showPopup && (
              <ChangePasswordPopup onClose={() => setShowPopup(false)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
