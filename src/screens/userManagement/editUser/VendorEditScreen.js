import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Container, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
	FaUser,
	FaStore,
	FaEdit,
	FaArrowLeft,
	FaTrash,
	FaUpload,
	FaExclamationTriangle,
	FaUtensils,
} from "react-icons/fa";
import Loading from "../../../components/Loading";
import ErrorMessage from "../../../components/ErrorMessage";
import MainScreen from "../../../components/MainScreen";
import { vendorUpdateProfile, vendorDeleteProfile } from "../../../actions/userManagementActions/vendorActions";
import swal from "sweetalert";
import "./vendorEditScreen.css";

const VendorEditScreen = ({ history }) => {
	// All the existing state variables remain the same
	const [activeTab, setActiveTab] = useState("personal");
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
	const [cuisineType, setCuisineType] = useState("");
	const [openingTime, setOpeningTime] = useState("");
	const [closingTime, setClosingTime] = useState("");
	const [availabilityStatus, setAvailabilityStatus] = useState(true);
	const [message, setMessage] = useState(null);
	const [picMessage, setPicMessage] = useState(null);
	const [picLoading, setPicLoading] = useState(false);

	const dispatch = useDispatch();

	const vendor_Login = useSelector((state) => state.vendor_Login);
	const { vendorInfo } = vendor_Login;

	const vendorUpdate = useSelector((state) => state.vendorUpdate);
	const { loading, error } = vendorUpdate;

	const vendorDelete = useSelector((state) => state.vendorDelete);
	const { loading: loadingDelete, error: errorDelete, success: successDelete } = vendorDelete;

	// Cuisine type options
	const cuisineOptions = [
		"Italian",
		"Chinese",
		"Indian",
		"Japanese",
		"Mexican",
		"Thai",
		"French",
		"American",
		"Mediterranean",
		"Greek",
		"Korean",
		"Vietnamese",
		"Middle Eastern",
		"Spanish",
		"Other",
	];

	useEffect(() => {
		if (!vendorInfo) {
			history.push("/");
		} else {
			setName(vendorInfo.name);
			setTelephone(vendorInfo.telephone);
			setHomeAddress(vendorInfo.homeAddress);
			setEmail(vendorInfo.email);
			setBusinessName(vendorInfo.businessName);
			setBusinessAddress(vendorInfo.businessAddress);
			setWebsite(vendorInfo.website || "");
			setBusinessRegNumber(vendorInfo.businessRegNumber);
			setDescription(vendorInfo.description || "");
			setPic(vendorInfo.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
			setCuisineType(vendorInfo.cuisineType || "");
			setOpeningTime(vendorInfo.openingTime || "");
			setClosingTime(vendorInfo.closingTime || "");
			setAvailabilityStatus(vendorInfo.availabilityStatus !== undefined ? vendorInfo.availabilityStatus : true);
		}
	}, [vendorInfo, history, vendorDelete, successDelete, loadingDelete, errorDelete]);

	// All the existing handlers remain the same
	const postDetails = (pics) => {
		if (!pics) {
			return setPicMessage("Please select an image");
		}
		setPicMessage(null);
		setPicLoading(true);

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
					setPicLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setPicLoading(false);
					setPicMessage("Image upload failed. Please try again.");
				});
		} else {
			setPicLoading(false);
			return setPicMessage("Please select a JPEG, JPG or PNG image");
		}
	};

	const submitHandler = (e) => {
		e.preventDefault();

		if (password && password !== confirmpassword) {
			setMessage("Passwords do not match");
			return;
		}

		const vendorUpdatedInfo = {
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
			cuisineType,
			openingTime,
			closingTime,
			availabilityStatus,
		};

		dispatch(vendorUpdateProfile(vendorUpdatedInfo));

		swal({
			title: "Profile Updated!",
			text: "Your profile has been updated successfully",
			icon: "success",
			timer: 2000,
			button: false,
		});
	};

	const deleteHandler = () => {
		swal({
			title: "Are you sure?",
			text: "Once deleted, you will not be able to recover your account!",
			icon: "warning",
			buttons: {
				cancel: {
					text: "Cancel",
					value: false,
					visible: true,
					className: "swal-button--cancel",
				},
				confirm: {
					text: "Yes, delete my account",
					value: true,
					visible: true,
					className: "swal-button--danger",
				},
			},
			dangerMode: true,
		})
			.then((willDelete) => {
				if (willDelete) {
					dispatch(vendorDeleteProfile(vendorInfo));
					swal({
						title: "Account Deleted",
						text: "Your account has been permanently deleted",
						icon: "success",
						timer: 2000,
						button: false,
					});
				}
			})
			.catch((err) => {
				swal({
					title: "Error!",
					text: "Couldn't delete account. Please try again.",
					icon: "error",
				});
			});
	};

	// Handler for toggling availability status
	const toggleAvailabilityStatus = () => {
		setAvailabilityStatus(!availabilityStatus);
	};

	if (!vendorInfo) {
		return (
			<div className="denied">
				<MainScreen />
				<br />
			</div>
		);
	}

	return (
		<div className="editProfileBg">
			<MainScreen title="">
				<Container className="py-4">
					{/* Header with navigation buttons */}
					<div className="d-flex justify-content-between align-items-center mb-4">
						<Button variant="outline-primary" className="back-btn" href="/vendor-view">
							<FaArrowLeft /> Back to Profile Page
						</Button>
						<h2 className="profile-title mb-0">Edit Restaurant Profile</h2>
						<div className="invisible" style={{ width: "100px" }}></div> {/* For alignment */}
					</div>

					<Card className="profile-card">
						<Card.Body>
							{/* Alerts section */}
							{error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
							{errorDelete && <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>}
							{message && <ErrorMessage variant="danger">{message}</ErrorMessage>}
							{loading && <Loading />}
							{loadingDelete && <Loading />}

							<Row>
								{/* Profile Picture Column */}
								<Col lg={4} className="text-center profile-image-section mb-4 mb-lg-0">
									<div className="profile-image-container edit-profile-image">
										{picLoading ? <Loading /> : <img src={pic} alt={name} className="profile-image" />}
										<div className="image-upload-overlay">
											<label htmlFor="file-input" className="upload-icon-wrapper">
												<FaUpload className="upload-icon" />
											</label>
											<input
												id="file-input"
												type="file"
												accept="image/*"
												onChange={(e) => postDetails(e.target.files[0])}
												style={{ display: "none" }}
											/>
										</div>
									</div>
									{picMessage && <div className="text-danger mt-2">{picMessage}</div>}

									<h3 className="restaurant-name mt-4">{businessName || "Your Restaurant"}</h3>
									<p className="text-muted vendor-name">Managed by {name}</p>

									<div className="mt-5 danger-zone">
										<h5 className="danger-zone-title">
											<FaExclamationTriangle /> Danger Zone
										</h5>
										<p className="text-muted small">This action cannot be undone</p>
										<Button variant="danger" onClick={deleteHandler} className="delete-account-btn">
											<FaTrash /> Delete Account
										</Button>
									</div>
								</Col>

								{/* Edit Form Column */}
								<Col lg={8}>
									{/* Tabs Navigation */}
									<Nav variant="tabs" className="profile-tabs mb-4">
										<Nav.Item>
											<Nav.Link
												className={activeTab === "personal" ? "active" : ""}
												onClick={() => setActiveTab("personal")}
											>
												<FaUser /> Personal Information
											</Nav.Link>
										</Nav.Item>
										<Nav.Item>
											<Nav.Link
												className={activeTab === "business" ? "active" : ""}
												onClick={() => setActiveTab("business")}
											>
												<FaStore /> Business Information
											</Nav.Link>
										</Nav.Item>
										<Nav.Item>
											<Nav.Link
												className={activeTab === "restaurant" ? "active" : ""}
												onClick={() => setActiveTab("restaurant")}
											>
												<FaUtensils /> Restaurant Details
											</Nav.Link>
										</Nav.Item>
									</Nav>

									<Form onSubmit={submitHandler}>
										{/* Personal Information Tab */}
										{activeTab === "personal" && (
											<div className="edit-form-section">
												<Row>
													<Col md={6}>
														<Form.Group className="mb-3">
															<Form.Label>Full Name</Form.Label>
															<Form.Control
																type="text"
																value={name}
																onChange={(e) => setName(e.target.value)}
																placeholder="Enter your full name"
																required
															/>
														</Form.Group>
													</Col>
													<Col md={6}>
														<Form.Group className="mb-3">
															<Form.Label>Phone Number</Form.Label>
															<Form.Control
																type="tel"
																value={telephone}
																onChange={(e) => setTelephone(e.target.value)}
																placeholder="Enter your phone number"
																required
															/>
														</Form.Group>
													</Col>
												</Row>

												<Form.Group className="mb-3">
													<Form.Label>Email Address</Form.Label>
													<Form.Control
														type="email"
														value={email}
														onChange={(e) => setEmail(e.target.value)}
														placeholder="Enter your email address"
														required
													/>
												</Form.Group>

												<Form.Group className="mb-3">
													<Form.Label>Home Address</Form.Label>
													<Form.Control
														as="textarea"
														rows={2}
														value={homeAddress}
														onChange={(e) => setHomeAddress(e.target.value)}
														placeholder="Enter your home address"
														required
													/>
												</Form.Group>

												<hr className="my-4" />
												<h5 className="section-subtitle mb-3">Change Password</h5>
												<p className="text-muted small mb-3">Leave blank if you don't want to change your password</p>

												<Row>
													<Col md={6}>
														<Form.Group className="mb-3">
															<Form.Label>New Password</Form.Label>
															<Form.Control
																type="password"
																value={password}
																onChange={(e) => setPassword(e.target.value)}
																placeholder="Enter new password"
															/>
														</Form.Group>
													</Col>
													<Col md={6}>
														<Form.Group className="mb-3">
															<Form.Label>Confirm New Password</Form.Label>
															<Form.Control
																type="password"
																value={confirmpassword}
																onChange={(e) => setConfirmPassword(e.target.value)}
																placeholder="Confirm new password"
															/>
														</Form.Group>
													</Col>
												</Row>
											</div>
										)}

										{/* Business Information Tab */}
										{activeTab === "business" && (
											<div className="edit-form-section">
												<Row>
													<Col md={6}>
														<Form.Group className="mb-3">
															<Form.Label>Business Name</Form.Label>
															<Form.Control
																type="text"
																value={businessName}
																onChange={(e) => setBusinessName(e.target.value)}
																placeholder="Enter business name"
																required
															/>
														</Form.Group>
													</Col>
													<Col md={6}>
														<Form.Group className="mb-3">
															<Form.Label>Registration Number</Form.Label>
															<Form.Control
																type="text"
																value={businessRegNumber}
																onChange={(e) => setBusinessRegNumber(e.target.value)}
																placeholder="Enter business registration number"
																required
															/>
														</Form.Group>
													</Col>
												</Row>

												<Form.Group className="mb-3">
													<Form.Label>Business Address</Form.Label>
													<Form.Control
														as="textarea"
														rows={2}
														value={businessAddress}
														onChange={(e) => setBusinessAddress(e.target.value)}
														placeholder="Enter business address"
														required
													/>
												</Form.Group>

												<Form.Group className="mb-3">
													<Form.Label>Website</Form.Label>
													<Form.Control
														type="url"
														value={website}
														onChange={(e) => setWebsite(e.target.value)}
														placeholder="https://yourwebsite.com"
													/>
												</Form.Group>

												<Form.Group className="mb-3">
													<Form.Label>Restaurant Description</Form.Label>
													<Form.Control
														as="textarea"
														rows={5}
														value={description}
														onChange={(e) => setDescription(e.target.value)}
														placeholder="Describe your restaurant, cuisine types, specialties, etc."
													/>
												</Form.Group>
											</div>
										)}

										{/* Restaurant Details Tab - UPDATED with new toggle button */}
										{activeTab === "restaurant" && (
											<div className="edit-form-section">
												<h5 className="section-subtitle mb-3">Restaurant Operation Details</h5>

												<Form.Group className="mb-4">
													<Form.Label>Cuisine Type</Form.Label>
													<Form.Control
														as="select"
														value={cuisineType}
														onChange={(e) => setCuisineType(e.target.value)}
														required
													>
														<option value="">Select Cuisine Type</option>
														{cuisineOptions.map((cuisine, index) => (
															<option key={index} value={cuisine}>
																{cuisine}
															</option>
														))}
													</Form.Control>
												</Form.Group>

												<Row className="mb-4">
													<Col md={12} className="mb-3">
														<h6>Working Hours</h6>
													</Col>
													<Col md={6}>
														<Form.Group>
															<Form.Label>Opening Time</Form.Label>
															<Form.Control
																type="time"
																value={openingTime}
																onChange={(e) => setOpeningTime(e.target.value)}
																required
															/>
														</Form.Group>
													</Col>
													<Col md={6}>
														<Form.Group>
															<Form.Label>Closing Time</Form.Label>
															<Form.Control
																type="time"
																value={closingTime}
																onChange={(e) => setClosingTime(e.target.value)}
																required
															/>
														</Form.Group>
													</Col>
												</Row>

												{/* UPDATED: Enhanced Toggle Switch for Restaurant Availability */}
												<Form.Group className="mb-4">
													<Form.Label>Restaurant Availability Status</Form.Label>
													<div className="status-toggle-container">
														<div className="toggle-switch-container">
															<div
																className={`toggle-switch ${availabilityStatus ? "active" : ""}`}
																onClick={toggleAvailabilityStatus}
															>
																<div className="toggle-knob"></div>
															</div>
															<span className={`toggle-label ${availabilityStatus ? "text-success" : "text-danger"}`}>
																{availabilityStatus ? "Open for Orders" : "Closed"}
															</span>
														</div>
														<small className="text-muted d-block mt-2">
															{availabilityStatus
																? "Your restaurant is currently visible to customers and accepting orders."
																: "Your restaurant is currently not visible to customers and not accepting orders."}
														</small>
													</div>
												</Form.Group>
											</div>
										)}

										<div className="d-flex justify-content-end mt-4">
											<Button variant="secondary" className="me-2" onClick={() => history.push("/vendor-view")}>
												Cancel
											</Button>
											<Button variant="success" type="submit" disabled={loading}>
												{loading ? "Updating..." : "Save Changes"}
											</Button>
										</div>
									</Form>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Container>
			</MainScreen>
		</div>
	);
};

export default VendorEditScreen;
