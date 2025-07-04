import React, { useEffect, useState } from "react";
import MainScreen from "../../../../components/MainScreen";
import axios from "axios";
import { Button, Card, Form, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  authHeaderForVendor,
  deleteProductByVendor,
  updateProductByVendor,
} from "../../../../actions/productManagementActions/productActions";
import ErrorMessage from "../../../../components/ErrorMessage";
import Loading from "../../../../components/Loading";
import swal from "sweetalert";
import "./singleProduct.css";
import { API_ENDPOINT } from "../../../../config";
import { FaArrowLeft, FaUtensils, FaTrash, FaSave } from "react-icons/fa";

function SingleProductForVendorScreen({ match, history }) {
  const [vendorEmail, setVendorEmail] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [picURL, setPicUrl] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState(""); // Add discount state
  const [preparationTime, setPreparationTime] = useState("");
  const [availability, setAvailability] = useState(true);
  const [customizations, setCustomizations] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  
  // Hidden fields (not shown in UI but needed for the model)
  const [productBrand, setProductBrand] = useState("");
  const [productCode, setProductCode] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [usage, setUsage] = useState("");
  const [warnings, setWarnings] = useState("");
  const [discountNote, setDiscountNote] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  
  const [picMessage, setPicMessage] = useState(null);
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const productUpdateByVendor = useSelector((state) => state.productUpdateByVendor);
  const { loading, error } = productUpdateByVendor;

  const productDeleteByVendor = useSelector((state) => state.productDeleteByVendor);
  const { loading: loadingDelete, error: errorDelete } = productDeleteByVendor;

  const vendor_Login = useSelector((state) => state.vendor_Login);
  const { vendorInfo } = vendor_Login;

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

  // Calculate the discounted price based on price and discount percentage
  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    if (!originalPrice || !discountPercentage) return originalPrice;
    const discountAmount = (originalPrice * discountPercentage) / 100;
    return originalPrice - discountAmount;
  };

  const deleteHandler = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this menu item!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          dispatch(deleteProductByVendor(id));
          swal({
            title: "Success!",
            text: "Menu item deleted successfully",
            icon: "success",
            timer: 2000,
            button: false,
          });

          history.push("/vendor-products");
        }
      })
      .catch((err) => {
        swal({
          title: "Error!",
          text: "Could not delete menu item",
          type: "error",
        });
      });
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

  useEffect(() => {
    if (vendorInfo != null) {
      const fetching = async () => {
        const { data } = await axios.get(`${API_ENDPOINT}/items/products/vendor/product/get/${match.params.id}`, {
          headers: authHeaderForVendor(),
        });
        setVendorEmail(data.vendorEmail);
        setTitle(data.title);
        setCategory(data.category);
        setDescription(data.description);
        setPicUrl(data.picURL);
        setPrice(data.price);
        
        // Extract discount percentage from discountNote or based on price/discountPrice
        if (data.discountNote && data.discountNote.includes("%")) {
          const discountValue = data.discountNote.match(/\d+/);
          setDiscount(discountValue ? discountValue[0] : "");
        } else if (data.price && data.discountPrice && data.price > data.discountPrice) {
          const calculatedDiscount = ((data.price - data.discountPrice) / data.price) * 100;
          setDiscount(calculatedDiscount.toFixed(0));
        } else {
          setDiscount("");
        }
        
        // Set new fields
        setPreparationTime(data.preparationTime || "");
        setAvailability(data.availability !== undefined ? data.availability : true);
        setCustomizations(data.customizations || "");
        
        // Set required fields for the model that we won't display
        setProductBrand(data.productBrand);
        setProductCode(data.productCode);
        setIngredients(data.ingredients);
        setUsage(data.usage);
        setWarnings(data.warnings);
        setDiscountNote(data.discountNote);
        setDiscountPrice(data.discountPrice);
        setQuantity(data.quantity);
      };

      fetching();
    }
  }, [match.params.id, vendorInfo]);

  const updateHandler = (e) => {
    e.preventDefault();
    
    if (!vendorEmail || !title || !category || !description || !picURL || !price || !preparationTime) {
      setMessage("Please fill all required fields");
      return;
    }
    
    // Calculate the discounted price if discount percentage is provided
    const actualPrice = parseFloat(price);
    const discountPercentage = parseFloat(discount) || 0;
    const calculatedDiscountPrice = calculateDiscountedPrice(actualPrice, discountPercentage);
    
    dispatch(
      updateProductByVendor(
        match.params.id,
        vendorEmail,
        title,
        category,
        productBrand || "Restaurant Brand",
        productCode || `MENU-${Date.now()}`,
        description,
        picURL,
        price,
        ingredients || customizations || "Not specified",
        usage || "Consume fresh",
        warnings || "No specific warnings",
        discountPercentage > 0 ? `${discountPercentage}% discount` : "No current discounts",
        calculatedDiscountPrice,
        quantity || 100,
        preparationTime,
        availability,
        customizations
      )
    );

    swal({
      title: "Success!",
      text: "Menu item updated successfully",
      icon: "success",
      timer: 2000,
      button: false,
    });
    
    setTimeout(() => {
      history.push("/vendor-products");
    }, 2000);
  };

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
            <h2 className="page-title"><FaUtensils className="title-icon" /> Edit Menu Item</h2>
            <div className="invisible" style={{ width: "100px" }}></div> {/* For alignment */}
          </div>

          <Card className="menu-item-card">
            <Card.Body>
              <div>
                {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
                {errorDelete && <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>}
                {message && <ErrorMessage variant="danger">{message}</ErrorMessage>}
                {loading && <Loading />}
                {loadingDelete && <Loading />}
              </div>

              <Row className="menu-item-container">
                <Col md={7} className="form-container">
                  <Form onSubmit={updateHandler}>
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
                        value={title}
                        placeholder="Enter menu item name"
                        onChange={(e) => setTitle(e.target.value)}
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
                        <Form.Group controlId="menuItemFormBasicDiscount" className="mb-3">
                          <Form.Label>Discount (%) <span className="text-info">Optional</span></Form.Label>
                          <Form.Control
                            type="number"
                            value={discount}
                            placeholder="Enter discount percentage"
                            onChange={(e) => setDiscount(e.target.value)}
                            min="0"
                            max="100"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
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
                      <Col md={6}>
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
                      </Col>
                    </Row>
                    
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
                          Change Image
                        </label>
                        <span className="file-name">
                          {picURL ? "Current image selected" : "No image selected"}
                        </span>
                      </div>
                    </Form.Group>
                    
                    <div className="button-container">
                      <Button
                        variant="success"
                        type="submit"
                        className="action-btn submit-btn"
                      >
                        <FaSave /> Update Menu Item
                      </Button>
                      
                      <Button
                        variant="danger"
                        onClick={() => deleteHandler(match.params.id)}
                        className="action-btn delete-btn"
                      >
                        <FaTrash /> Delete Item
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
                          alt={title || "Menu item preview"} 
                          className="item-preview-image" 
                        />
                      )}
                    </div>
                    <div className="preview-details">
                      {title && <h3 className="item-name">{title}</h3>}
                      {category && <span className="item-category">{category}</span>}
                      {price && (
                        <div className="item-price">
                          {discount ? (
                            <>
                              <span className="original-price">LKR {price}</span>
                              <span className="discounted-price">LKR {calculateDiscountedPrice(price, discount)}</span>
                              <span className="discount-badge">{discount}% OFF</span>
                            </>
                          ) : (
                            <>LKR {price}</>
                          )}
                        </div>
                      )}
                      {preparationTime && (
                        <div className="prep-time">
                          <small>Preparation time: {preparationTime} mins</small>
                        </div>
                      )}
                      {description && <p className="item-description">{description}</p>}
                      {customizations && (
                        <div className="customizations">
                          <small><strong>Customization options:</strong> {customizations}</small>
                        </div>
                      )}
                      <div className="availability-badge">
                        <span className={`badge ${availability ? "badge-available" : "badge-unavailable"}`}>
                          {availability ? "Available" : "Currently Unavailable"}
                        </span>
                      </div>
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

export default SingleProductForVendorScreen;

// import React, { useEffect, useState } from "react";
// import MainScreen from "../../../../components/MainScreen";
// import axios from "axios";
// import { Button, Card, Form, Col, Row } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import {
// 	authHeaderForVendor,
// 	deleteProductByVendor,
// 	updateProductByVendor,
// } from "../../../../actions/productManagementActions/productActions";
// import ErrorMessage from "../../../../components/ErrorMessage";
// import Loading from "../../../../components/Loading";
// import swal from "sweetalert";
// import "./singleProduct.css";
// import { API_ENDPOINT } from "../../../../config";

// function SingleProductForVendorScreen({ match, history }) {
// 	const [vendorEmail, setVendorEmail] = useState();
// 	const [title, setTitle] = useState();
// 	const [category, setCategory] = useState();
// 	const [productBrand, setProductBrand] = useState();
// 	const [productCode, setProductCode] = useState();
// 	const [description, setDescription] = useState();
// 	const [picURL, setPicUrl] = useState();
// 	const [price, setPrice] = useState();
// 	const [ingredients, setIngredients] = useState();
// 	const [usage, setUsage] = useState();
// 	const [warnings, setWarnings] = useState();
// 	const [discountNote, setDiscountNote] = useState();
// 	const [discountPrice, setDiscountPrice] = useState();
// 	const [quantity, setQuantity] = useState();
// 	const [picMessage, setPicMessage] = useState(null);

// 	const dispatch = useDispatch();

// 	const productUpdateByVendor = useSelector((state) => state.productUpdateByVendor);
// 	const { loading, error } = productUpdateByVendor;

// 	const productDeleteByVendor = useSelector((state) => state.productDeleteByVendor);
// 	const { loading: loadingDelete, error: errorDelete } = productDeleteByVendor;

// 	const vendor_Login = useSelector((state) => state.vendor_Login);
// 	const { vendorInfo } = vendor_Login;

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

// 	const deleteHandler = (id) => {
// 		swal({
// 			title: "Are you sure?",
// 			text: "Once deleted, you will not be able to recover these details!",
// 			icon: "warning",
// 			buttons: true,
// 			dangerMode: true,
// 		})
// 			.then((willDelete) => {
// 				if (willDelete) {
// 					dispatch(deleteProductByVendor(id));
// 					swal({
// 						title: "Success!",
// 						text: "Deleted Product Successfully",
// 						icon: "success",
// 						timer: 2000,
// 						button: false,
// 					});

// 					history.push("/vendor-products");
// 				}
// 			})
// 			.catch((err) => {
// 				swal({
// 					title: "Error!",
// 					text: "Couldn't Delete Note",
// 					type: "error",
// 				});
// 			});
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

// 	useEffect(() => {
// 		if (vendorInfo != null) {
// 			const fetching = async () => {
// 				const { data } = await axios.get(`${API_ENDPOINT}/items/products/vendor/product/get/${match.params.id}`, {
// 					headers: authHeaderForVendor(),
// 				});
// 				setVendorEmail(data.vendorEmail);
// 				setTitle(data.title);
// 				setCategory(data.category);
// 				setProductBrand(data.productBrand);
// 				setProductCode(data.productCode);
// 				setDescription(data.description);
// 				setPicUrl(data.picURL);
// 				setPrice(data.price);
// 				setIngredients(data.ingredients);
// 				setUsage(data.usage);
// 				setWarnings(data.warnings);
// 				setDiscountNote(data.discountNote);
// 				setDiscountPrice(data.discountPrice);
// 				setQuantity(data.quantity);
// 			};

// 			fetching();
// 		}
// 	}, [match.params.id, vendorInfo]);

// 	const updateHandler = (e) => {
// 		e.preventDefault();
// 		dispatch(
// 			updateProductByVendor(
// 				match.params.id,
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

// 		resetHandler();

// 		swal({
// 			title: "Success !!!",
// 			text: "Product Update Successful.",
// 			icon: "success",
// 			timer: 2000,
// 			button: false,
// 		});
// 		setTimeout(function () {
// 			window.location.href = "/vendor-products";
// 		}, 2000);
// 	};
// 	if (vendorInfo) {
// 		return (
// 			<div className="productEditBg">
// 				<br></br>
// 				<MainScreen title="Edit Your Product">
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
// 						Back to product List
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
// 								{loading && <Loading />}
// 							</div>
// 							<Row className="ProductContainer">
// 								<Col md={6}>
// 									<Form onSubmit={updateHandler}>
// 										{loadingDelete && <Loading />}
// 										{error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
// 										{errorDelete && <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>}
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
// 											Update Product
// 										</Button>
// 										&emsp;
// 										<Button
// 											variant="danger"
// 											onClick={deleteHandler}
// 											style={{
// 												fontSize: 15,
// 												marginTop: 10,
// 											}}
// 										>
// 											Delete Product
// 										</Button>
// 										&emsp;
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
// 							<br></br>
// 						</div>
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

// export default SingleProductForVendorScreen;