import React from "react";
import { Link, useLocation} from "react-router-dom";
import "../../css/sidebar/sidebar.css";

const Sidebar = ({ userInfo }) => {
  const location = useLocation();
  return (
    <div className="col-lg-4 pb-5">
      <div className="author-card pb-3">
        <div
          className="author-card-cover"
          style={{
            backgroundImage: `url(https://bootdey.com/img/Content/flores-amarillas-wallpaper.jpeg)`,
          }}
        >
          <button
            className="btn btn-style-1 btn-white btn-sm"
            data-toggle="tooltip"
            title={`You currently have ${
              userInfo.score || 0
            } Reward points to spend`}
          >
            <i className="fa fa-award text-md"></i>&nbsp;{userInfo.score || 0}{" "}
            points
          </button>
        </div>
        <div className="author-card-profile">
          <div className="author-card-avatar">
            <img
              src={
                userInfo.image ||
                "https://bootdey.com/img/Content/avatar/avatar1.png"
              }
              alt={userInfo.username || "User"}
            />
          </div>
          <div className="author-card-details">
            <h5 className="author-card-name text-lg">{userInfo.username}</h5>
            <span className="author-card-position">
              Joined {new Date(userInfo.registerDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <div className="wizard">
        <nav className="list-group list-group-flush">
          <Link className={`list-group-item ${location.pathname === "/profile" ? "active" : ""}`} to="/profile">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <i className="fa fa-user text-muted"></i>
                <div className="d-inline-block font-weight-medium text-uppercase">
                  Profile
                </div>
              </div>
            </div>
          </Link>
          <Link className={`list-group-item ${location.pathname === "/scores" ? "active" : ""}`} to="/scores">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <i className="fa fa-star mr-1 text-muted"></i>
                <div className="d-inline-block font-weight-medium text-uppercase">
                  History Score
                </div>
              </div>
            </div>
          </Link>
          <Link className={`list-group-item ${location.pathname === "/tickets" ? "active" : ""}`} to="/tickets">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <i className="fa fa-tag mr-1 text-muted"></i>
                <div className="d-inline-block font-weight-medium text-uppercase">
                  Booked Tickets
                </div>
              </div>
            </div>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;