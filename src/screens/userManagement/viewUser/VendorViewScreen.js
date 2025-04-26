import React, { useState, useEffect } from "react";
import { Button, Row, Col, Card, Container, Badge, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import MainScreen from "../../../components/MainScreen";
import { vendorLogout } from "../../../actions/userManagementActions/vendorActions";
import {
	FaUser,
	FaStore,
	FaEdit,
	FaArrowLeft,
	FaSignOutAlt,
	FaPhone,
	FaHome,
	FaEnvelope,
	FaGlobe,
	FaIdCard,
	FaInfoCircle,
	FaUtensils,
	FaClock,
	FaToggleOn,
} from "react-icons/fa";
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
					className: "swal-button--cancel",
				},
				confirm: {
					text: "Logout",
					value: true,
					visible: true,
					className: "swal-button--danger",
				},
			},
			dangerMode: true,
		}).then((willLogout) => {
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

	// Format time function (e.g., "14:30" to "2:30 PM")
	const formatTime = (timeString) => {
		if (!timeString) return "Not set";

		try {
			const [hours, minutes] = timeString.split(":");
			let hour = parseInt(hours);
			const ampm = hour >= 12 ? "PM" : "AM";
			hour = hour % 12;
			hour = hour ? hour : 12; // the hour '0' should be '12'
			return `${hour}:${minutes} ${ampm}`;
		} catch (error) {
			return timeString;
		}
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
						<Button variant="outline-primary" className="back-btn" href="/vendor">
							<FaArrowLeft /> Back to Dashboard
						</Button>
						<h2 className="profile-title mb-0">Restaurant Profile</h2>
						<Button variant="outline-danger" className="logout-btn" onClick={logoutHandler}>
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
											src={
												vendorInfo.pic ||
												"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
											}
											alt={vendorInfo.name}
											className="profile-image"
										/>
									</div>
									<h3 className="restaurant-name mt-3">{vendorInfo.businessName}</h3>
									<p className="text-muted vendor-name">Managed by {vendorInfo.name}</p>
									<div className="mt-3">
										<Badge bg={vendorInfo.availabilityStatus ? "success" : "danger"} className="status-badge">
											{vendorInfo.availabilityStatus ? "Open for Orders" : "Closed"}
										</Badge>
										{vendorInfo.cuisineType && (
											<Badge bg="info" className="cuisine-badge ms-2">
												{vendorInfo.cuisineType}
											</Badge>
										)}
									</div>
									<div className="mt-4">
										<Button variant="primary" href="/vendor-edit" className="edit-profile-btn">
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
										<Nav.Item>
											<Nav.Link
												className={activeTab === "restaurant" ? "active" : ""}
												onClick={() => setActiveTab("restaurant")}
											>
												<FaUtensils /> Restaurant Details
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

									{/* Restaurant Details Tab - NEW */}
									{activeTab === "restaurant" && (
										<div className="profile-info">
											<h4 className="section-title">Restaurant Operation Details</h4>
											<Row className="info-row">
												<Col md={4} className="info-label">
													<FaUtensils className="info-icon" /> Cuisine Type
												</Col>
												<Col md={8} className="info-value">
													{vendorInfo.cuisineType || <span className="text-muted">Not specified</span>}
												</Col>
											</Row>
											<Row className="info-row">
												<Col md={4} className="info-label">
													<FaClock className="info-icon" /> Operating Hours
												</Col>
												<Col md={8} className="info-value">
													{vendorInfo.openingTime && vendorInfo.closingTime ? (
														`${formatTime(vendorInfo.openingTime)} - ${formatTime(vendorInfo.closingTime)}`
													) : (
														<span className="text-muted">Not specified</span>
													)}
												</Col>
											</Row>
											<Row className="info-row">
												<Col md={4} className="info-label">
													<FaToggleOn className="info-icon" /> Availability Status
												</Col>
												<Col md={8} className="info-value">
													<Badge bg={vendorInfo.availabilityStatus ? "success" : "danger"} className="status-pill">
														{vendorInfo.availabilityStatus ? "Open for Orders" : "Closed"}
													</Badge>
													<p className="mt-2 small text-muted">
														{vendorInfo.availabilityStatus
															? "Your restaurant is currently visible to customers and accepting orders."
															: "Your restaurant is currently not visible to customers and not accepting orders."}
													</p>
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
