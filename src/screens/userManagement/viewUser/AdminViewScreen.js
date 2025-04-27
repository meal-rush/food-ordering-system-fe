import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MainScreen from "../../../components/MainScreen";
import { adminLogout } from "../../../actions/userManagementActions/adminActions";
import { FaArrowLeft, FaSignOutAlt, FaUserEdit } from "react-icons/fa";
import "./ViewScreen.css";
import swal from "sweetalert";

const AdminViewScreen = ({ history }) => {
	const [name, setName] = useState("");
	const [telephone, setTelephone] = useState("");
	const [address, setAddress] = useState("");
	const [email, setEmail] = useState("");
	const [pic, setPic] = useState("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");

	const admin_Login = useSelector((state) => state.admin_Login);
	const { adminInfo } = admin_Login;

	useEffect(() => {
		if (adminInfo) {
			setName(adminInfo.name);
			setTelephone(adminInfo.telephone);
			setAddress(adminInfo.address);
			setEmail(adminInfo.email);
			setPic(adminInfo.pic);
		}
	}, [adminInfo]);

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

	if (adminInfo) {
		return (
			<div className="admin-profile-background">
				<MainScreen title="">
					<Container>
						<div className="admin-profile-header">
							<h2 className="admin-profile-title">Administrator Profile</h2>
							<div className="admin-action-buttons">
								<Link to="/admin">
									<Button variant="success" className="back-button">
										<FaArrowLeft /> Dashboard
									</Button>
								</Link>
								<Button variant="danger" onClick={logoutHandler} className="logout-button">
									<FaSignOutAlt /> Logout
								</Button>
							</div>
						</div>

						<Card className="admin-profile-card">
							<Card.Body>
								<Row className="admin-profile-content">
									<Col lg={4} md={5} className="admin-profile-image-col">
										<div className="admin-profile-image-container">
											<img src={pic} alt={name} className="admin-profile-image" />
											<div className="admin-role-badge">Administrator</div>
										</div>
										<Link to="/admin-edit">
											<Button variant="success" className="admin-edit-button">
												<FaUserEdit /> Edit Profile
											</Button>
										</Link>
									</Col>
									
									<Col lg={8} md={7} className="admin-profile-details">
										<h3 className="admin-welcome-text">Welcome, {name}</h3>
										<p className="admin-account-text">Your account details are below</p>
										
										<div className="admin-info-section">
											<div className="admin-info-field">
												<label>Full Name</label>
												<div className="admin-info-value">{name}</div>
											</div>
											
											<div className="admin-info-field">
												<label>Email Address</label>
												<div className="admin-info-value">{email}</div>
											</div>
											
											<div className="admin-info-field">
												<label>Contact Number</label>
												<div className="admin-info-value">{telephone}</div>
											</div>
											
											<div className="admin-info-field">
												<label>Physical Address</label>
												<div className="admin-info-value address-value">{address}</div>
											</div>
										</div>
										
										<div className="admin-access-note">
											<div className="access-badge">Full Admin Access</div>
											<p>You have full administrative privileges to all system functions</p>
										</div>
									</Col>
								</Row>
							</Card.Body>
						</Card>
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

export default AdminViewScreen;