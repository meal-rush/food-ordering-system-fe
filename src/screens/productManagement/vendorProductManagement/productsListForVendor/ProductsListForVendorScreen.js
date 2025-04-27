import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col, Form, Table, Dropdown, Badge, Pagination } from "react-bootstrap";
import MainScreen from "../../../../components/MainScreen";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProductByVendor,
  productsListForVendor,
} from "../../../../actions/productManagementActions/productActions";
import Loading from "../../../../components/Loading";
import ErrorMessage from "../../../../components/ErrorMessage";
import swal from "sweetalert";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSort, FaEye, FaArrowLeft, FaClock } from "react-icons/fa";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import "./productLists.css";

const ProductsListForVendorScreen = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const vendorProductList = useSelector((state) => state.vendorProductList);
  const { loading, products, error } = vendorProductList;

  const vendor_Login = useSelector((state) => state.vendor_Login);
  const { vendorInfo } = vendor_Login;

  const productCreate = useSelector((state) => state.productCreate);
  const { success: successCreate } = productCreate;

  const productUpdateByVendor = useSelector((state) => state.productUpdateByVendor);
  const { success: successUpdate } = productUpdateByVendor;

  const productDeleteByVendor = useSelector((state) => state.productDeleteByVendor);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDeleteByVendor;

  // State variables
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Delete handler with confirmation
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
        }
      })
      .catch((err) => {
        swal({
          title: "Error!",
          text: "Couldn't delete menu item",
          type: "error",
        });
      });
  };

  // Search handler
  const searchHandler = (e) => {
    setSearch(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page on new search
  };

  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Handle product details view
  const toggleProductDetails = (id) => {
    if (expandedProduct === id) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(id);
    }
  };

  // Get all unique categories
  const getUniqueCategories = () => {
    if (!products) return ["All"];
    const categories = products.map(product => product.category);
    return ["All", ...new Set(categories)];
  };

  // Filter products by category and search term
  const filterProducts = () => {
    if (!products) return [];
    
    return products.filter(product => {
      const matchesSearch = 
        product.title.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search);
      
      const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  };

  // Sort products
  const sortProducts = (products) => {
    return [...products].sort((a, b) => {
      if (sortField === "price" || sortField === "preparationTime") {
        return sortOrder === "asc" 
          ? Number(a[sortField]) - Number(b[sortField])
          : Number(b[sortField]) - Number(a[sortField]);
      } else {
        return sortOrder === "asc"
          ? a[sortField]?.toString().localeCompare(b[sortField]?.toString())
          : b[sortField]?.toString().localeCompare(a[sortField]?.toString());
      }
    });
  };

  const filteredProducts = filterProducts();
  const sortedProducts = sortProducts(filteredProducts);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Get current products
  const currentProducts = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Generate pagination items
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <Pagination.Item key={i} active={i === currentPage} onClick={() => paginate(i)}>
        {i}
      </Pagination.Item>
    );
  }

  useEffect(() => {
    dispatch(productsListForVendor());
    if (!vendorInfo) {
      history.push("/access-denied");
    }
  }, [dispatch, successCreate, history, vendorInfo, successUpdate, successDelete]);

  // Get availability badge based on availability boolean
  const getAvailabilityBadge = (availability) => {
    return availability ? 
      <Badge bg="success">Available</Badge> : 
      <Badge bg="danger">Out of Stock</Badge>;
  };

  // Format price
  const formatPrice = (price) => {
    return <span>LKR {price}</span>;
  };

  if (vendorInfo) {
    return (
      <div className="menu-management-page">
        <MainScreen title="">
          {/* Header Section - Centered Menu Management Title */}
          <div className="page-header d-flex flex-column align-items-center mb-4 text-center">
            <h2 className="menu-title mb-3">
              <MdOutlineRestaurantMenu className="me-2" />
              Menu Management
            </h2>
            <div className="d-flex justify-content-between w-100">
              <Button
                variant="outline-primary"
                className="back-button"
                onClick={() => history.push("/vendor")}
              >
                <FaArrowLeft /> Back to Dashboard
              </Button>
              <Button 
                variant="success" 
                className="add-menu-btn"
                onClick={() => history.push("/vendor-product-add")}
              >
                <FaPlus className="me-1" /> Add Menu Item
              </Button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <Card className="filter-card mb-4">
            <Card.Body>
              <Row className="align-items-center">
                <Col lg={5} md={6} sm={12}>
                  <div className="search-box">
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaSearch />
                      </span>
                      <Form.Control
                        type="text"
                        placeholder="Search by name or category..."
                        value={search}
                        onChange={searchHandler}
                        className="search-input"
                      />
                    </div>
                  </div>
                </Col>
                <Col lg={4} md={6} sm={6} className="mt-3 mt-lg-0">
                  <Form.Group>
                    <Form.Control
                      as="select"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="category-filter"
                    >
                      {getUniqueCategories().map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col lg={3} md={6} sm={6} className="mt-3 mt-lg-0">
                  <Dropdown>
                    <Dropdown.Toggle 
                      variant="primary" 
                      id="dropdown-sort" 
                      className="sort-dropdown w-100"
                    >
                      <FaSort className="me-1" /> Sort By: {sortField === "title" ? "Name" : 
                                                          sortField === "preparationTime" ? "Prep Time" : 
                                                          sortField.charAt(0).toUpperCase() + sortField.slice(1)}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleSort("title")}>Name</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleSort("category")}>Category</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleSort("price")}>Price</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleSort("preparationTime")}>Preparation Time</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleSort("createdAt")}>Date Added</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Error and Loading Messages */}
          {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
          {errorDelete && <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>}
          {loading && <Loading />}
          {loadingDelete && <Loading />}

          {/* Results Summary */}
          <div className="results-summary mb-3">
            <p>
              Showing {filteredProducts.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, filteredProducts.length)} of{" "}
              {filteredProducts.length} item{filteredProducts.length !== 1 ? "s" : ""}
              {search && (
                <span className="ms-2">
                  matching "<strong>{search}</strong>"
                </span>
              )}
              {categoryFilter !== "All" && (
                <span className="ms-2">
                  in category "<strong>{categoryFilter}</strong>"
                </span>
              )}
            </p>
          </div>

          {/* Table View */}
          <div className="table-responsive menu-table-container">
            <Table hover className="menu-table">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>Image</th>
                  <th className="sortable" onClick={() => handleSort("title")}>
                    Name {sortField === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="sortable" onClick={() => handleSort("category")}>
                    Category {sortField === "category" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="sortable" onClick={() => handleSort("price")}>
                    Price {sortField === "price" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="sortable" onClick={() => handleSort("preparationTime")}>
                    Prep Time {sortField === "preparationTime" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th>Availability</th>
                  <th style={{ width: "130px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <React.Fragment key={product._id}>
                      <tr className={expandedProduct === product._id ? "expanded-row" : ""}>
                        <td>
                          <img
                            src={product.picURL}
                            alt={product.title}
                            className="menu-item-thumbnail"
                          />
                        </td>
                        <td>{product.title}</td>
                        <td>{product.category}</td>
                        <td>{formatPrice(product.price)}</td>
                        <td>{product.preparationTime} mins</td>
                        <td>{getAvailabilityBadge(product.availability)}</td>
                        <td>
                          <div className="d-flex">
                            <Button
                              variant="outline-info"
                              size="sm"
                              className="me-1"
                              onClick={() => toggleProductDetails(product._id)}
                            >
                              <FaEye />
                            </Button>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-1"
                              onClick={() => history.push(`/vendor-product-edit/${product._id}`)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => deleteHandler(product._id)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {expandedProduct === product._id && (
                        <tr className="details-row">
                          <td colSpan="7">
                            <div className="product-details-expanded">
                              <Row>
                                <Col md={3}>
                                  <div className="product-image-container">
                                    <img
                                      src={product.picURL}
                                      alt={product.title}
                                      className="product-image-large"
                                    />
                                  </div>
                                </Col>
                                <Col md={9}>
                                  <Row>
                                    <Col md={6}>
                                      <div className="detail-item">
                                        <span className="detail-label">Item Name:</span> {product.title}
                                      </div>
                                      <div className="detail-item">
                                        <span className="detail-label">Category:</span> {product.category}
                                      </div>
                                      <div className="detail-item">
                                        <span className="detail-label">Price:</span> LKR {product.price}
                                      </div>
                                      <div className="detail-item">
                                        <span className="detail-label">Preparation Time:</span> {product.preparationTime} minutes
                                      </div>
                                    </Col>
                                    <Col md={6}>  
                                      <div className="detail-item">
                                        <span className="detail-label">Availability:</span> {product.availability ? "In Stock" : "Out of Stock"}
                                      </div>
                                      <div className="detail-item">
                                        <span className="detail-label">Customizations:</span> {product.customizations || "None"}
                                      </div>
                                      <div className="detail-item">
                                        <span className="detail-label">Added On:</span> {new Date(product.createdAt).toLocaleDateString()}
                                      </div>
                                    </Col>
                                  </Row>
                                  <div className="detail-item mt-2">
                                    <span className="detail-label">Description:</span>
                                    <p className="mb-0">{product.description}</p>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      {search || categoryFilter !== "All" ? "No items match your search" : "No menu items found. Add your first item!"}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredProducts.length > itemsPerPage && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                {paginationItems}
                <Pagination.Next
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
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

export default ProductsListForVendorScreen;

// import React, { useEffect, useState } from "react";
// import { Button, Card, Row, Col, Form } from "react-bootstrap";
// import {
// 	Accordion,
// 	AccordionItem,
// 	AccordionItemHeading,
// 	AccordionItemButton,
// 	AccordionItemPanel,
// } from "react-accessible-accordion";
// import MainScreen from "../../../../components/MainScreen";
// import { useHistory } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
// 	deleteProductByVendor,
// 	productsListForVendor,
// } from "../../../../actions/productManagementActions/productActions";
// import Loading from "../../../../components/Loading";
// import ErrorMessage from "../../../../components/ErrorMessage";
// import swal from "sweetalert";
// import "./productLists.css";

// const ProductsListForVendorScreen = () => {
// 	const dispatch = useDispatch();

// 	const vendorProductList = useSelector((state) => state.vendorProductList);
// 	const { loading, products, error } = vendorProductList;

// 	const vendor_Login = useSelector((state) => state.vendor_Login);
// 	const { vendorInfo } = vendor_Login;

// 	const productCreate = useSelector((state) => state.productCreate);
// 	const { success: successCreate } = productCreate;

// 	const productUpdateByVendor = useSelector((state) => state.productUpdateByVendor);
// 	const { success: successUpdate } = productUpdateByVendor; //taking out products update state from redux

// 	console.log(vendorProductList);

// 	const [search, setSearch] = useState("");

// 	const productDeleteByVendor = useSelector((state) => state.productDeleteByVendor);
// 	const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDeleteByVendor;

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
// 				}
// 			})
// 			.catch((err) => {
// 				swal({
// 					title: "Error!",
// 					text: "Couldn't Delete Product",
// 					type: "error",
// 				});
// 			});
// 	};
// 	const searchHandler = (e) => {
// 		setSearch(e.target.value.toLowerCase());
// 	};

// 	const history = useHistory();

// 	useEffect(() => {
// 		dispatch(productsListForVendor());
// 		if (!vendorInfo) {
// 			history.push("/access-denied");
// 		}
// 	}, [dispatch, successCreate, history, vendorInfo, successUpdate, successDelete]);
// 	if (vendorInfo) {
// 		return (
// 			<div className="vendorProductList">
// 				<br></br>
// 				<MainScreen title={`Welcome Back ${vendorInfo && vendorInfo.name}..`}>
// 					<Row>
// 						<Col>
// 							<h1
// 								style={{
// 									display: "flex",
// 									marginLeft: "10px",
// 									width: "500px",
// 									color: "azure",
// 									fontStyle: "italic",
// 								}}
// 							>
// 								Products List
// 							</h1>
// 						</Col>
// 						<Col>
// 							<div className="search" style={{ marginTop: 5, marginLeft: 150 }}>
// 								<Form>
// 									<input
// 										type="text"
// 										placeholder="Search..."
// 										style={{
// 											width: 400,
// 											height: 40,
// 											borderRadius: 50,
// 											padding: "10px",
// 											paddingLeft: "15px",
// 											fontSize: 18,
// 										}}
// 										onChange={searchHandler}
// 									/>
// 								</Form>
// 							</div>
// 						</Col>
// 					</Row>
// 					<br></br>

// 					<Button variant="success" href="/admin" style={{ float: "left", fontSize: "15px" }}>
// 						Back to Dashboard
// 					</Button>

// 					<Button variant="success" href="/vendor-product-add" style={{ float: "right", fontSize: "15px" }}>
// 						+ Add New Product
// 					</Button>

// 					<br></br>
// 					{error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
// 					{errorDelete && <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>}
// 					{loading && <Loading />}
// 					{loadingDelete && <Loading />}
// 					<br></br>
// 					<div className="listContainer">
// 						<Accordion allowZeroExpanded>
// 							{products &&
// 								products
// 									.filter(
// 										(filteredProducts) =>
// 											filteredProducts.title.toLowerCase().includes(search.toLowerCase()) ||
// 											filteredProducts.productBrand.includes(search.toLowerCase)
// 									)
// 									.reverse()
// 									.map((vendorProductList) => (
// 										<AccordionItem key={vendorProductList._id} className="listContainer">
// 											<Card
// 												style={{
// 													margin: 10,
// 													borderRadius: 25,
// 													borderWidth: 1.0,
// 													borderColor: "rgb(0,0,0,0.5)",
// 													marginTop: 20,
// 													paddingInline: 10,
// 													background: "rgb(235, 235, 235)",
// 												}}
// 											>
// 												<AccordionItemHeading>
// 													<AccordionItemButton>
// 														<Card.Header
// 															style={{
// 																display: "flex",
// 																paddingInline: 10,
// 																borderRadius: 25,
// 																marginTop: 10,
// 																marginBottom: 10,
// 																borderColor: "black",
// 																background: "#76BA99",
// 															}}
// 														>
// 															<span
// 																style={{
// 																	color: "black",
// 																	textDecoration: "none",
// 																	flex: 1,
// 																	cursor: "pointer",
// 																	alignSelf: "center",
// 																	fontSize: 18,
// 																}}
// 															>
// 																<label
// 																	className="nic"
// 																	style={{
// 																		paddingInline: 20,
// 																		marginTop: 10,
// 																		fontSize: 18,
// 																	}}
// 																>
// 																	Product Name : &emsp;
// 																	{vendorProductList.title}{" "}
// 																</label>{" "}
// 																<br></br>
// 																<label className="name" style={{ paddingInline: 20, fontSize: 18 }}>
// 																	Product Brand : &emsp;
// 																	{vendorProductList.productBrand}
// 																</label>{" "}
// 															</span>
// 															<div>
// 																<Button
// 																	style={{ marginTop: 20, fontSize: 15 }}
// 																	href={`/vendor-product-edit/${vendorProductList._id}`}
// 																>
// 																	Edit
// 																</Button>
// 															</div>
// 															&emsp;
// 															<div>
// 																<Button
// 																	style={{ marginTop: 20, fontSize: 15 }}
// 																	variant="danger"
// 																	className="mx-2"
// 																	onClick={() => deleteHandler(vendorProductList._id)}
// 																>
// 																	Delete
// 																</Button>
// 															</div>
// 														</Card.Header>
// 													</AccordionItemButton>
// 												</AccordionItemHeading>
// 												<AccordionItemPanel>
// 													<Card.Body>
// 														<Row>
// 															<Col md={6}>
// 																<h5>Product Name - {vendorProductList.title}</h5>
// 																<h5>Product Category - {vendorProductList.category}</h5>
// 																<h5>Product Brand - {vendorProductList.productBrand}</h5>
// 																<h5>Product Code - {vendorProductList.productCode}</h5>
// 																<h5>Description - {vendorProductList.description}</h5>
// 																<h5>Price - {vendorProductList.price}</h5>
// 																<h5>Product Ingredients - {vendorProductList.ingredients}</h5>
// 																<h5>Usage - {vendorProductList.usage}</h5>
// 																<h5>Warnings - {vendorProductList.warnings}</h5>
// 																<h5>Discount Note - {vendorProductList.discountNote}</h5>
// 																<h5>Discount Price - {vendorProductList.discountPrice}</h5>
// 																<h5>Quantity - {vendorProductList.quantity}</h5>
// 																<br></br>
// 															</Col>
// 															<Col
// 																style={{
// 																	display: "flex",
// 																	alignItems: "center",
// 																	width: "500px",
// 																	justifyContent: "center",
// 																}}
// 															>
// 																<img
// 																	style={{
// 																		width: "50%",
// 																		height: "70%",
// 																	}}
// 																	src={vendorProductList.picURL}
// 																	alt={vendorProductList.title}
// 																	className="profilePic"
// 																/>
// 															</Col>
// 														</Row>
// 														<br></br>
// 														<blockquote className="blockquote mb-0">
// 															<Card.Footer
// 																className="text-muted"
// 																style={{
// 																	borderRadius: 20,
// 																	background: "white",
// 																}}
// 															/>
// 														</blockquote>
// 													</Card.Body>
// 												</AccordionItemPanel>
// 											</Card>
// 										</AccordionItem>
// 									))}
// 						</Accordion>
// 					</div>

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
// };

// export default ProductsListForVendorScreen;