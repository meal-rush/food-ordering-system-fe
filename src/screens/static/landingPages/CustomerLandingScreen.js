import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { customerLogout } from "../../../actions/userManagementActions/customerActions";
import "./customerLandingScreen.css";
import MainScreen from "../../../components/MainScreen";
import { FaUser, FaShoppingBag, FaTruck } from "react-icons/fa";
import swal from "sweetalert";

const CustomerLandingScreen = ({ history }) => {
  const customer_Login = useSelector((state) => state.customer_Login);
  const { customerInfo } = customer_Login;
  const dispatch = useDispatch();

  const logoutHandler = () => {
    // Use SweetAlert for better UI
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
        dispatch(customerLogout());
        
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
      title: "My Account",
      description: "View and manage your personal information",
      icon: <FaUser size={40} className="feature-icon" />,
      link: "/customer-view",
    },
    {
      title: "My Orders",
      description: "Track and manage your recent orders",
      icon: <FaShoppingBag size={40} className="feature-icon" />,
      link: "/customer-orders",
    },
    {
      title: "My Deliveries",
      description: "Track your current and past deliveries",
      icon: <FaTruck size={40} className="feature-icon" />,
      link: customerInfo ? `/customer-deliveries/${customerInfo._id}` : "#",
    },
  ];

  if (customerInfo) {
    return (
      <div className="customerDashboard">
        <MainScreen title={""}>
          <Container fluid className="dashboard-container">
            {/* Welcome Section */}
            <Row className="welcome-section">
              <Col md={7} className="welcome-text">
                <h1>Welcome, {customerInfo && customerInfo.name}!</h1>
                <p className="welcome-description">
                  Manage your account, track your orders, and view your delivery status all in one place.
                  Your personal dashboard gives you complete control over your shopping experience.
                </p>
                <Button variant="danger" onClick={logoutHandler} className="logout-btn">
                  Logout
                </Button>
              </Col>
              <Col md={5} className="welcome-image">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2037/2037448.png"
                  alt="Customer Dashboard"
                  className="hero-image"
                />
              </Col>
            </Row>

            {/* Feature Cards Section */}
            <Row className="features-section">
              <Col xs={12}>
                <h2 className="section-title">Account Management</h2>
              </Col>

              {features.map((feature, index) => (
                <Col key={index} md={4} sm={12} className="feature-card-col">
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

export default CustomerLandingScreen;

// import { useDispatch, useSelector } from "react-redux";
// import { Button, Card } from "react-bootstrap";
// import { customerLogout } from "../../../actions/userManagementActions/customerActions";
// import "./landingScreen.css";
// import MainScreen from "../../../components/MainScreen";

// const CustomerLandingScreen = ({ history }) => {
// 	const customer_Login = useSelector((state) => state.customer_Login);
// 	const { customerInfo } = customer_Login;

// 	console.log(customerInfo._id);
// 	const dispatch = useDispatch();
// 	const logoutHandler = () => {
// 		dispatch(customerLogout());
// 		history.push("/");
// 	};

// 	if (customerInfo) {
// 		return (
// 			<div className="customerBackground">
// 				<MainScreen title={`Welcome Back ${customerInfo && customerInfo.name} ...`}>
// 					<Button
// 						variant="danger"
// 						onClick={logoutHandler}
// 						className="logoutBtn"
// 						style={{ float: "right", marginTop: 3, fontSize: 15 }}
// 					>
// 						Logout
// 					</Button>

// 					<br></br>
// 					<br></br>
// 					<br></br>
// 					<div className="loginContainer">
// 						<Card
// 							style={{
// 								borderRadius: 45,
// 								borderWidth: 2.0,
// 								marginTop: 20,
// 								paddingInline: 10,
// 								background: "rgba(231, 238, 238, 0.8)",
// 								marginLeft: "20%",
// 								marginRight: "20%",
// 							}}
// 						>
// 							<div className="intro-text">
// 								<br></br>
// 								<br></br>
// 								<a href="/customer-view">
// 									<Button id="landingBtn" variant="success" size="lg" style={{ width: 350, height: 75 }}>
// 										My Account
// 									</Button>
// 								</a>
// 								<br></br>
// 								<br></br>
// 								<a href="/customer-orders">
// 									<Button id="landingBtn" variant="success" size="lg" style={{ width: 350, height: 75 }}>
// 										Orders
// 									</Button>
// 								</a>
// 								<br></br>
// 								<br></br>
// 								<a href={`customer-deliveries/${customerInfo._id}`}>
// 									<Button id="landingBtn" variant="success" size="lg" style={{ width: 350, height: 75 }}>
// 										Deliveries
// 									</Button>
// 								</a>

// 								<br></br>
// 								<br></br>
// 								<br></br>
// 							</div>
// 						</Card>
// 					</div>
// 				</MainScreen>
// 			</div>
// 		);
// 	} else {
// 		return (
// 			<div className="denied">
// 				<MainScreen />
// 				<br></br>
// 			</div>
// 		);
// 	}
// };

// export default CustomerLandingScreen;
