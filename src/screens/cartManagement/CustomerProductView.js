import MainScreen from "../../components/MainScreen";
import { Link, useHistory } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listCartProducts, createCartAction } from "../../actions/cartManagementActions/cartAction";
import { Grid } from "@material-ui/core";
import Loading from "../../components/Loading";
import ReactStars from "react-rating-stars-component";
import "./product-view.css";
import "./product-home.css";
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage, MDBBtn } from "mdb-react-ui-kit";
import { FaClock, FaShoppingCart, FaInfoCircle, FaExclamationCircle } from "react-icons/fa";

const CustomerProductView = () => {
	const dispatch = useDispatch();
	const cartProductList = useSelector((state) => state.cartProductList);
	const { cartProducts } = cartProductList;

	const customer_Login = useSelector((state) => state.customer_Login);
	const { customerInfo } = customer_Login;

	const [search, setSearch] = useState("");
	let inputHandler = (e) => {
		var lowerCase = e.target.value.toLowerCase();
		setSearch(lowerCase);
	};

	// State for error modal
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const cartCreate = useSelector((state) => state.cartCreate);
	const { loading, error } = cartCreate;

	// Show error modal when an error occurs
	useEffect(() => {
		if (error) {
			setErrorMessage(error);
			setShowErrorModal(true);
		}
	}, [error]);

	const history = useHistory();
	useEffect(() => {
		dispatch(listCartProducts());
	}, [dispatch, history.push]);

	function addToCart(title, category, productCode, picURL, price, discountNote, discountPrice) {
		if (!customerInfo) {
			setErrorMessage("Please log in to add items to cart");
			setShowErrorModal(true);
			return;
		}

		dispatch(
			createCartAction(customerInfo._id, title, category, productCode, picURL, price, discountNote, discountPrice, 1)
		);
	}

	// Error modal close handler
	const handleCloseErrorModal = () => {
		setShowErrorModal(false);
		setErrorMessage("");
	};

	// Calculate discounted price (helper function)
	const calculateDiscountedPrice = (price, discountNote) => {
		if (!discountNote || !discountNote.includes("%")) return price;
		const discountValue = discountNote.match(/\d+/);
		if (!discountValue) return price;

		const discountPercentage = parseInt(discountValue[0]);
		return (price - (price * discountPercentage) / 100).toFixed(2);
	};

	return (
		<div style={{ minHeight: 700 }}>
			<header className="masthead">
				<div className="container">{/* Header content preserved as per requirements */}</div>
			</header>
			<br></br>
			<MainScreen title="">
				<div className="search-container">
					<Form inline>
						<input type="text" placeholder="Search menu items..." onChange={inputHandler} className="search-input" />
					</Form>
				</div>
				{loading && <Loading />}

				{/* Error Modal */}
				<Modal show={showErrorModal} onHide={handleCloseErrorModal} centered animation className="error-modal">
					<Modal.Header closeButton>
						<Modal.Title>
							<FaExclamationCircle className="error-icon" />
							Error
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>{errorMessage}</p>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleCloseErrorModal}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>

				<div className="menu-items-container">
					{cartProducts &&
						cartProducts
							.reverse()
							.filter(
								(filteredProducts) =>
									filteredProducts.title.toLowerCase().includes(search.toLowerCase()) ||
									filteredProducts.productBrand?.toLowerCase().includes(search.toLowerCase())
							)
							.map((product) => (
								<div className="menu-item-card-wrapper" key={product._id}>
									<MDBCard className="menu-item-card">
										<div className="menu-item-image-container">
											<MDBCardImage src={product.picURL} alt={product.title} className="item-image" />
											{product.discountNote && product.discountNote.includes("%") && (
												<div className="discount-badge">{product.discountNote}</div>
											)}
											{!product.availability && (
												<div className="unavailable-overlay">
													<span>Out of Stock</span>
												</div>
											)}
										</div>

										<MDBCardBody className="item-details">
											<div className="item-header">
												<h4 className="item-title">{product.title}</h4>
												<div className="item-rating">
													<ReactStars count={5} size={15} activeColor="#20cf20" />
												</div>
											</div>

											<p className="item-category">{product.category}</p>

											{product.description && (
												<p className="item-description">
													{product.description.length > 80
														? `${product.description.substring(0, 80)}...`
														: product.description}
												</p>
											)}

											<div className="item-meta">
												{product.preparationTime && (
													<div className="prep-time">
														<FaClock /> {product.preparationTime} min
													</div>
												)}

												<div className="item-price">
													{product.discountNote && product.discountNote.includes("%") ? (
														<>
															<span className="original-price">LKR {product.price}</span>
															<span className="discounted-price">
																LKR {calculateDiscountedPrice(product.price, product.discountNote)}
															</span>
														</>
													) : (
														<span>LKR {product.price}</span>
													)}
												</div>
											</div>

											{product.customizations && (
												<div className="customizations">
													<small>Customizable</small>
												</div>
											)}

											<div className="card-actions">
												<Button
													onClick={() =>
														addToCart(
															product.title,
															product.category,
															product.productCode,
															product.picURL,
															product.price,
															product.discountNote,
															product.discountPrice
														)
													}
													disabled={!product.availability || product.quantity <= 0}
													className="cart-btn"
												>
													<FaShoppingCart /> Add
												</Button>

												<MDBBtn href={`/single-product-view/${product._id}`} className="view-more-btn">
													<FaInfoCircle /> Details
												</MDBBtn>
											</div>
										</MDBCardBody>
									</MDBCard>
								</div>
							))}
				</div>
			</MainScreen>

			{/* Keep the "Our Meals" section as is per requirements */}
			<section className="page-section " id="product">
				<div className="container">
					<div className="text-center">
						<h2 className="section-heading text-uppercase">Our Meals</h2>
						<h3 className="section-subheading text-muted">High quality foods with minimal prices.</h3>
					</div>
					<div className="row">
						<div className="col-lg-4 col-sm-6 mb-4">
							<div className="product-item">
								<img
									className="img-fluid"
									src="https://i.ibb.co/mrvcpVbN/food-on-a-plate-taken-through-top-view-and-white-b-5.png"
									alt="..."
									style={{ height: "200px" }}
								/>
								<div className="product-caption">
									<div className="product-caption-heading">Tropical Zen Bowl</div>
								</div>
							</div>
						</div>
						<div className="col-lg-4 col-sm-6 mb-4">
							<div className="product-item">
								<img
									className="img-fluid"
									src="https://i.ibb.co/6RNxrB8M/2.png"
									alt="..."
									style={{ height: "200px" }}
								/>
								<div className="product-caption">
									<div className="product-caption-heading">Sunset Chicken Delight</div>
								</div>
							</div>
						</div>
						<div className="col-lg-4 col-sm-6 mb-4">
							<div className="product-item">
								<img
									className="img-fluid"
									src="https://i.ibb.co/vvVpMLGW/3.png"
									alt="..."
									style={{ height: "200px" }}
								/>
								<div className="product-caption">
									<div className="product-caption-heading">Crispy Cutlet Fiesta</div>
								</div>
							</div>
						</div>
						<div className="col-lg-4 col-sm-6 mb-4 mb-lg-0">
							<div className="product-item">
								<img
									className="img-fluid"
									src="https://i.ibb.co/8DSVS8Bg/4.png"
									alt="..."
									style={{ height: "200px" }}
								/>

								<div className="product-caption">
									<div className="product-caption-heading">Garden Gourmet Stack</div>
								</div>
							</div>
						</div>

						<div className="col-lg-4 col-sm-6">
							<div className="product-item">
								<img
									className="img-fluid"
									src="https://i.ibb.co/PzbZbyvJ/5.png"
									alt="..."
									style={{ height: "200px" }}
								/>
								<div className="product-caption">
									<div className="product-caption-heading">Golden Morning Platter</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default CustomerProductView;

// import MainScreen from "../../components/MainScreen";
// import { Link, useHistory } from "react-router-dom";
// import { Button, Form } from "react-bootstrap";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { listCartProducts, createCartAction } from "../../actions/cartManagementActions/cartAction";
// import { Grid } from "@material-ui/core";
// import Loading from "../../components/Loading";
// import ErrorMessage from "../../components/ErrorMessage";
// import ReactStars from "react-rating-stars-component";
// import "./product-view.css";
// import "./product-home.css";
// import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage, MDBBtn, MDBRipple } from "mdb-react-ui-kit";

// const CustomerProductView = () => {
// 	const dispatch = useDispatch();
// 	const cartProductList = useSelector((state) => state.cartProductList);
// 	const { cartProducts } = cartProductList;

// 	const customer_Login = useSelector((state) => state.customer_Login);
// 	const { customerInfo } = customer_Login;

// 	const [search, setSearch] = useState("");
// 	let inputHandler = (e) => {
// 		var lowerCase = e.target.value.toLowerCase();
// 		setSearch(lowerCase);
// 	};

// 	const cartCreate = useSelector((state) => state.cartCreate);
// 	const { loading, error } = cartCreate;

// 	const history = useHistory();
// 	useEffect(() => {
// 		dispatch(listCartProducts());
// 	}, [dispatch, history.push]);

// 	function addToCart(title, category, productCode, picURL, price, discountNote, discountPrice) {
// 		dispatch(
// 			createCartAction(customerInfo._id, title, category, productCode, picURL, price, discountNote, discountPrice, 1)
// 		);
// 	}

// 	return (
// 		<div style={{ minHeight: 700 }}>
// 			<header className="masthead">
// 				<div className="container">
// 					{/* <div className="masthead-subheading">Welcome To Meal Rush!</div>
// 					<div className="masthead-heading text-uppercase">It's Nice To Meet You</div> */}
// 					{/* <Link to="/">
// 						<Button
// 							variant="success"
// 							size="lg"
// 							className="landingbutton"
// 							style={{
// 								width: 250,
// 								height: 70,
// 								fontSize: 20,
// 								borderRadius: 0,
// 							}}
// 						>
// 							Tell Me More
// 						</Button>
// 					</Link> */}
// 				</div>
// 			</header>
// 			<br></br>
// 			<MainScreen title="">
// 				<div className="search" style={{ marginTop: 5 }}>
// 					<Form inline>
// 						<input
// 							type="text"
// 							placeholder="Search..."
// 							onChange={inputHandler}
// 							style={{
// 								width: 260,
// 								height: 40,
// 								borderRadius: "50px",
// 								padding: "10px",
// 								paddingLeft: "15px",
// 								marginLeft: 860,
// 								fontSize: 15,
// 								backgroundColor: "#f0fff0",
// 								color: "black",
// 								borderWidth: "5px",
// 							}}
// 						/>
// 					</Form>
// 				</div>
// 				{error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
// 				{loading && <Loading />}
// 				{cartProducts &&
// 					cartProducts
// 						.reverse()
// 						.filter(
// 							(filteredProducts) =>
// 								filteredProducts.title.toLowerCase().includes(search.toLowerCase()) ||
// 								filteredProducts.productBrand.includes(search.toLowerCase)
// 						)
// 						.map((product) => (
// 							<Grid
// 								item
// 								xs={12}
// 								sm={5}
// 								md={4}
// 								key={cartProducts.indexOf(product)}
// 								style={{
// 									display: "inline-flex",
// 									width: "600px",
// 								}}
// 							>
// 								<MDBContainer fluid className="my-5">
// 									<MDBRow className="justify-content-center">
// 										<MDBCol md="12" lg="6" xl="11">
// 											<MDBCard
// 												style={{
// 													borderRadius: "0px",
// 													boxShadow: " 10px 10px 5px #f2f3f4",
// 													backgroundColor: "#f0fff0",
// 													borderWidth: "5px",
// 													borderColor: "#087830",
// 													height: "550px",
// 													width: "340px",
// 												}}
// 											>
// 												<MDBRipple rippleColor="light" rippleTag="div" className="bg-image rounded hover-overlay">
// 													<MDBCardImage
// 														src={product.picURL}
// 														fluid
// 														className="w-100"
// 														style={{
// 															borderRadius: "0px",
// 															width: "100px",
// 															height: "300px",
// 														}}
// 													/>
// 												</MDBRipple>
// 												<MDBCardBody className="pb-0">
// 													<div className="d-flex justify-content-between">
// 														<div>
// 															<h4>{product.title}</h4>
// 														</div>
// 														<div>
// 															<div className="d-flex flex-row justify-content-end mt-1 mb-4 text-danger">
// 																<ReactStars count={5} size={15} activeColor="#20cf20" />
// 															</div>
// 														</div>
// 													</div>
// 												</MDBCardBody>
// 												<hr class="my-0" />
// 												<MDBCardBody className="pb-0">
// 													<div className="d-flex justify-content-between">
// 														<h4 style={{ textDecoration: "line-through" }}>
// 															<a href="#!" className="text-dark">
// 																Rs {product.price}
// 															</a>
// 														</h4>
// 														<h4 className="text-dark">Availability : {product.quantity}</h4>
// 													</div>
// 													<h4>{product.discountNote}</h4>
// 												</MDBCardBody>
// 												<hr class="my-0" />
// 												<MDBCardBody className="pb-0">
// 													<div className="d-flex justify-content-between align-items-center pb-2 mb-4">
// 														{customerInfo ? (
// 															<Button
// 																onClick={() =>
// 																	addToCart(
// 																		product.title,
// 																		product.category,
// 																		product.productCode,
// 																		product.picURL,
// 																		product.price,
// 																		product.discountNote,
// 																		product.discountPrice
// 																	)
// 																}
// 																disabled={product.quantity <= 0}
// 																style={{
// 																	paddingRight: "5px",
// 																	paddingLeft: "5px",
// 																	border: "3px solid white",
// 																	width: "80px",
// 																	fontSize: "10px",
// 																	height: "30px",
// 																	borderRadius: "0px",
// 																	backgroundColor: "black",
// 																}}
// 															>
// 																Add To Cart
// 															</Button>
// 														) : (
// 															<></>
// 														)}
// 														<MDBBtn
// 															href={`/single-product-view/${product._id}`}
// 															style={{
// 																paddingRight: "5px",
// 																paddingLeft: "5px",
// 																width: "80px",
// 																backgroundColor: "#648c11",
// 																border: "3px solid white",
// 																fontSize: "10px",
// 																height: "30px",
// 																borderRadius: "0px",
// 																borderWidth: "5px white",
// 															}}
// 														>
// 															More
// 														</MDBBtn>
// 													</div>
// 												</MDBCardBody>
// 											</MDBCard>
// 										</MDBCol>
// 									</MDBRow>
// 								</MDBContainer>
// 							</Grid>
// 						))}
// 			</MainScreen>
// 			<section className="page-section " id="product">
// 				<div className="container">
// 					<div className="text-center">
// 						<h2 className="section-heading text-uppercase">Our Meals</h2>
// 						<h3 className="section-subheading text-muted">High quality foods with minimal prices.</h3>
// 					</div>
// 					<div className="row">
// 						<div className="col-lg-4 col-sm-6 mb-4">
// 							<div className="product-item">
// 								<img
// 									className="img-fluid"
// 									src="https://i.ibb.co/mrvcpVbN/food-on-a-plate-taken-through-top-view-and-white-b-5.png"
// 									alt="..."
// 									style={{ height: "200px" }}
// 								/>
// 								<div className="product-caption">
// 									<div className="product-caption-heading">Tropical Zen Bowl</div>
// 								</div>
// 							</div>
// 						</div>
// 						<div className="col-lg-4 col-sm-6 mb-4">
// 							<div className="product-item">
// 								<img
// 									className="img-fluid"
// 									src="https://i.ibb.co/6RNxrB8M/2.png"
// 									alt="..."
// 									style={{ height: "200px" }}
// 								/>
// 								<div className="product-caption">
// 									<div className="product-caption-heading">Sunset Chicken Delight</div>
// 								</div>
// 							</div>
// 						</div>
// 						<div className="col-lg-4 col-sm-6 mb-4">
// 							<div className="product-item">
// 								<img
// 									className="img-fluid"
// 									src="https://i.ibb.co/vvVpMLGW/3.png"
// 									alt="..."
// 									style={{ height: "200px" }}
// 								/>
// 								<div className="product-caption">
// 									<div className="product-caption-heading">Crispy Cutlet Fiesta</div>
// 								</div>
// 							</div>
// 						</div>
// 						<div className="col-lg-4 col-sm-6 mb-4 mb-lg-0">
// 							<div className="product-item">
// 								<img
// 									className="img-fluid"
// 									src="https://i.ibb.co/8DSVS8Bg/4.png"
// 									alt="..."
// 									style={{ height: "200px" }}
// 								/>

// 								<div className="product-caption">
// 									<div className="product-caption-heading">Garden Gourmet Stack</div>
// 								</div>
// 							</div>
// 						</div>

// 						<div className="col-lg-4 col-sm-6">
// 							<div className="product-item">
// 								<img
// 									className="img-fluid"
// 									src="https://i.ibb.co/PzbZbyvJ/5.png"
// 									alt="..."
// 									style={{ height: "200px" }}
// 								/>
// 								<div className="product-caption">
// 									<div className="product-caption-heading">Golden Morning Platter</div>
// 								</div>
// 							</div>
// 						</div>
// 						{/* <div className="col-lg-4 col-sm-6">
// 							<div className="product-item">
// 								<img
// 									className="img-fluid"
// 									src="https://www.nolibsvet.com/wp-content/uploads/2014/02/pharmacy.jpg"
// 									alt="..."
// 									style={{ height: "200px" }}
// 								/>
// 								<div className="product-caption">
// 									<div className="product-caption-heading">Pet</div>
// 								</div>
// 							</div>
// 						</div> */}
// 					</div>
// 				</div>
// 			</section>
// 		</div>
// 	);
// };

// export default CustomerProductView;
