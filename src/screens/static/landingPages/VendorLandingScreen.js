import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { vendorLogout } from "../../../actions/userManagementActions/vendorActions";
import "./landingScreen.css";
import MainScreen from "../../../components/MainScreen";
import { FaUtensils, FaClipboardList, FaMoneyBillWave, FaChartLine, FaUserCog } from "react-icons/fa";
import swal from "sweetalert";

const VendorLandingScreen = ({ history }) => {
	const vendor_Login = useSelector((state) => state.vendor_Login);
	const { vendorInfo } = vendor_Login;
	const dispatch = useDispatch();

	const logoutHandler = () => {
		// Use SweetAlert instead of Modal for a better UI
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

	const features = [
		{
			title: "Manage Menu",
			description: "Add, update, and delete menu items easily",
			icon: <FaUtensils size={40} className="feature-icon" />,
			link: "/vendor-products",
		},
		{
			title: "Incoming Orders",
			description: "View and manage incoming customer orders",
			icon: <FaClipboardList size={40} className="feature-icon" />,
			link: "/vendor-orders",
		},
		{
			title: "Payment History",
			description: "Track all your transactions and earnings",
			icon: <FaMoneyBillWave size={40} className="feature-icon" />,
			link: "/vendor-payments",
		},
		{
			title: "Analytics",
			description: "View sales and performance statistics",
			icon: <FaChartLine size={40} className="feature-icon" />,
			link: "/vendor-analytics",
		},
		{
			title: "Account Settings",
			description: "Manage your restaurant profile",
			icon: <FaUserCog size={40} className="feature-icon" />,
			link: "/vendor-view",
		},
	];

	if (vendorInfo) {
		return (
			<div className="vendorDashboard">
				<MainScreen title={""}>
					<Container fluid className="dashboard-container">
						{/* Hero Section */}
						<Row className="welcome-section">
							<Col md={7} className="welcome-text">
								<h1>Welcome, {vendorInfo && vendorInfo.name}!</h1>
								<p className="welcome-description">
									Manage your restaurant, update menus, handle orders, and track your business performance all in one
									place. Your restaurant dashboard gives you complete control over your online presence.
								</p>
								<Button variant="danger" onClick={logoutHandler} className="logout-btn">
									Logout
								</Button>
							</Col>
							<Col md={5} className="welcome-image">
								<img
									src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
									alt="Restaurant Admin"
									className="hero-image"
								/>
							</Col>
						</Row>

						{/* Feature Cards Section */}
						<Row className="features-section">
							<Col xs={12}>
								<h2 className="section-title">Restaurant Management Features</h2>
							</Col>

							{features.map((feature, index) => (
								<Col key={index} lg={4} md={6} sm={12} className="feature-card-col">
									<Card className="feature-card">
										<Card.Body>
											<div className="icon-container">{feature.icon}</div>
											<Card.Title>{feature.title}</Card.Title>
											<Card.Text>{feature.description}</Card.Text>
											<Button variant="success" href={feature.link} className="feature-btn">
												Access
											</Button>
										</Card.Body>
									</Card>
								</Col>
							))}
						</Row>
					</Container>
					{/* Removed the Modal component as we're using SweetAlert now */}
				</MainScreen>
			</div>
		);
	} else {
		return (
			<div className="denied">
				<MainScreen />
				<br></br>
			</div>
		);
	}
};

export default VendorLandingScreen;