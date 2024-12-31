import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../css/myAccount/editProfile.css";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    address: "",
    email: "",
    phone: "",
    birthday: "",
    gender: "Male",
    image: "",
    file: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
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

        const userData = response.data;

        // Normalize gender
        let gender = userData.gender?.toLowerCase();
        if (["male", "nam"].includes(gender)) {
          gender = "Male";
        } else if (["female", "nữ", "nu"].includes(gender)) {
          gender = "Female";
        } else {
          gender = "Male"; // Default to Male if undefined
        }

        setFormData({
          username: userData.username || "",
          fullName: userData.fullname || "",
          address: userData.address || "",
          email: userData.email || "",
          phone: userData.phoneNumber || "",
          birthday: userData.dateOfBirth || "",
          gender: gender,
          image:
            userData.image ||
            "http://bootdey.com/img/Content/avatar/avatar1.png", // Default image
          file: null,
        });
      } catch (err) {
        setError("Không thể lấy dữ liệu người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create temporary URL
      setFormData({ ...formData, image: imageUrl, file }); // Set file and preview URL
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleGenderChange = (gender) => {
    setFormData({ ...formData, gender });
  };

  const handleSaveChanges = async () => {
    try {
      const formDataToSend = new FormData();

      // Append form data
      if (formData.file) {
        formDataToSend.append("profileImage", formData.file); // File upload
      }
      formDataToSend.append("Fullname", formData.fullName);
      formDataToSend.append("Address", formData.address);
      formDataToSend.append("Email", formData.email);
      formDataToSend.append("PhoneNumber", formData.phone);
      formDataToSend.append("DateOfBirth", formData.birthday);
      formDataToSend.append("Gender", formData.gender);

      await axios.put(
        "https://localhost:7127/api/member/accounts",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Cập nhật hồ sơ thành công!");
      setError("");
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Không thể cập nhật hồ sơ");
      setSuccess("");
    }
  };

  if (loading) {
    return <p className="edit-profile-loading">Đang tải...</p>;
  }

  return (
    <div className="edit-profile-container">
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <div className="edit-profile-content">
        {/* Profile Picture Section */}
        <div className="edit-profile-card profile-picture-card">
          <div className="edit-profile-card-header">Profile Picture</div>
          <div className="edit-profile-card-body">
            <div className="profile-picture-section">
              <img
                className="edit-profile-img"
                src={
                  formData.image ||
                  "http://bootdey.com/img/Content/avatar/avatar1.png"
                }
                alt="Profile"
              />
              <p className="edit-profile-small-text">
                JPG hoặc PNG, không lớn hơn 5 MB
              </p>
              <input
                type="file"
                accept="image/*"
                id="fileUpload"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <button
                className="edit-profile-btn"
                onClick={() =>
                  document.getElementById("fileUpload").click()
                }
              >
                Tải lên hình ảnh mới
              </button>
            </div>
          </div>
        </div>

        {/* Edit Profile Section */}
        <div className="edit-profile-card edit-profile-details-card">
          <div className="edit-profile-card-header">Edit Profile</div>
          <div className="edit-profile-card-body">
            <form>
              <div className="edit-profile-form-group">
                <label htmlFor="username">Username</label>
                <input
                  className="edit-profile-input"
                  id="username"
                  type="text"
                  value={formData.username}
                  disabled
                />
              </div>

              <div className="edit-profile-row">
                <div className="edit-profile-field">
                  <label htmlFor="fullName">Full name</label>
                  <input
                    className="edit-profile-input"
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="edit-profile-field">
                  <label htmlFor="address">Address</label>
                  <input
                    className="edit-profile-input"
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="edit-profile-form-group">
                <label htmlFor="email">Email</label>
                <input
                  className="edit-profile-input"
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                />
              </div>

              <div className="edit-profile-gender-group">
                <label>Gender:</label>
                <div className="edit-profile-gender">
                  <label>
                    <input
                      type="radio"
                      checked={formData.gender === "Male"}
                      onChange={() => handleGenderChange("Male")}
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={formData.gender === "Female"}
                      onChange={() => handleGenderChange("Female")}
                    />
                    Female
                  </label>
                </div>
              </div>

              <div className="edit-profile-row">
                <div className="edit-profile-field">
                  <label htmlFor="phone">Phone number</label>
                  <input
                    className="edit-profile-input"
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="edit-profile-field">
                  <label htmlFor="birthday">Birthday</label>
                  <input
                    className="edit-profile-input"
                    id="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="edit-profile-actions">
                <button
                  className="edit-profile-save-btn"
                  type="button"
                  onClick={handleSaveChanges}
                >
                  Save changes
                </button>
                <button
                  className="edit-profile-cancel-btn"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
