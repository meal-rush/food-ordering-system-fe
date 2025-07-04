// import { Form, Button, Card } from "react-bootstrap";
// import MainScreen from "../../../components/MainScreen";
// import "./LoginScreen.css";
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Loading from "../../../components/Loading";
// import ErrorMessage from "../../../components/ErrorMessage";
// import { vendorLogin } from "../../../actions/userManagementActions/vendorActions";

// const VendorLogin = ({ history }) => {
// 	const [email, setEmail] = useState("");
// 	const [password, setPassword] = useState("");

// 	const dispatch = useDispatch();

// 	const vendor_Login = useSelector((state) => state.vendor_Login);
// 	const { loading, error, vendorInfo } = vendor_Login;

// 	useEffect(() => {
// 		if (vendorInfo) {
// 			window.history.pushState({}, "", "/vendor");
// 		}
// 	}, [history, vendorInfo]);

// 	const submitHandler = async (e) => {
// 		e.preventDefault();
// 		dispatch(vendorLogin(email, password));
// 	};

// 	return (
// 		<div className="loginBg">
// 			<br></br>
// 			<br></br>
// 			<MainScreen title="VENDOR LOGIN">
// 				<Card
// 					className="profileCont"
// 					style={{
// 						marginLeft: "10%",
// 						marginRight: "10%",
// 						borderRadius: 45,
// 						borderWidth: 2.0,
// 						marginTop: 50,
// 						paddingInline: 35,
// 						background: "rgba(231, 238, 238, 0.9)",
// 					}}
// 				>
// 					<br></br>
// 					<br></br>
// 					<div className="loginContainer">
// 						{error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
// 						{loading && <Loading />}
// 						<Form onSubmit={submitHandler}>
// 							<Form.Group controlId="formBasicEmail">
// 								<Form.Label>Email address</Form.Label>
// 								<Form.Control
// 									type="email"
// 									value={email}
// 									placeholder="Enter Email"
// 									onChange={(e) => setEmail(e.target.value)}
// 								/>
// 							</Form.Group>
// 							<br></br>
// 							<Form.Group controlId="formBasicPassword">
// 								<Form.Label>Password</Form.Label>
// 								<Form.Control
// 									type="password"
// 									value={password}
// 									placeholder="Password"
// 									onChange={(e) => setPassword(e.target.value)}
// 								/>
// 							</Form.Group>
// 							<br></br>
// 							<Button variant="primary" type="submit">
// 								Submit
// 							</Button>
// 						</Form>
// 					</div>
// 				</Card>
// 			</MainScreen>
// 		</div>
// 	);
// };

// export default VendorLogin;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { vendorLogin } from "../../../actions/userManagementActions/vendorActions";
import LoginForm from "./LoginForm";

const VendorLogin = ({ history }) => {
  const dispatch = useDispatch();
  const vendor_Login = useSelector((state) => state.vendor_Login);
  const { loading, error, vendorInfo } = vendor_Login;

  useEffect(() => {
    if (vendorInfo) {
      window.history.pushState({}, "", "/vendor");
    }
  }, [history, vendorInfo]);

  const submitHandler = (email, password) => {
    dispatch(vendorLogin(email, password));
  };

  return (
    <LoginForm
      title="Restaurant Admin Login"
      userType="Vendor"
      loading={loading}
      error={error}
      onSubmit={submitHandler}
      logoSrc="https://cdn-icons-png.flaticon.com/512/3063/3063822.png"
    />
  );
};

export default VendorLogin;