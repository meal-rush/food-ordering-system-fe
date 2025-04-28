import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Container, Row, Col, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import MainScreen from "../../components/MainScreen";
import { API_ENDPOINT } from "../../config";
import { createCartAction } from "../../actions/cartManagementActions/cartAction";
import Loading from "../../components/Loading";
import ReactStars from "react-rating-stars-component";
import { FaClock, FaShoppingCart, FaChevronLeft, FaUtensils, FaCommentAlt, FaExclamationCircle } from "react-icons/fa";
import "./product-view.css";

export default function SingleProduct({ match, history }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [productCode, setProductCode] = useState("");
  const [description, setDescription] = useState("");
  const [picURL, setPicURL] = useState("");
  const [price, setPrice] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [customizations, setCustomizations] = useState("");
  const [preparationTime, setPreparationTime] = useState("");
  const [usage, setUsage] = useState("");
  const [warnings, setWarnings] = useState("");
  const [discountNote, setDiscountNote] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [availability, setAvailability] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // State for error modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const customer_Login = useSelector((state) => state.customer_Login);
  const { customerInfo } = customer_Login;

  const cartCreate = useSelector((state) => state.cartCreate);
  const cartLoading = cartCreate?.loading;
  const cartError = cartCreate?.error;

  // Show error modal when an error occurs
  useEffect(() => {
    if (error || cartError) {
      setErrorMessage(error || cartError);
      setShowErrorModal(true);
    }
  }, [error, cartError]);

  // Calculate discounted price (helper function)
  const calculateDiscountedPrice = (price, discountNote) => {
    if (!discountNote || !discountNote.includes('%')) return price;
    const discountValue = discountNote.match(/\d+/);
    if (!discountValue) return price;
    
    const discountPercentage = parseInt(discountValue[0]);
    return (price - (price * discountPercentage / 100)).toFixed(2);
  };

  useEffect(() => {
    const fetching = async () => {
      try {
        const { data } = await axios.get(`${API_ENDPOINT}/items/products/${match.params.id}`);
        setTitle(data.title);
        setCategory(data.category);
        setProductCode(data.productCode);
        setDescription(data.description);
        setPicURL(data.picURL);
        setPrice(data.price);
        setIngredients(data.ingredients);
        setUsage(data.usage);
        setWarnings(data.warnings);
        setDiscountNote(data.discountNote);
        setDiscountPrice(data.discountPrice);
        setAvailability(data.availability !== undefined ? data.availability : true);
        setPreparationTime(data.preparationTime || "");
        setCustomizations(data.customizations || "");
      } catch (err) {
        setError("Failed to fetch product details");
      }
    };

    fetching();
  }, [match.params.id]);

  // Updated addToCart function to handle case when user is not logged in
  function addToCart(title, category, productCode, picURL, price, discountNote, discountPrice) {
    if (!customerInfo) {
      setError("Please log in to add items to cart");
      return;
    }
    
    setLoading(true);
    try {
      dispatch(
        createCartAction(customerInfo._id, title, category, productCode, picURL, price, discountNote, discountPrice, 1)
      );
      setLoading(false);
    } catch (err) {
      setError("Failed to add item to cart");
      setLoading(false);
    }
  }

  // Error modal close handler
  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  return (
    <div className="product-details-page">
      <MainScreen title="">
        <Container>
          <div className="back-button-container">
            <Button 
              variant="outline-primary" 
              onClick={() => history.push("/")} 
              className="back-button"
            >
              <FaChevronLeft /> Back to Home
            </Button>
          </div>

          {(loading || cartLoading) && <Loading />}

          {/* Error Modal */}
          <Modal 
            show={showErrorModal} 
            onHide={handleCloseErrorModal}
            centered
            animation
            className="error-modal"
          >
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

          <div className="product-detail-container">
            <Row>
              <Col lg={5} md={6} className="product-image-col">
                <div className="product-image-container">
                  <img 
                    src={picURL} 
                    alt={title} 
                    className="product-detail-image"
                  />
                  {discountNote && discountNote.includes('%') && (
                    <div className="discount-tag">
                      {discountNote}
                    </div>
                  )}
                  {!availability && (
                    <div className="unavailable-overlay">
                      <span>Out of Stock</span>
                    </div>
                  )}
                </div>
              </Col>

              <Col lg={7} md={6} className="product-info-col">
                <div className="product-info-container">
                  <div className="product-header">
                    <h2 className="product-title">{title}</h2>
                    <span className="product-code">{productCode}</span>
                  </div>

                  <div className="product-meta">
                    <span className="product-category">{category}</span>
                    <div className="product-rating">
                      <ReactStars 
                        count={5} 
                        size={20} 
                        activeColor="#20cf20" 
                        edit={false} 
                        value={4.5} // Default rating (you can replace with actual rating)
                      />
                      <span className="rating-count">(24 reviews)</span>
                    </div>
                  </div>

                  <div className="product-price-container">
                    {discountNote && discountNote.includes('%') ? (
                      <>
                        <span className="original-price">LKR {price}</span>
                        <span className="discounted-price">
                          LKR {calculateDiscountedPrice(price, discountNote)}
                        </span>
                      </>
                    ) : (
                      <span className="current-price">LKR {price}</span>
                    )}
                    
                    {preparationTime && (
                      <div className="preparation-time">
                        <FaClock /> {preparationTime} min preparation
                      </div>
                    )}
                  </div>

                  <div className="product-description">
                    <h4>Description</h4>
                    <p>{description}</p>
                  </div>

                  {ingredients && (
                    <div className="product-ingredients">
                      <h4>Ingredients</h4>
                      <p>{ingredients}</p>
                    </div>
                  )}

                  {customizations && (
                    <div className="product-customizations">
                      <h4>Customization Options</h4>
                      <div className="customization-options">
                        {customizations.split(',').map((option, index) => (
                          <div key={index} className="customization-option">
                            <FaUtensils className="option-icon" />
                            <span>{option.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {warnings && (
                    <div className="product-warnings">
                      <h4>Warnings</h4>
                      <p>{warnings}</p>
                    </div>
                  )}

                  <div className="action-buttons">
                    <Button
                      onClick={() => addToCart(title, category, productCode, picURL, price, discountNote, discountPrice)}
                      disabled={!availability}
                      className="add-to-cart-btn"
                    >
                      <FaShoppingCart /> Add To Cart
                    </Button>
                    
                    <Button
                      href={`/product-review-list/${match.params.id}`}
                      className="reviews-btn"
                    >
                      <FaCommentAlt /> Reviews
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </MainScreen>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Button } from "react-bootstrap";
// import { useSelector, useDispatch } from "react-redux";
// import MainScreen from "../../components/MainScreen";
// import { API_ENDPOINT } from "../../config";
// import { createCartAction } from "../../actions/cartManagementActions/cartAction";
// import Loading from "../../components/Loading";
// import ErrorMessage from "../../components/ErrorMessage";
// import "./product-view.css";

// export default function SingleProduct({ match, history }) {
// 	const [title, setTitle] = useState("");
// 	const [category, setCategory] = useState("");
// 	const [productCode, setProductCode] = useState("");
// 	const [description, setDescription] = useState("");
// 	const [picURL, setPicURL] = useState("");
// 	const [price, setPrice] = useState("");
// 	const [ingredients, setIngredients] = useState("");
// 	const [usage, setUsage] = useState("");
// 	const [warnings, setWarnings] = useState("");
// 	const [discountNote, setDiscountNote] = useState("");
// 	const [quantity, setQuantity] = useState("");
// 	const [discount, setDiscount] = useState("");

// 	const dispatch = useDispatch();
// 	const customer_Login = useSelector((state) => state.customer_Login);
// 	const { customerInfo } = customer_Login;

// 	const cartCreate = useSelector((state) => state.cartCreate);
// 	const { loading, error } = cartCreate;

// 	useEffect(() => {
// 		const fetching = async () => {
// 			const { data } = await axios.get(`${API_ENDPOINT}/items/products/${match.params.id}`);
// 			setTitle(data.title);
// 			setCategory(data.category);
// 			setProductCode(data.productCode);
// 			setDescription(data.description);
// 			setPicURL(data.picURL);
// 			setPrice(data.price);
// 			setIngredients(data.ingredients);
// 			setUsage(data.usage);
// 			setWarnings(data.warnings);
// 			setDiscountNote(data.discountNote);
// 			setQuantity(data.quantity);
// 			setDiscount(data.discountPrice);
// 		};

// 		fetching();
// 	});
// 	function addToCart(title, category, productCode, picURL, price, discountNote, discountPrice) {
// 		dispatch(
// 			createCartAction(customerInfo._id, title, category, productCode, picURL, price, discountNote, discountPrice, 1)
// 		);
// 	}

// 	return (
// 		<div className="singlePlanView">
// 			<br></br>
// 			<br></br>
// 			<MainScreen title="">
// 				<h1
// 					style={{
// 						fontSize: "35px",
// 						fontWeight: "bold",
// 						letterSpacing: "3px",
// 					}}
// 				>
// 					{title} ({productCode})
// 				</h1>
// 				{error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
// 				{loading && <Loading />}
// 				<div className="product-card">
// 					<div className="details">
// 						<div className="big-img">
// 							<img
// 								src={picURL}
// 								alt=""
// 								style={{
// 									width: "500px",
// 									height: "750px",
// 									borderRadius: "15px",
// 								}}
// 							></img>
// 							<h2
// 								style={{
// 									fontSize: "30px",
// 									marginTop: "25px",
// 									fontWeight: "bold",
// 									color: "red",
// 								}}
// 							>
// 								Availability : {quantity}
// 							</h2>
// 						</div>
// 						<div className="box">
// 							<h2>Details</h2>
// 							<p>{description}</p>
// 							<h2>Ingredients</h2>
// 							<p>{ingredients}</p>
// 							<h2>Usage</h2>
// 							<p>{usage}</p>
// 							<h2>Warnings</h2>
// 							<p>{warnings}</p>
// 							<div className="row" style={{ margin: "50px" }}>
// 								<span>
// 									<h2 style={{ textDecoration: "line-through", fontSize: "30px" }}>Rs {price}</h2>
// 								</span>
// 								<span>
// 									<h2 style={{ fontSize: "30px" }}>{discountNote}</h2>
// 								</span>
// 							</div>
// 							<Button
// 								onClick={() => addToCart(title, category, productCode, picURL, price, discountNote, discount)}
// 								disabled={quantity <= 0}
// 								className="cart"
// 							>
// 								Add To Cart
// 							</Button>
// 							&emsp;
// 							<Button
// 								href={`/product-review-list/${match.params.id}`}
// 								style={{ marginLeft: "100px", background: "red" }}
// 								className="cart"
// 							>
// 								Reviews
// 							</Button>
// 						</div>
// 					</div>
// 				</div>
// 				<br></br>
// 				<br></br>
// 			</MainScreen>
// 		</div>
// 	);
// }