// import { Button, Card } from "react-bootstrap";
// import MainScreen from "../../../components/MainScreen";
// import "./loginSelector.css";

// const LoginSelectorScreen = () => {
// 	return (
// 		<div className="loginSelectBg">
// 			<br></br>
// 			<MainScreen title={"Log in Here ..."}>
// 				<br></br>
// 				<Card
// 					style={{
// 						borderRadius: 45,
// 						borderWidth: 2.0,
// 						marginTop: 20,
// 						paddingInline: 10,
// 						background: "rgba(231, 238, 238, 0.8)",
// 						marginLeft: "20%",
// 						marginRight: "20%",
// 					}}
// 				>
// 					<div className="loginSelect">
// 						<div className="intro-text" style={{ marginTop: 10 }}>
// 							<br></br>
// 							<br></br>
// 							<a href="/customer-login">
// 								<Button id="loginBtn" size="lg" style={{ width: 350, height: 75 }}>
// 									Customer Login
// 								</Button>
// 							</a>
// 							<br></br>
// 							<br></br>
// 							<a href="/vendor-login">
// 								<Button id="loginBtn" size="lg" style={{ width: 350, height: 75 }}>
// 									Vendor Login
// 								</Button>
// 							</a>
// 							<br></br>
// 							<br></br>
// 							<a href="/admin-login">
// 								<Button id="loginBtn" size="lg" style={{ width: 350, height: 75 }}>
// 									Admin Login
// 								</Button>
// 							</a>
// 							<br></br>
// 							<br></br>
// 							<br></br>
// 							<br></br>
// 						</div>
// 					</div>
// 				</Card>
// 			</MainScreen>
// 		</div>
// 	);
// };

// export default LoginSelectorScreen;

import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaUser, FaStore, FaUserShield, FaMotorcycle, FaArrowRight } from "react-icons/fa";
import MainScreen from "../../../components/MainScreen";
import "./loginSelector.css";

const LoginSelectorScreen = () => {
	return (
	  <div className="login-selector-page">
		<MainScreen>
		  <Container>
			<Row className="justify-content-center">
			  <Col lg={10} md={12}>
				<div className="login-selector-intro text-center mb-4">
				  <h2>Choose your login type</h2>
				  <p>Access your account based on your role in the system</p>
				</div>
				
				<Row className="role-cards">
				  <Col lg={3} md={6} sm={12}>
					<Card className="role-card customer-card">
					  <Card.Body>
						<div className="role-icon">
						  <FaUser />
						</div>
						<Card.Title>Customer</Card.Title>
						<Card.Text>
						  Order food from your favorite restaurants
						</Card.Text>
						<a href="/customer-login" className="role-btn customer-btn">
						  Login <FaArrowRight className="btn-icon" />
						</a>
					  </Card.Body>
					</Card>
				  </Col>
				  
				  <Col lg={3} md={6} sm={12}>
					<Card className="role-card vendor-card">
					  <Card.Body>
						<div className="role-icon">
						  <FaStore />
						</div>
						<Card.Title>Restaurant Admin</Card.Title>
						<Card.Text>
						  Manage your restaurant and orders
						</Card.Text>
						<a href="/vendor-login" className="role-btn vendor-btn">
						  Login <FaArrowRight className="btn-icon" />
						</a>
					  </Card.Body>
					</Card>
				  </Col>
				  
				  <Col lg={3} md={6} sm={12}>
					<Card className="role-card delivery-card">
					  <Card.Body>
						<div className="role-icon">
						  <FaMotorcycle />
						</div>
						<Card.Title>Delivery Person</Card.Title>
						<Card.Text>
						  Manage and fulfill customer deliveries
						</Card.Text>
						<a href="/driver-login" className="role-btn delivery-btn">
						  Login <FaArrowRight className="btn-icon" />
						</a>
					  </Card.Body>
					</Card>
				  </Col>
				  
				  <Col lg={3} md={6} sm={12}>
					<Card className="role-card admin-card">
					  <Card.Body>
						<div className="role-icon">
						  <FaUserShield />
						</div>
						<Card.Title>System Admin</Card.Title>
						<Card.Text>
						  System administration and monitoring
						</Card.Text>
						<a href="/admin-login" className="role-btn admin-btn">
						  Login <FaArrowRight className="btn-icon" />
						</a>
					  </Card.Body>
					</Card>
				  </Col>
				</Row>
				
				<div className="register-prompt text-center mt-4">
				  <p>Don't have an account? <a href="/register">Register now</a></p>
				</div>
			  </Col>
			</Row>
		  </Container>
		</MainScreen>
	  </div>
	);
  };
  
  export default LoginSelectorScreen;