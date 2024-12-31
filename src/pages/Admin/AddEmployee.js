import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import để chuyển trang
import axios from 'axios';
import "../../css/Admin/addAdmin.css";

const AddEmployeeForm = () => {
    const navigate = useNavigate(); // Sử dụng useNavigate để chuyển trang
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        fullname: '',
        dateOfBirth: '',
        gender: '',
        identityCard: '',
        email: '',
        address: '',
        phoneNumber: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'https://localhost:7127/api/admin/employees',
                {
                    ...formData,
                    gender: formData.gender === "Male" ? "Nam" : "Nữ", // Thay đổi giá trị gender trước khi gửi
                }
            );
            alert(response.data?.statusMessage || 'Employee added successfully!');
            navigate('/admin/users'); // Chuyển về trang danh sách Employee
        } catch (error) {
            // Xử lý lỗi và hiển thị thông báo lỗi chi tiết
            const errorResponse = error.response?.data;
            if (errorResponse?.errors) {
                alert(
                    `Error: ${errorResponse.statusMessage}\n` +
                    errorResponse.errors.join("\n") // Hiển thị tất cả lỗi chi tiết
                );
            } else {
                alert('An unknown error occurred while adding the employee.');
            }
        }
    };

    return (
        <div className="form-container">
            <h2>Add New Employee</h2>
            <form onSubmit={handleSubmit} className="add-employee-form">
                {/* Username and Fullname */}
                <div className="form-row">
                    <label>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Fullname:
                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                {/* Password and Confirm Password */}
                <div className="form-row">
                    <label>
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Confirm Password:
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                {/* Date of Birth */}
                <label>
                    Date of Birth:
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                {/* Gender */}
                <label>
                    Gender:
                    <div className="gender-options">
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={formData.gender === "Male"}
                                onChange={handleInputChange}
                            />
                            Male
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={formData.gender === "Female"}
                                onChange={handleInputChange}
                            />
                            Female
                        </label>
                    </div>
                </label>
                {/* Identity Card */}
                <label>
                    Identity Card:
                    <input
                        type="text"
                        name="identityCard"
                        value={formData.identityCard}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                {/* Email */}
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                {/* Address */}
                <label>
                    Address:
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                {/* Phone Number */}
                <label>
                    Phone Number:
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                {/* Actions */}
                <div className="form-actions">
                    <button type="submit" className="btn-submit">
                        Add
                    </button>
                    <button
                        type="button"
                        className="btn-back"
                        onClick={() => navigate('/admin/users')} // Quay lại danh sách Employee
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEmployeeForm;
