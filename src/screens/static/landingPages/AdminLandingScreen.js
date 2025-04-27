import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { adminLogout } from "../../../actions/userManagementActions/adminActions";
import "./landingScreen.css";
import MainScreen from "../../../components/MainScreen";
import { 
  FaUserShield, 
  FaUserPlus, 
  FaUsers, 
  FaStoreAlt, 
  FaCubes, 
  FaShoppingCart, 
  FaTruckMoving,
  FaSignOutAlt
} from "react-icons/fa";
import swal from "sweetalert";

const AdminLandingScreen = ({ history }) => {
	const admin_Login = useSelector((state) => state.admin_Login);
	const { adminInfo } = admin_Login;
	const dispatch = useDispatch();

	const logoutHandler = () => {
		// Use SweetAlert for better UX
		swal({
			title: "Admin Logout",
			text: "Are you sure you want to log out?",
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
				dispatch(adminLogout());
				
				swal({
					title: "Logged Out",
					text: "Admin session terminated successfully",
					icon: "success",
					timer: 2000,
					button: false,
				});
				
				setTimeout(() => {
					history.push("/");
				}, 2000);
			}
		});
	};

	const adminFeatures = [
		{
			title: "Admin Profile",
			description: "Manage your administrator account",
			icon: <FaUserShield size={40} className="admin-icon" />,
			link: "/admin-view",
			variant: "success",
		},
		{
			title: "Register Admin",
			description: "Create new administrator accounts",
			icon: <FaUserPlus size={40} className="admin-icon" />,
			link: "/admin-register",
			variant: "success",
		},
		{
			title: "Customer Accounts",
			description: "Manage all customer accounts and profiles",
			icon: <FaUsers size={40} className="admin-icon" />,
			link: "/admin-customers",
			variant: "success",
		},
		{
			title: "Vendor Management",
			description: "Oversee all restaurant partner accounts",
			icon: <FaStoreAlt size={40} className="admin-icon" />,
			link: "/admin-vendors",
			variant: "success",
		},
		{
			title: "Product Catalog",
			description: "Manage all products across the platform",
			icon: <FaCubes size={40} className="admin-icon" />,
			link: "/admin-products",
			variant: "success",
		},
		{
			title: "Order Operations",
			description: "Monitor and manage all customer orders",
			icon: <FaShoppingCart size={40} className="admin-icon" />,
			link: "/admin-orders",
			variant: "success",
		},
		{
			title: "Delivery System",
			description: "Track and optimize delivery operations",
			icon: <FaTruckMoving size={40} className="admin-icon" />,
			link: "/admin-deliveries",
			variant: "success",
		}
	];

	if (adminInfo) {
		return (
			<div className="adminBackground">
				<MainScreen title={""}>
					<Container fluid className="admin-dashboard-container">
						{/* Admin Header Section */}
						<Row className="admin-header-section">
							<Col md={8} className="admin-welcome">
								<div className="admin-title-area">
									<h1>Admin Control Panel</h1>
									<h3>Welcome, {adminInfo && adminInfo.name}</h3>
									<p className="admin-subtitle">
										Manage your entire platform from this centralized dashboard. You have full
										access to all system operations and management tools.
									</p>
									<Button 
										variant="danger" 
										onClick={logoutHandler} 
										className="admin-logout-btn"
									>
										<FaSignOutAlt /> Logout
									</Button>
								</div>
							</Col>
							<Col md={4} className="admin-stats">
								<div className="admin-stat-card">
									<h4>System Status</h4>
									<p className="status-indicator online">Online</p>
									<small>Last login: Today, {new Date().toLocaleTimeString()}</small>
								</div>
							</Col>
						</Row>

						{/* Admin Features Section */}
						<Row className="admin-features-section">
							<Col xs={12}>
								<h2 className="admin-section-title">Administration Tools</h2>
							</Col>

							{adminFeatures.map((feature, index) => (
								<Col key={index} lg={4} md={6} sm={12} className="admin-feature-col">
									<Card className="admin-feature-card">
										<Card.Body>
											<div className={`admin-icon-container green-${index % 3 + 1}`}>
												{feature.icon}
											</div>
											<Card.Title className="admin-card-title">{feature.title}</Card.Title>
											<Card.Text>{feature.description}</Card.Text>
											<Link to={feature.link}>
												<Button 
													variant="success" 
													className="admin-feature-btn" 
													block
												>
													Access Module
												</Button>
											</Link>
										</Card.Body>
									</Card>
								</Col>
							))}
						</Row>
					</Container>
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

export default AdminLandingScreen;