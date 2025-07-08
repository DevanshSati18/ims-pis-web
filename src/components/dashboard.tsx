import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/dashboard.css"; 



const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="background"></div>
      <div className="container">
        <div className="nav">
          <img src="/images/logo_pis.png" alt="logo" id="logo" />
          <div className="text">
            <h1 id="header">PRANAVANANDA INTERNATIONAL SCHOOL</h1>
            <h3 id="text1">
              (An Educational Unit of Bharat Sevasharam Sangha)
            </h3>
            <h2 id="text2">School with a difference</h2>
          </div>
          <img src="/images/guruji.jpg" alt="guru" id="guru" />
        </div>

        <button id="logoutButton" onClick={() => navigate("/")}>
          Logout
        </button>

        <center>
          <div className="panel">
            <div className="l1">
              <input
                className="btn"
                type="button"
                onClick={() => navigate("/student-issuing")}
                value="Student Issuing"
              />
              <input
                className="btn"
                type="button"
                onClick={() => navigate("/student-return")}
                value="Student Return"
              />
            </div>

            <div className="l1">
              <input
                className="btn"
                type="button"
                onClick={() => navigate("/teacher-issuing")}
                value="Teacher Issuing"
              />
              <input
                className="btn"
                type="button"
                onClick={() => navigate("/teacher-return")}
                value="Teacher Return"
              />
            </div>

            <div className="l1">
              <input
                className="btn"
                type="button"
                onClick={() => navigate("/book-management")}
                value="Books Management"
              />
              <input
                className="btn"
                type="button"
                onClick={() => navigate("/specimen-books")}
                value="Specimen Books"
              />
              <input
                className="btn l1"
                type="button"
                onClick={() => navigate("/vender-details")}
                value="Vender Details"
              />
            </div>
          </div>
        </center>
      </div>
    </div>
  );
};

export default Dashboard;
