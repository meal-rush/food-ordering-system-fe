import { useState } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Loading";
import ErrorMessage from "../../../components/ErrorMessage";
import { adminRegister } from "../../../actions/userManagementActions/adminActions";
import MainScreen from "../../../components/MainScreen";
import "./RegisterScreen.css";

const AdminRegisterScreen = () => {
	const [name, setName] = useState("");
	const [telephone, setTelephone] = useState("");
	const [address, setAddress] = useState("");
	const [email, setEmail] = useState("");
	const [pic, setPic] = useState("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
	const [password, setPassword] = useState("");
	const [confirmpassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState(null);
	const [picMessage, setPicMessage] = useState(null);

	const dispatch = useDispatch();
	const adminRegistration = useSelector((state) => state.adminRegistration);
	const { loading, error } = adminRegistration;

	const submitHandler = async (e) => {
		e.preventDefault();

		if (password !== confirmpassword) {
			setMessage("Passwords do not match");
		} else {
			dispatch(adminRegister(name, telephone, address, email, password, pic));
		}
	};

	const demoHandler = async (e) => {
		e.preventDefault();

		setName("Dwight Shrute");
		setTelephone("0715689562");
		setAddress("Colombo");
		setEmail("dwightshrute@gmail.com");
		setPassword("test");
		setConfirmPassword("test");
	};

	const resetHandler = async (e) => {
		e.preventDefault();

		setName("");
		setTelephone("");
		setAddress("");
		setEmail("");
	};

	const postDetails = (pics) => {
		if (pics === "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg") {
			return setPicMessage("Please Select an Image");
		}
		setPicMessage(null);
		if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg") {
			const data = new FormData();
			data.append("file", pics);
			data.append("upload_preset", "adminProfile");
			data.append("cloud_name", "dfmnpw0yp");
			fetch("https://api.cloudinary.com/v1_1/dfmnpw0yp/image/upload", {
				method: "post",
				body: data,
			})
				.then((res) => res.json())
				.then((data) => {
					setPic(data.url.toString());
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			return setPicMessage("Please Select an Image");
		}
	};

	return (
		<div
			style={{
				background: "linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)",
				minHeight: "100vh",
				padding: "2rem",
			}}
		>
			<MainScreen>
				<Button
					variant="success"
					style={{
						marginBottom: "2rem",
						backgroundColor: "#2e7d32",
						border: "none",
						padding: "0.8rem 1.5rem",
						borderRadius: "12px",
						fontSize: "0.95rem",
						letterSpacing: "0.5px",
						fontWeight: "500",
					}}
					href="/admin"
				>
					← Back to Dashboard
				</Button>

				<h2
					style={{
						color: "#1a1a1a",
						textAlign: "center",
						marginBottom: "2rem",
						fontWeight: "600",
						fontSize: "2.2rem",
						letterSpacing: "1px",
					}}
				>
					Register New Admin
				</h2>

				<Card
					style={{
						borderRadius: "20px",
						border: "none",
						boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
						background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
						padding: "2.5rem",
					}}
				>
					<div>
						{error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
						{message && <ErrorMessage variant="danger">{message}</ErrorMessage>}
						{loading && <Loading />}

						<Row className="AdminProfileContainer g-4">
							<Col md={6}>
								<Form onSubmit={submitHandler} className="pe-md-4">
									<Form.Group controlId="adminName" className="mb-3">
										<Form.Label
											style={{
												color: "#2e7d32",
												fontWeight: "500",
												marginBottom: "0.5rem",
												fontSize: "0.95rem",
											}}
										>
											Name
										</Form.Label>
										<Form.Control
											type="name"
											value={name}
											placeholder="Enter name"
											onChange={(e) => setName(e.target.value)}
											required
											style={{
												borderRadius: "10px",
												padding: "0.8rem",
												fontSize: "0.95rem",
												backgroundColor: "#f8f9fa",
												border: "1px solid #e0e0e0",
											}}
										/>
									</Form.Group>

									<Form.Group controlId="adminFormBasicTelephone" className="mb-3">
										<Form.Label
											style={{
												color: "#2e7d32",
												fontWeight: "500",
												marginBottom: "0.5rem",
												fontSize: "0.95rem",
											}}
										>
											Telephone
										</Form.Label>
										<Form.Control
											type="text"
											value={telephone}
											placeholder="Enter Telephone Number"
											onChange={(e) => setTelephone(e.target.value)}
											required
											maxLength={10}
											style={{
												borderRadius: "10px",
												padding: "0.8rem",
												fontSize: "0.95rem",
												backgroundColor: "#f8f9fa",
												border: "1px solid #e0e0e0",
											}}
										/>
									</Form.Group>

									<Form.Group controlId="adminFormBasicAddress" className="mb-3">
										<Form.Label
											style={{
												color: "#2e7d32",
												fontWeight: "500",
												marginBottom: "0.5rem",
												fontSize: "0.95rem",
											}}
										>
											Address
										</Form.Label>
										<Form.Control
											type="textArea"
											value={address}
											placeholder="Enter Address"
											onChange={(e) => setAddress(e.target.value)}
											required
											style={{
												borderRadius: "10px",
												padding: "0.8rem",
												fontSize: "0.95rem",
												backgroundColor: "#f8f9fa",
												border: "1px solid #e0e0e0",
											}}
										/>
									</Form.Group>

									<Form.Group controlId="adminFormBasicEmail" className="mb-3">
										<Form.Label
											style={{
												color: "#2e7d32",
												fontWeight: "500",
												marginBottom: "0.5rem",
												fontSize: "0.95rem",
											}}
										>
											Email
										</Form.Label>
										<Form.Control
											type="email"
											value={email}
											placeholder="Enter Email Address"
											onChange={(e) => setEmail(e.target.value)}
											required
											style={{
												borderRadius: "10px",
												padding: "0.8rem",
												fontSize: "0.95rem",
												backgroundColor: "#f8f9fa",
												border: "1px solid #e0e0e0",
											}}
										/>
									</Form.Group>

									<Form.Group controlId="formBasicPassword" className="mb-3">
										<Form.Label
											style={{
												color: "#2e7d32",
												fontWeight: "500",
												marginBottom: "0.5rem",
												fontSize: "0.95rem",
											}}
										>
											Password
										</Form.Label>
										<Form.Control
											type="password"
											value={password}
											placeholder="Password"
											onChange={(e) => setPassword(e.target.value)}
											required
											style={{
												borderRadius: "10px",
												padding: "0.8rem",
												fontSize: "0.95rem",
												backgroundColor: "#f8f9fa",
												border: "1px solid #e0e0e0",
											}}
										/>
									</Form.Group>

									<Form.Group controlId="confirmPassword" className="mb-3">
										<Form.Label
											style={{
												color: "#2e7d32",
												fontWeight: "500",
												marginBottom: "0.5rem",
												fontSize: "0.95rem",
											}}
										>
											Confirm Password
										</Form.Label>
										<Form.Control
											type="password"
											value={confirmpassword}
											placeholder="Confirm Password"
											onChange={(e) => setConfirmPassword(e.target.value)}
											required
											style={{
												borderRadius: "10px",
												padding: "0.8rem",
												fontSize: "0.95rem",
												backgroundColor: "#f8f9fa",
												border: "1px solid #e0e0e0",
											}}
										/>
									</Form.Group>

									{picMessage && <ErrorMessage variant="danger">{picMessage}</ErrorMessage>}
									<Form.Group controlId="pic" className="mb-3">
										<Form.Label
											style={{
												color: "#2e7d32",
												fontWeight: "500",
												marginBottom: "0.5rem",
												fontSize: "0.95rem",
											}}
										>
											Profile Picture
										</Form.Label>
										&emsp;
										<input
											type="file"
											accept="image/*"
											id="admin-pic"
											onChange={(e) => postDetails(e.target.files[0])}
											style={{
												borderRadius: "10px",
												padding: "0.8rem",
												fontSize: "0.95rem",
												backgroundColor: "#f8f9fa",
												border: "1px solid #e0e0e0",
											}}
										/>
									</Form.Group>

									<div
										style={{
											display: "flex",
											gap: "1rem",
											marginTop: "2.5rem",
										}}
									>
										<Button
											variant="success"
											type="submit"
											style={{
												backgroundColor: "#2e7d32",
												border: "none",
												padding: "0.8rem",
												borderRadius: "10px",
												flex: 1,
												fontWeight: "500",
											}}
										>
											Register
										</Button>
										<Button
											variant="danger"
											onClick={resetHandler}
											style={{
												backgroundColor: "#d32f2f",
												border: "none",
												padding: "0.8rem",
												borderRadius: "10px",
												flex: 1,
												fontWeight: "500",
											}}
										>
											Reset
										</Button>
										<Button
											variant="success"
											onClick={demoHandler}
											style={{
												backgroundColor: "#388e3c",
												border: "none",
												padding: "0.8rem",
												borderRadius: "10px",
												flex: 1,
												fontWeight: "500",
											}}
										>
											Demo
										</Button>
									</div>
								</Form>
							</Col>
							<Col md={6}>
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										height: "100%",
										padding: "2rem",
									}}
								>
									<img
										src={pic}
										alt={name}
										style={{
											width: "320px",
											height: "320px",
											borderRadius: "50%",
											objectFit: "cover",
											boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
											border: "5px solid white",
										}}
									/>
								</div>
							</Col>
						</Row>
					</div>
				</Card>
			</MainScreen>
		</div>
	);
};

export default AdminRegisterScreen;
