import React, { useState, useEffect } from "react";
import MainScreen from "../../../../components/MainScreen";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import Loading from "../../../../components/Loading";
import ErrorMessage from "../../../../components/ErrorMessage";
import { FaArrowLeft, FaUtensils } from "react-icons/fa";
import "./addProduct.css";
import { createProduct } from "../../../../actions/productManagementActions/productActions";

function AddProductByVendorScreen() {
	const [itemName, setItemName] = useState("");
	const [category, setCategory] = useState("");
	const [description, setDescription] = useState("");
	const [picURL, setPicUrl] = useState(
		"https://res.cloudinary.com/dfmnpw0yp/image/upload/v1679235307/assets/tsuh9f6v1reihgqxwxrz.ico"
	);
	const [price, setPrice] = useState("");
	const [preparationTime, setPreparationTime] = useState("");
	const [availability, setAvailability] = useState(true);
	const [customizations, setCustomizations] = useState("");
	const [message, setMessage] = useState(null);
	const [picMessage, setPicMessage] = useState(null);
	const [isImageLoading, setIsImageLoading] = useState(false);

	const dispatch = useDispatch();

	// This would be replaced with your actual menuItem create action
	const menuItemCreate = useSelector((state) => state.productCreate);
	const { loading, error } = menuItemCreate;

	const vendor_Login = useSelector((state) => state.vendor_Login);
	const { vendorInfo } = vendor_Login;

	const [vendorEmail, setVendorEmail] = useState(vendorInfo ? vendorInfo.email : "");

	// Predefined categories for restaurant menu items
	const categoryOptions = [
		"Starters",
		"Main Course",
		"Rice & Noodles",
		"Pizza",
		"Burgers",
		"Sandwiches",
		"Soups",
		"Salads",
		"Desserts",
		"Beverages",
		"Sides",
		"Special Items",
		"Other",
	];

	const resetHandler = () => {
		setItemName("");
		setCategory("");
		setDescription("");
		setPrice("");
		setPreparationTime("");
		setAvailability(true);
		setCustomizations("");
		setPicUrl("https://res.cloudinary.com/dfmnpw0yp/image/upload/v1679235307/assets/tsuh9f6v1reihgqxwxrz.ico");
	};

	const demoHandler = () => {
		setVendorEmail(vendorInfo.email);
		setItemName("Spicy Chicken Burger");
		setCategory("Burgers");
		setDescription(
			"Our signature spicy chicken burger with crispy fried chicken fillet, fresh lettuce, tomato, and special house sauce served in a toasted brioche bun."
		);
		setPrice(750);
		setPreparationTime(15);
		setAvailability(true);
		setCustomizations("Extra cheese (+100 LKR), Bacon (+150 LKR), Extra spicy sauce (+50 LKR)");
	};

	// const submitHandler = (e) => {
	// 	e.preventDefault();

	// 	if (!vendorEmail || !itemName || !category || !description || !picURL || !price || !preparationTime) {
	// 		setMessage("Please fill all required fields");
	// 		return;
	// 	}

	// 	// Replace this with your actual create menu item action
	// 	console.log("Menu item submitted:", {
	// 		vendorEmail,
	// 		itemName,
	// 		category,
	// 		description,
	// 		picURL,
	// 		price,
	// 		preparationTime,
	// 		availability,
	// 		customizations,
	// 	});

	// 	// Uncomment and modify this when you have the action ready
	// 	/*
	// 	dispatch(
	// 		createMenuItem(
	// 			vendorEmail,
	// 			itemName,
	// 			category,
	// 			description,
	// 			picURL,
	// 			price,
	// 			preparationTime,
	// 			availability,
	// 			customizations
	// 		)
	// 	);
	// 	*/

	// 	resetHandler();
	// };

	const submitHandler = (e) => {
		e.preventDefault();
	
		if (!vendorEmail || !itemName || !category || !description || !picURL || !price || !preparationTime) {
			setMessage("Please fill all required fields");
			return;
		}
	
		// Create a product data object with all necessary fields
		const productData = {
			vendorEmail,
			itemName, // This will be used as title in the controller
			category,
			description,
			picURL,
			price,
			preparationTime,
			availability,
			customizations,
			// Supply defaults for the required fields in the old model
			productBrand: "Restaurant Brand",
			productCode: `MENU-${Date.now()}`, // Generate a unique code
			ingredients: customizations || "Not specified",
			usage: "Consume fresh",
			warnings: "No specific warnings",
			discountNote: "No current discounts",
			discountPrice: price, // Default to regular price
			quantity: 100 // Default stock quantity
		};
	
		// Dispatch the action with all the data
		dispatch(createProduct(productData));
		resetHandler();
	};

	const postDetails = (pics) => {
		if (!pics) {
			return setPicMessage("Please select an image");
		}
		
		setPicMessage(null);
		if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg") {
			setIsImageLoading(true);
			const data = new FormData();
			data.append("file", pics);
			data.append("upload_preset", "vendorProducts");
			data.append("cloud_name", "dfmnpw0yp");
			fetch("https://api.cloudinary.com/v1_1/dfmnpw0yp/image/upload", {
				method: "post",
				body: data,
			})
				.then((res) => res.json())
				.then((data) => {
					setPicUrl(data.url.toString());
					setIsImageLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setIsImageLoading(false);
					setPicMessage("Image upload failed. Please try again.");
				});
		} else {
			return setPicMessage("Please select a valid image (JPEG, JPG, or PNG)");
		}
	};

	useEffect(() => {}, []);

	if (vendorInfo) {
		return (
			<div className="menuItemBg">
				<MainScreen title="">
					<div className="menu-item-header">
						<Button
							variant="outline-primary"
							className="back-btn"
							href="/vendor-products"
						>
							<FaArrowLeft /> Back to Menu Items
						</Button>
						<h2 className="page-title"><FaUtensils className="title-icon" /> Add New Menu Item</h2>
						<div className="invisible" style={{ width: "100px" }}></div> {/* For alignment */}
					</div>

					<Card
						className="menu-item-card"
					>
						<Card.Body>
							<div>
								{error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
								{message && <ErrorMessage variant="danger">{message}</ErrorMessage>}
								{loading && <Loading />}
							</div>

							<Row className="menu-item-container">
								<Col md={7} className="form-container">
									<Form onSubmit={submitHandler}>
										<Form.Group controlId="menuItemFormBasicVendorEmail">
											<Form.Label>Restaurant Email</Form.Label>
											<Form.Control
												type="email"
												value={vendorEmail}
												onChange={(e) => setVendorEmail(e.target.value)}
												readOnly
												className="mb-3"
											/>
										</Form.Group>
										
										<Form.Group controlId="menuItemFormBasicName">
											<Form.Label>Item Name <span className="required">*</span></Form.Label>
											<Form.Control
												type="text"
												value={itemName}
												placeholder="Enter menu item name"
												onChange={(e) => setItemName(e.target.value)}
												required
												className="mb-3"
											/>
										</Form.Group>
										
										<Form.Group controlId="menuItemFormBasicCategory" className="mb-3">
											<Form.Label>Category <span className="required">*</span></Form.Label>
											<Form.Control
												as="select"
												value={category}
												onChange={(e) => setCategory(e.target.value)}
												required
											>
												<option value="">Select Category</option>
												{categoryOptions.map((option, index) => (
													<option key={index} value={option}>
														{option}
													</option>
												))}
											</Form.Control>
										</Form.Group>
										
										<Form.Group controlId="menuItemFormBasicDescription" className="mb-3">
											<Form.Label>Description <span className="required">*</span></Form.Label>
											<Form.Control
												as="textarea"
												rows={3}
												value={description}
												placeholder="Describe your menu item"
												onChange={(e) => setDescription(e.target.value)}
												required
											/>
										</Form.Group>
										
										<Row>
											<Col md={6}>
												<Form.Group controlId="menuItemFormBasicPrice" className="mb-3">
													<Form.Label>Price (LKR) <span className="required">*</span></Form.Label>
													<Form.Control
														type="number"
														value={price}
														placeholder="Enter price"
														onChange={(e) => setPrice(e.target.value)}
														required
													/>
												</Form.Group>
											</Col>
											<Col md={6}>
												<Form.Group controlId="menuItemFormBasicPrepTime" className="mb-3">
													<Form.Label>Preparation Time (minutes) <span className="required">*</span></Form.Label>
													<Form.Control
														type="number"
														value={preparationTime}
														placeholder="Time in minutes"
														onChange={(e) => setPreparationTime(e.target.value)}
														required
													/>
												</Form.Group>
											</Col>
										</Row>
										
										<Form.Group controlId="menuItemFormBasicAvailability" className="mb-3">
											<Form.Label>Availability</Form.Label>
											<div className="availability-toggle">
												<div 
													className={`toggle-switch ${availability ? "active" : ""}`}
													onClick={() => setAvailability(!availability)}
												>
													<div className="toggle-knob"></div>
												</div>
												<span className={`availability-status ${availability ? "text-success" : "text-danger"}`}>
													{availability ? "Available" : "Out of Stock"}
												</span>
											</div>
										</Form.Group>
										
										<Form.Group controlId="menuItemFormBasicCustomizations" className="mb-3">
											<Form.Label>Customizations/Add-ons (Optional)</Form.Label>
											<Form.Control
												as="textarea"
												rows={2}
												value={customizations}
												placeholder="Add customization options (e.g., Extra cheese (+100 LKR), Spicy level, etc.)"
												onChange={(e) => setCustomizations(e.target.value)}
											/>
										</Form.Group>
										
										{picMessage && <ErrorMessage variant="danger">{picMessage}</ErrorMessage>}
										<Form.Group controlId="menuItemFormBasicImage" className="mb-4">
											<Form.Label>Menu Item Image <span className="required">*</span></Form.Label>
											<div className="file-input-container">
												<input
													type="file"
													accept="image/*"
													id="menu-item-pic"
													onChange={(e) => postDetails(e.target.files[0])}
													className="file-input"
												/>
												<label htmlFor="menu-item-pic" className="file-input-label">
													Choose Image
												</label>
												<span className="file-name">
													{picURL !== "https://res.cloudinary.com/dfmnpw0yp/image/upload/v1679235307/assets/tsuh9f6v1reihgqxwxrz.ico"
														? "Image selected"
														: "No image selected"}
												</span>
											</div>
										</Form.Group>
										
										<div className="button-container">
											<Button
												variant="primary"
												type="submit"
												className="action-btn submit-btn"
											>
												Add Menu Item
											</Button>
											
											<Button
												variant="danger"
												onClick={resetHandler}
												className="action-btn reset-btn"
											>
												Reset
											</Button>
											
											<Button
												variant="outline-info"
												onClick={demoHandler}
												className="action-btn"
											>
												Demo
											</Button>
										</div>
									</Form>
								</Col>
								
								<Col md={5} className="image-preview-column">
									<div className="image-preview-container">
										<h4 className="preview-title">Item Preview</h4>
										<div className="image-container">
											{isImageLoading ? (
												<div className="image-loading">
													<div className="spinner"></div>
													<p>Uploading image...</p>
												</div>
											) : (
												<img 
													src={picURL} 
													alt={itemName || "Menu item preview"} 
													className="item-preview-image" 
												/>
											)}
										</div>
										<div className="preview-details">
											{itemName && <h3 className="item-name">{itemName}</h3>}
											{category && <span className="item-category">{category}</span>}
											{price && <div className="item-price">LKR {price}</div>}
											{preparationTime && (
												<div className="prep-time">
													<small>Preparation time: {preparationTime} mins</small>
												</div>
											)}
											{description && <p className="item-description">{description}</p>}
										</div>
									</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>
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
}

export default AddProductByVendorScreen;

// import React, { useEffect, useState } from "react";
// import MainScreen from "../../../../components/MainScreen";
// import { useDispatch, useSelector } from "react-redux";
// import { Form, Button, Row, Col, Card } from "react-bootstrap";
// import { createProduct } from "../../../../actions/productManagementActions/productActions";
// import Loading from "../../../../components/Loading";
// import ErrorMessage from "../../../../components/ErrorMessage";
// import "./addProduct.css";

// function AddProductByVendorScreen() {
// 	const [title, setTitle] = useState("");
// 	const [category, setCategory] = useState("");
// 	const [productBrand, setProductBrand] = useState("");
// 	const [productCode, setProductCode] = useState("");
// 	const [description, setDescription] = useState("");
// 	const [picURL, setPicUrl] = useState(
// 		"https://res.cloudinary.com/dfmnpw0yp/image/upload/v1679235307/assets/tsuh9f6v1reihgqxwxrz.ico"
// 	);
// 	const [price, setPrice] = useState("");
// 	const [ingredients, setIngredients] = useState("");
// 	const [usage, setUsage] = useState("");
// 	const [warnings, setWarnings] = useState("");
// 	const [discountNote, setDiscountNote] = useState("");
// 	const [discountPrice, setDiscountPrice] = useState("");
// 	const [quantity, setQuantity] = useState("");
// 	const [message] = useState(null);
// 	const [picMessage, setPicMessage] = useState(null);

// 	const dispatch = useDispatch();

// 	const productCreate = useSelector((state) => state.productCreate);
// 	const { loading, error } = productCreate;

// 	const vendor_Login = useSelector((state) => state.vendor_Login);
// 	const { vendorInfo } = vendor_Login;

// 	const [vendorEmail, setVendorEmail] = useState(vendorInfo.email);

// 	const resetHandler = () => {
// 		setTitle("");
// 		setCategory("");
// 		setProductBrand("");
// 		setProductCode("");
// 		setDescription("");
// 		setPrice();
// 		setIngredients("");
// 		setUsage("");
// 		setWarnings("");
// 		setDiscountNote("");
// 		setDiscountPrice();
// 		setQuantity();
// 	};

// 	const demoHandler = () => {
// 		setVendorEmail(vendorInfo.email);
// 		setTitle("Dove Beauty Bar");
// 		setCategory("Beauty and Personal Care");
// 		setProductBrand("Dove");
// 		setProductCode("BC-1224");
// 		setDescription(
// 			"The secret to beautiful skin is moisture, and no ordinary bar hydrates like Dove. That’s because Dove isn’t soap, it’s a Beauty Bar.  While ordinary soaps can strip skin of essential moisture, Dove Beauty Bar has mild cleansers to effectively wash away dirt and germs and care beautifully. Made with our ¼ moisturizing cream, Dove Beauty Bar leaves your body, face and hands feeling soft, smooth, and radiant. You can see why we call it a Beauty Bar."
// 		);
// 		setPrice(1200);
// 		setIngredients(
// 			"Sodium Lauroyl Isethionate, Stearic Acid, Sodium Tallowate Or Sodium Palmitate, Lauric Acid, Sodium Isethionate, Water, Sodium Stearate, Cocamidopropyl Betaine, Sodium Cocoate Or Sodium Palm Kernelate, Fragrance, Sodium Chloride, Tetrasodium Edta, Tetrasodium Etidronate, Titanium Dioxide (Ci 77891)."
// 		);
// 		setUsage("Wash with gentle touch");
// 		setWarnings("People who are with sesnsitive skin must have medical approval before use.");
// 		setDiscountNote("5% off");
// 		setDiscountPrice(60);
// 		setQuantity(150);
// 	};

// 	const submitHandler = (e) => {
// 		e.preventDefault();

// 		if (
// 			!vendorEmail ||
// 			!title ||
// 			!category ||
// 			!productBrand ||
// 			!productCode ||
// 			!description ||
// 			!picURL ||
// 			!price ||
// 			!ingredients ||
// 			!usage ||
// 			!warnings ||
// 			!discountNote ||
// 			!discountPrice ||
// 			!quantity
// 		)
// 			return;
// 		dispatch(
// 			createProduct(
// 				vendorEmail,
// 				title,
// 				category,
// 				productBrand,
// 				productCode,
// 				description,
// 				picURL,
// 				price,
// 				ingredients,
// 				usage,
// 				warnings,
// 				discountNote,
// 				discountPrice,
// 				quantity
// 			)
// 		);

// 		resetHandler();
// 	};

// 	const postDetails = (pics) => {
// 		if (pics === "https://res.cloudinary.com/dfmnpw0yp/image/upload/v1679235307/assets/tsuh9f6v1reihgqxwxrz.ico") {
// 			return setPicMessage("Please Select an Image");
// 		}
// 		setPicMessage(null);
// 		if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg") {
// 			const data = new FormData();
// 			data.append("file", pics);
// 			data.append("upload_preset", "vendorProducts");
// 			data.append("cloud_name", "dfmnpw0yp");
// 			fetch("https://api.cloudinary.com/v1_1/dfmnpw0yp/image/upload", {
// 				method: "post",
// 				body: data,
// 			})
// 				.then((res) => res.json())
// 				.then((data) => {
// 					setPicUrl(data.url.toString());
// 				})
// 				.catch((err) => {
// 					console.log(err);
// 				});
// 		} else {
// 			return setPicMessage("Please Select an Image");
// 		}
// 	};

// 	useEffect(() => {}, []);
// 	if (vendorInfo) {
// 		return (
// 			<div className="productBg">
// 				<br></br>
// 				<MainScreen title="Add a New Product">
// 					<Button
// 						variant="success"
// 						style={{
// 							float: "left",
// 							marginTop: 5,
// 							fontSize: 15,
// 						}}
// 						href="/vendor-products"
// 					>
// 						{" "}
// 						Back to Products List
// 					</Button>
// 					<br></br>
// 					<br></br>
// 					<br></br>
// 					<Card
// 						className="profileCont"
// 						style={{
// 							borderRadius: 45,
// 							borderWidth: 2.0,
// 							marginTop: 20,
// 							paddingInline: 10,
// 							paddingLeft: 25,
// 							paddingRight: 25,
// 							background: "rgba(231, 238, 238, 0.9)",
// 						}}
// 					>
// 						<div className="productContainer">
// 							<div>
// 								{error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
// 								{message && <ErrorMessage variant="danger">{message}</ErrorMessage>}
// 								{loading && <Loading />}
// 							</div>
// 							<br></br>
// 							<Row className="ProductContainer">
// 								<Col md={6}>
// 									<Form onSubmit={submitHandler}>
// 										<Form.Group controlId="productFormBasicVendorEmail">
// 											<Form.Label>Vendor Email</Form.Label>
// 											<Form.Control
// 												type="email"
// 												value={vendorEmail}
// 												onChange={(e) => setVendorEmail(e.target.value)}
// 												readOnly
// 											/>
// 										</Form.Group>
// 										<br></br>
// 										<Form.Group controlId="productFormBasicProductTitle">
// 											<Form.Label>Product Name</Form.Label>
// 											<Form.Control
// 												type="text"
// 												value={title}
// 												placeholder="Enter Title"
// 												onChange={(e) => setTitle(e.target.value)}
// 												required
// 											/>
// 										</Form.Group>
// 										<br></br>
// 										<Form.Group controlId="productFormBasicCategory">
// 											<Form.Label>Product Category</Form.Label>
// 											<Form.Control
// 												type="text"
// 												value={category}
// 												placeholder="Enter Product Category"
// 												onChange={(e) => setCategory(e.target.value)}
// 												required
// 											/>
// 										</Form.Group>
// 										<br></br>
// 										<Form.Group controlId="productFormBasicBrand">
// 											<Form.Label>Product Brand</Form.Label>
// 											<Form.Control
// 												type="text"
// 												value={productBrand}
// 												placeholder="Enter Product Brand"
// 												onChange={(e) => setProductBrand(e.target.value)}
// 												required
// 											/>
// 										</Form.Group>
// 										<br></br>
// 										<Form.Group controlId="productFormBasicCode">
// 											<Form.Label>Product Code</Form.Label>
// 											<Form.Control
// 												type="text"
// 												value={productCode}
// 												placeholder="Enter Product Code"
// 												onChange={(e) => setProductCode(e.target.value)}
// 												required
// 											/>
// 										</Form.Group>
// 										<br></br>
// 										<Form.Group controlId="productFormBasicDescription">
// 											<Form.Label>Product Description</Form.Label>
// 											<textarea
// 												style={{
// 													width: "100%",
// 													fontSize: "16px",
// 													borderRadius: "5px",
// 												}}
// 												value={description}
// 												placeholder="Enter Product Description"
// 												onChange={(e) => setDescription(e.target.value)}
// 												required
// 												rows={7}
// 											/>
// 										</Form.Group>
// 										<br></br>
// 										<Form.Group controlId="productFormBasicPrice">
// 											<Form.Label>Product Price</Form.Label>
// 											<Form.Control
// 												type="text"
// 												value={price}
// 												placeholder="Enter Product Price"
// 												onChange={(e) => setPrice(e.target.value)}
// 												required
// 											/>
// 										</Form.Group>
// 										<br></br>
// 										<Form.Group controlId="productFormBasicIngredients">
// 											<Form.Label>Product Ingredients</Form.Label>
// 											<textarea
// 												style={{
// 													width: "100%",
// 													fontSize: "16px",
// 													borderRadius: "5px",
// 												}}
// 												value={ingredients}
// 												placeholder="Enter Product Ingredients"
// 												onChange={(e) => setIngredients(e.target.value)}
// 												required
// 												rows={3}
// 											/>
// 										</Form.Group>
// 										<br></br>
// 										<Form.Group controlId="productFormBasicUsage">
// 											<Form.Label>Product Usage</Form.Label>
// 											<textarea
// 												style={{
// 													width: "100%",
// 													fontSize: "16px",
// 													borderRadius: "5px",
// 												}}
// 												value={usage}
// 												placeholder="Enter Product Usage"
// 												onChange={(e) => setUsage(e.target.value)}
// 												required
// 												rows={2}
// 											/>
// 										</Form.Group>
// 										<br></br>
// 										<Form.Group controlId="productFormBasicWarnings">
// 											<Form.Label>Product Warnings</Form.Label>
// 											<textarea
// 												style={{
// 													width: "100%",
// 													fontSize: "16px",
// 													borderRadius: "5px",
// 												}}
// 												value={warnings}
// 												placeholder="Enter Product Warnings"
// 												onChange={(e) => setWarnings(e.target.value)}
// 												required
// 												rows={3}
// 											/>
// 										</Form.Group>
// 										<br></br>
// 										<Form.Group controlId="productFormBasicDiscountNote">
// 											<Form.Label>Discount Note</Form.Label>
// 											<textarea
// 												style={{
// 													width: "100%",
// 													fontSize: "16px",
// 													borderRadius: "5px",
// 												}}
// 												value={discountNote}
// 												placeholder="Enter Discount Note"
// 												onChange={(e) => setDiscountNote(e.target.value)}
// 												required
// 												rows={2}
// 											/>
// 										</Form.Group>
// 										<br></br>
// 										<Form.Group controlId="productFormBasicDiscountPrice">
// 											<Form.Label>Discount Price</Form.Label>
// 											<Form.Control
// 												type="text"
// 												value={discountPrice}
// 												placeholder="Enter Discount Price"
// 												onChange={(e) => setDiscountPrice(e.target.value)}
// 												required
// 											/>
// 										</Form.Group>
// 										<br></br>
// 										<Form.Group controlId="productFormBasicQuantity">
// 											<Form.Label>Quantity</Form.Label>
// 											<Form.Control
// 												type="text"
// 												value={quantity}
// 												placeholder="Enter Quantity"
// 												onChange={(e) => setQuantity(e.target.value)}
// 												required
// 											/>
// 										</Form.Group>
// 										<br></br>
// 										{picMessage && <ErrorMessage variant="danger">{picMessage}</ErrorMessage>}
// 										<Form.Group controlId="pic">
// 											<Form.Label>Product Picture</Form.Label>
// 											&emsp;
// 											<input
// 												type="file"
// 												accept="image/*"
// 												id="product-pic"
// 												onChange={(e) => postDetails(e.target.files[0])}
// 											/>
// 										</Form.Group>
// 										<br></br>
// 										<Button
// 											variant="primary"
// 											type="submit"
// 											style={{
// 												fontSize: 15,
// 												marginTop: 10,
// 											}}
// 										>
// 											Submit
// 										</Button>
// 										&emsp;
// 										<Button
// 											variant="danger"
// 											onClick={resetHandler}
// 											style={{
// 												fontSize: 15,
// 												marginTop: 10,
// 											}}
// 										>
// 											Reset
// 										</Button>
// 										&emsp;
// 										<Button
// 											variant="info"
// 											onClick={demoHandler}
// 											style={{
// 												fontSize: 15,
// 												marginTop: 10,
// 											}}
// 										>
// 											Demo
// 										</Button>
// 									</Form>
// 								</Col>
// 								<Col
// 									style={{
// 										display: "flex",
// 										alignItems: "center",
// 										justifyContent: "center",
// 									}}
// 								>
// 									<img
// 										src={picURL}
// 										alt={title}
// 										className="profilePic"
// 										style={{
// 											boxShadow: "7px 7px 20px ",
// 											borderColor: "black",
// 											borderRadius: 25,
// 											background: "white",
// 											width: "300px",
// 											height: "300px",
// 										}}
// 									/>
// 								</Col>
// 							</Row>
// 						</div>
// 						<br></br>
// 					</Card>
// 					<br></br>
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
// }

// export default AddProductByVendorScreen;