import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../../components/Loading";
import ErrorMessage from "../../../../components/ErrorMessage";
import { vendorUpdateProfileById } from "../../../../actions/userManagementActions/vendorActions";
import axios from "axios";
import MainScreen from "../../../../components/MainScreen";
import { authHeader } from "../../../../actions/userManagementActions/adminActions";
import { API_ENDPOINT } from "../../../../config";
import "./adminUserEdit.css";

const VendorEditByAdminScreen = ({ match }) => {
	const [name, setName] = useState("");
	const [telephone, setTelephone] = useState("");
	const [homeAddress, setHomeAddress] = useState("");
	const [email, setEmail] = useState("");
	const [pic, setPic] = useState("");
	const [password, setPassword] = useState("");
	const [businessName, setBusinessName] = useState("");
	const [businessAddress, setBusinessAddress] = useState("");
	const [website, setWebsite] = useState("");
	const [businessRegNumber, setBusinessRegNumber] = useState("");
	const [description, setDescription] = useState("");
	const [confirmpassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState(null);
	const [picMessage, setPicMessage] = useState(null);

	const [regDate, setRegDate] = useState("");

	const dispatch = useDispatch();

	const admin_Login = useSelector((state) => state.admin_Login);
	const { adminInfo } = admin_Login;

	const vendorUpdateById = useSelector((state) => state.vendorUpdateById);
	const { loading, error } = vendorUpdateById;

	const postDetails = (pics) => {
		if (pics === "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg") {
			return setPicMessage("Please Select an Image");
		}
		setPicMessage(null);
		if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg") {
			const data = new FormData();
			data.append("file", pics);
			data.append("upload_preset", "vendorProfile");
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
			dispatch(
				vendorUpdateProfileById(
					match.params.id,
					name,
					telephone,
					homeAddress,
					email,
					password,
					businessName,
					businessAddress,
					website,
					businessRegNumber,
					description,
					pic,
					regDate
				)
			);
		}
	};

	useEffect(() => {
		if (adminInfo != null) {
			const fetching = async () => {
				const { data } = await axios.get(`${API_ENDPOINT}/user/admin/vendor/profile/view/${match.params.id}`, {
					headers: authHeader(),
				});
				setName(data.name);
				setTelephone(data.telephone);
				setHomeAddress(data.homeAddress);
				setEmail(data.email);
				setBusinessName(data.businessName);
				setBusinessAddress(data.businessAddress);
				setWebsite(data.website);
				setBusinessRegNumber(data.businessRegNumber);
				setDescription(data.description);
				setPic(data.pic);
				setRegDate(data.regDate);
			};

			fetching();
		}
	}, [match.params.id, adminInfo]);

	if (adminInfo) {
		return (
			<div className="adminVendorEditBg">
				<MainScreen>
					<Button className="btn-back" href="/admin-vendors">
						Back to Vendors List
					</Button>

					<div className="edit-container">
						<h2 className="edit-header">Edit Vendor Profile</h2>

						{error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
						{message && <ErrorMessage variant="danger">{message}</ErrorMessage>}
						{loading && <Loading />}

						<Row>
							<Col md={8}>
								<Form onSubmit={submitHandler}>
									<Row>
										<Col md={6}>
											<Form.Group className="mb-3">
												<Form.Label>Business Name</Form.Label>
												<Form.Control
													type="text"
													value={businessName}
													onChange={(e) => setBusinessName(e.target.value)}
												/>
											</Form.Group>
										</Col>
										<Col md={6}>
											<Form.Group className="mb-3">
												<Form.Label>Owner Name</Form.Label>
												<Form.Control
													type="text"
													value={name}
													onChange={(e) => setName(e.target.value)}
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
													onChange={(e) => setTelephone(e.target.value)}
												/>
											</Form.Group>
										</Col>
										<Col md={6}>
											<Form.Group className="mb-3">
												<Form.Label>Email</Form.Label>
												<Form.Control
													type="email"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
												/>
											</Form.Group>
										</Col>
									</Row>

									<Form.Group className="mb-3">
										<Form.Label>Home Address</Form.Label>
										<Form.Control
											type="text"
											value={homeAddress}
											onChange={(e) => setHomeAddress(e.target.value)}
										/>
									</Form.Group>

									<Form.Group className="mb-3">
										<Form.Label>Business Address</Form.Label>
										<Form.Control
											type="text"
											value={businessAddress}
											onChange={(e) => setBusinessAddress(e.target.value)}
										/>
									</Form.Group>

									<Form.Group className="mb-3">
										<Form.Label>Website</Form.Label>
										<Form.Control
											type="text"
											value={website}
											onChange={(e) => setWebsite(e.target.value)}
										/>
									</Form.Group>

									<Form.Group className="mb-3">
										<Form.Label>Business Registration Number</Form.Label>
										<Form.Control
											type="text"
											value={businessRegNumber}
											onChange={(e) => setBusinessRegNumber(e.target.value)}
										/>
									</Form.Group>

									<Form.Group className="mb-3">
										<Form.Label>Description</Form.Label>
										<textarea
											className="form-control"
											value={description}
											onChange={(e) => setDescription(e.target.value)}
											rows={5}
										/>
									</Form.Group>

									<Form.Group className="mb-3">
										<Form.Label>Password</Form.Label>
										<Form.Control
											type="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										/>
									</Form.Group>

									<Form.Group className="mb-3">
										<Form.Label>Confirm Password</Form.Label>
										<Form.Control
											type="password"
											value={confirmpassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
										/>
									</Form.Group>

									<Button className="btn-update" type="submit">
										Update Profile
									</Button>
								</Form>
							</Col>

							<Col md={4}>
								<div className="profile-image-container">
									<img src={pic} alt={name} className="profile-pic" />
									<Form.Group>
										<Form.Label>Update Profile Picture</Form.Label>
										<Form.Control
											type="file"
											accept="image/*"
											onChange={(e) => postDetails(e.target.files[0])}
										/>
									</Form.Group>
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

export default VendorEditByAdminScreen;
