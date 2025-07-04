// import { Form, Button, Card } from "react-bootstrap";
// import MainScreen from "../../../components/MainScreen";
// import "./LoginScreen.css";
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Loading from "../../../components/Loading";
// import ErrorMessage from "../../../components/ErrorMessage";
// import { customerLogin } from "../../../actions/userManagementActions/customerActions";

// const CustomerLogin = ({ history }) => {
// 	const [email, setEmail] = useState("");
// 	const [password, setPassword] = useState("");

// 	const dispatch = useDispatch();

// 	const customer_Login = useSelector((state) => state.customer_Login);
// 	const { loading, error, customerInfo } = customer_Login;

// 	useEffect(() => {
// 		if (customerInfo) {
// 			window.history.pushState({}, "", "/customer");
// 		}
// 	}, [history, customerInfo]);

// 	const submitHandler = async (e) => {
// 		e.preventDefault();
// 		dispatch(customerLogin(email, password));
// 	};

// 	return (
// 		<div className="loginBg">
// 			<br></br>
// 			<br></br>
// 			<MainScreen title="CUSTOMER LOGIN">
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

// export default CustomerLogin;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { customerLogin } from "../../../actions/userManagementActions/customerActions";
import LoginForm from "./LoginForm";

const CustomerLogin = ({ history }) => {
  const dispatch = useDispatch();
  const customer_Login = useSelector((state) => state.customer_Login);
  const { loading, error, customerInfo } = customer_Login;

  useEffect(() => {
    if (customerInfo) {
      window.history.pushState({}, "", "/customer");
    }
  }, [history, customerInfo]);

  const submitHandler = (email, password) => {
    dispatch(customerLogin(email, password));
  };

  return (
    <LoginForm
      title="Customer Login"
      userType="Customer"
      loading={loading}
      error={error}
      onSubmit={submitHandler}
      logoSrc="https://cdn-icons-png.flaticon.com/512/4715/4715128.png"
    />
  );
};

export default CustomerLogin;