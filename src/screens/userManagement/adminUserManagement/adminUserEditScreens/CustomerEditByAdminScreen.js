import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../../components/Loading";
import ErrorMessage from "../../../../components/ErrorMessage";
import { customerUpdateProfileById } from "../../../../actions/userManagementActions/customerActions";
import axios from "axios";
import MainScreen from "../../../../components/MainScreen";
import { authHeader } from "../../../../actions/userManagementActions/adminActions";
import { API_ENDPOINT } from "../../../../config";
import "./adminUserEdit.css";

const CustomerEditByAdminScreen = ({ match }) => {
	const [name, setName] = useState("");
	const [telephone, setTelephone] = useState("");
	const [address, setAddress] = useState("");
	const [email, setEmail] = useState("");
	const [pic, setPic] = useState();
	const [password, setPassword] = useState("");
	const [confirmpassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState(null);
	const [picMessage, setPicMessage] = useState(null);
	const [regDate, setRegDate] = useState("");

	const dispatch = useDispatch();

	const admin_Login = useSelector((state) => state.admin_Login);
	const { adminInfo } = admin_Login;

	const customerUpdateById = useSelector((state) => state.customerUpdateById);
	const { loading, error } = customerUpdateById;

	const postDetails = (pics) => {
		if (pics === "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg") {
			return setPicMessage("Please Select an Image");
		}
		setPicMessage(null);
		if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg") {
			const data = new FormData();
			data.append("file", pics);
			data.append("upload_preset", "customerProfile");
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

	const submitHandler = async (e) => {
		e.preventDefault();

		if (password !== confirmpassword) {
			setMessage("Passwords do not match");
		} else {
			dispatch(customerUpdateProfileById(match.params.id, name, telephone, address, email, password, pic, regDate));
		}
	};

	useEffect(() => {
		if (adminInfo != null) {
			const fetching = async () => {
				const { data } = await axios.get(`${API_ENDPOINT}/user/admin/customer/profile/view/${match.params.id}`, {
					headers: authHeader(),
				});
				setName(data.name);
				setTelephone(data.telephone);
				setAddress(data.address);
				setEmail(data.email);
				setPic(data.pic);
				setRegDate(data.regDate);
			};

			fetching();
		}
	}, [match.params.id, adminInfo]);

	if (adminInfo) {
		return (
			<div className="adminCustomerEditBg">
				<MainScreen>
					<Button className="btn-back" href="/admin-customers">
						Back to Customers List
					</Button>

					<div className="edit-container">
						<h2 className="edit-header">Edit Customer Profile</h2>

						{error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
						{message && <ErrorMessage variant="danger">{message}</ErrorMessage>}
						{loading && <Loading />}

						<Row>
							<Col md={8}>
								<Form onSubmit={submitHandler}>
									<Row>
										<Col md={6}>
											<Form.Group className="mb-3">
												<Form.Label>Name</Form.Label>
												<Form.Control
													type="name"
													value={name}
													placeholder="Enter name"
													onChange={(e) => setName(e.target.value)}
												/>
											</Form.Group>
										</Col>
										<Col md={6}>
											<Form.Group className="mb-3">
												<Form.Label>Email</Form.Label>
												<Form.Control
													type="email"
													value={email}
													placeholder="Enter email"
													onChange={(e) => setEmail(e.target.value)}
												/>
											</Form.Group>
										</Col>
									</Row>

									<Row>
										<Col md={6}>
											<Form.Group className="mb-3">
												<Form.Label>Telephone</Form.Label>
												<Form.Control
													type="text"
													value={telephone}
													placeholder="Enter Telephone Number"
													onChange={(e) => setTelephone(e.target.value)}
													maxLength={10}
												/>
											</Form.Group>
										</Col>
										<Col md={6}>
											<Form.Group className="mb-3">
												<Form.Label>Address</Form.Label>
												<Form.Control
													type="textArea"
													value={address}
													placeholder="Enter Address"
													onChange={(e) => setAddress(e.target.value)}
												/>
											</Form.Group>
										</Col>
									</Row>

									<Form.Group className="mb-3">
										<Form.Label>Password</Form.Label>
										<Form.Control
											type="password"
											value={password}
											placeholder="Password"
											onChange={(e) => setPassword(e.target.value)}
										/>
									</Form.Group>

									<Form.Group className="mb-3">
										<Form.Label>Confirm Password</Form.Label>
										<Form.Control
											type="password"
											value={confirmpassword}
											placeholder="Confirm Password"
											onChange={(e) => setConfirmPassword(e.target.value)}
										/>
									</Form.Group>

									<Form.Group className="mb-3">
										<Form.Label>Registration Date</Form.Label>
										<Form.Control type="text" value={regDate} readOnly />
									</Form.Group>

									<Button className="btn-update" type="submit">
										Update Profile
									</Button>
								</Form>
							</Col>

							<Col md={4}>
								<div className="profile-image-container">
									<div className="profile-pic-wrapper">
										<img src={pic} alt={name} className="profile-pic" />
									</div>
									<div className="upload-section">
										<Form.Group>
											<Form.Label>Update Profile Picture</Form.Label>
											{picMessage && <ErrorMessage variant="danger">{picMessage}</ErrorMessage>}
											<Form.Control
												type="file"
												accept="image/*"
												onChange={(e) => postDetails(e.target.files[0])}
											/>
										</Form.Group>
									</div>
								</div>
							</Col>
						</Row>
					</div>
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

export default CustomerEditByAdminScreen;
