import React, { useState, useEffect } from "react";
import { Button, Row, Col, Card, Container, Badge, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import MainScreen from "../../../components/MainScreen";
import { vendorLogout } from "../../../actions/userManagementActions/vendorActions";
import { FaUser, FaStore, FaEdit, FaArrowLeft, FaSignOutAlt, FaPhone, FaHome, FaEnvelope, FaGlobe, FaIdCard, FaInfoCircle } from "react-icons/fa";
import swal from "sweetalert";
import "./ViewScreen.css";

const VendorViewScreen = ({ history }) => {
  const [activeTab, setActiveTab] = useState("personal");
  
  const vendor_Login = useSelector((state) => state.vendor_Login);
  const { vendorInfo } = vendor_Login;

  const dispatch = useDispatch();

  const logoutHandler = () => {
    swal({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      buttons: {
        cancel: {
          text: "Cancel",
          value: false,
          visible: true,
          className: "swal-button--cancel"
        },
        confirm: {
          text: "Logout",
          value: true,
          visible: true,
          className: "swal-button--danger"
        }
      },
      dangerMode: true,
    })
    .then((willLogout) => {
      if (willLogout) {
        dispatch(vendorLogout());
        
        // Show success message before redirecting
        swal({
          title: "Logged Out!",
          text: "You have been successfully logged out",
          icon: "success",
          timer: 2000,
          button: false,
        });
        
        // Redirect after the success message
        setTimeout(() => {
          history.push("/");
        }, 2000);
      }
    });
  };

  if (!vendorInfo) {
    return (
      <div className="denied">
        <MainScreen />
        <br></br>
      </div>
    );
  }

  return (
    <div className="profileViewBg">
      <MainScreen title="">
        <Container className="py-4">
          {/* Header with navigation buttons */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Button
              variant="outline-primary"
              className="back-btn"
              href="/vendor"
            >
              <FaArrowLeft /> Back to Dashboard
            </Button>
            <h2 className="profile-title mb-0">Restaurant Profile</h2>
            <Button
              variant="outline-danger"
              className="logout-btn"
              onClick={logoutHandler}
            >
              <FaSignOutAlt /> Logout
            </Button>
          </div>

          <Card className="profile-card">
            <Card.Body>
              <Row>
                {/* Profile Picture Column */}
                <Col lg={4} className="text-center profile-image-section mb-4 mb-lg-0">
                  <div className="profile-image-container">
                    <img
                      src={vendorInfo.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                      alt={vendorInfo.name}
                      className="profile-image"
                    />
                  </div>
                  <h3 className="restaurant-name mt-3">{vendorInfo.businessName}</h3>
                  <p className="text-muted vendor-name">Managed by {vendorInfo.name}</p>
                  <div className="mt-3">
                    <Badge bg="success" className="status-badge">Active</Badge>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="primary"
                      href="/vendor-edit"
                      className="edit-profile-btn"
                    >
                      <FaEdit /> Edit Profile
                    </Button>
                  </div>
                </Col>

                {/* Profile Details Column */}
                <Col lg={8}>
                  {/* Tabs Navigation */}
                  <Nav variant="tabs" className="profile-tabs mb-4">
                    <Nav.Item>
                      <Nav.Link 
                        className={activeTab === "personal" ? "active" : ""}
                        onClick={() => setActiveTab("personal")}
                      >
                        <FaUser /> Personal Information
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        className={activeTab === "business" ? "active" : ""}
                        onClick={() => setActiveTab("business")}
                      >
                        <FaStore /> Business Information
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>

                  {/* Personal Information Tab */}
                  {activeTab === "personal" && (
                    <div className="profile-info">
                      <h4 className="section-title">Personal Details</h4>
                      <Row className="info-row">
                        <Col md={4} className="info-label">
                          <FaUser className="info-icon" /> Full Name
                        </Col>
                        <Col md={8} className="info-value">
                          {vendorInfo.name}
                        </Col>
                      </Row>
                      <Row className="info-row">
                        <Col md={4} className="info-label">
                          <FaPhone className="info-icon" /> Phone Number
                        </Col>
                        <Col md={8} className="info-value">
                          {vendorInfo.telephone}
                        </Col>
                      </Row>
                      <Row className="info-row">
                        <Col md={4} className="info-label">
                          <FaHome className="info-icon" /> Home Address
                        </Col>
                        <Col md={8} className="info-value">
                          {vendorInfo.homeAddress}
                        </Col>
                      </Row>
                      <Row className="info-row">
                        <Col md={4} className="info-label">
                          <FaEnvelope className="info-icon" /> Email Address
                        </Col>
                        <Col md={8} className="info-value">
                          {vendorInfo.email}
                        </Col>
                      </Row>
                    </div>
                  )}

                  {/* Business Information Tab */}
                  {activeTab === "business" && (
                    <div className="profile-info">
                      <h4 className="section-title">Business Details</h4>
                      <Row className="info-row">
                        <Col md={4} className="info-label">
                          <FaStore className="info-icon" /> Business Name
                        </Col>
                        <Col md={8} className="info-value">
                          {vendorInfo.businessName}
                        </Col>
                      </Row>
                      <Row className="info-row">
                        <Col md={4} className="info-label">
                          <FaHome className="info-icon" /> Business Address
                        </Col>
                        <Col md={8} className="info-value">
                          {vendorInfo.businessAddress}
                        </Col>
                      </Row>
                      <Row className="info-row">
                        <Col md={4} className="info-label">
                          <FaGlobe className="info-icon" /> Website
                        </Col>
                        <Col md={8} className="info-value">
                          {vendorInfo.website ? (
                            <a href={vendorInfo.website} target="_blank" rel="noopener noreferrer">
                              {vendorInfo.website}
                            </a>
                          ) : (
                            <span className="text-muted">Not provided</span>
                          )}
                        </Col>
                      </Row>
                      <Row className="info-row">
                        <Col md={4} className="info-label">
                          <FaIdCard className="info-icon" /> Registration Number
                        </Col>
                        <Col md={8} className="info-value">
                          {vendorInfo.businessRegNumber}
                        </Col>
                      </Row>
                      <Row className="info-row">
                        <Col md={4} className="info-label">
                          <FaInfoCircle className="info-icon" /> Description
                        </Col>
                        <Col md={8} className="info-value description-value">
                          {vendorInfo.description || <span className="text-muted">No description provided</span>}
                        </Col>
                      </Row>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
        
      </MainScreen>
    </div>
  );
};

export default VendorViewScreen;