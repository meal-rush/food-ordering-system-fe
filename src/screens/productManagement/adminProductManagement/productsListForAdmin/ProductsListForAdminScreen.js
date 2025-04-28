import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import MainScreen from "../../../../components/MainScreen";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	deleteProductByAdmin,
	productsListForAdmin,
} from "../../../../actions/productManagementActions/productActions";
import Loading from "../../../../components/Loading";
import ErrorMessage from "../../../../components/ErrorMessage";
import swal from "sweetalert";
import "./productLists.css";

const ProductsListForAdminScreen = () => {
	const dispatch = useDispatch();

	const adminProductList = useSelector((state) => state.adminProductList);
	const { loading, products, error } = adminProductList;

	const admin_Login = useSelector((state) => state.admin_Login);
	const { adminInfo } = admin_Login;

	const productCreate = useSelector((state) => state.productCreate);
	const { success: successCreate } = productCreate;

	const productUpdateByAdmin = useSelector((state) => state.productUpdateByAdmin);
	const { success: successUpdate } = productUpdateByAdmin;

	const [search, setSearch] = useState("");
	const [filterVendor, setFilterVendor] = useState("all");
	const [filterCategory, setFilterCategory] = useState("all");
	const [filterBrand, setFilterBrand] = useState("all");

	const productDeleteByAdmin = useSelector((state) => state.productDeleteByAdmin);
	const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDeleteByAdmin;

	const [showModal, setShowModal] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);

	const deleteHandler = (id) => {
		swal({
			title: "Are you sure?",
			text: "Once deleted, you will not be able to recover these details!",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		})
			.then((willDelete) => {
				if (willDelete) {
					dispatch(deleteProductByAdmin(id));
					swal({
						title: "Success!",
						text: "Deleted Product Successfully",
						icon: "success",
						timer: 2000,
						button: false,
					});
				}
			})
			.catch((err) => {
				swal({
					title: "Error!",
					text: "Couldn't Delete Product",
					type: "error",
				});
			});
	};

	const searchHandler = (e) => {
		setSearch(e.target.value.toLowerCase());
	};

	const handleView = (product) => {
		setSelectedProduct(product);
		setShowModal(true);
	};

	const getUniqueValues = (data, key) => {
		if (!data) return [];
		return [...new Set(data.map((item) => item[key]))];
	};

	const getStats = (products) => {
		if (!products) return { totalProducts: 0, totalVendors: 0, totalCategories: 0, totalBrands: 0 };
		return {
			totalProducts: products.length,
			totalVendors: new Set(products.map(p => p.vendorEmail)).size,
			totalCategories: new Set(products.map(p => p.category)).size,
			totalBrands: new Set(products.map(p => p.productBrand)).size
		};
	};

	const filteredProducts = products?.filter((product) => {
		const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase());
		const matchesVendor = filterVendor === "all" || product.vendorEmail === filterVendor;
		const matchesCategory = filterCategory === "all" || product.category === filterCategory;
		const matchesBrand = filterBrand === "all" || product.productBrand === filterBrand;

		return matchesSearch && matchesVendor && matchesCategory && matchesBrand;
	});

	const history = useHistory();

	useEffect(() => {
		dispatch(productsListForAdmin());
		if (!adminInfo) {
			history.push("/access-denied");
		}
	}, [dispatch, successCreate, history, adminInfo, successUpdate, successDelete]);

	if (adminInfo) {
		return (
			<div className="dashboard-wrapper">
				<MainScreen>
					<div className="dashboard-header">
						<div className="header-content">
							<h1 className="dashboard-title">
								Products Dashboard
								<small className="dashboard-subtitle">
									Welcome back, {adminInfo?.name}
								</small>
							</h1>
							<Button variant="dark" href="/admin">Back to Dashboard</Button>
						</div>

						{/* Stats Cards */}
						{products && (
							<div className="stats-grid">
								{Object.entries(getStats(products)).map(([key, value]) => (
									<div key={key} className="stat-card">
										<div className="stat-value">{value}</div>
										<div className="stat-label">{key.replace('total', '')}</div>
									</div>
								))}
							</div>
						)}
					</div>

					<div className="admin-card">
						{/* Modern Filter Section */}
						<div className="filter-header">
							<div className="filter-title">Filter Products</div>
							<div className="filter-actions">
								<div className="filter-group">
									<select
										className="filter-select"
										value={filterVendor}
										onChange={(e) => setFilterVendor(e.target.value)}
									>
										<option value="all">All Vendors</option>
										{getUniqueValues(products, "vendorEmail").map((vendor) => (
											<option key={vendor} value={vendor}>
												{vendor}
											</option>
										))}
									</select>

									<select
										className="filter-select"
										value={filterCategory}
										onChange={(e) => setFilterCategory(e.target.value)}
									>
										<option value="all">All Categories</option>
										{getUniqueValues(products, "category").map((category) => (
											<option key={category} value={category}>
												{category}
											</option>
										))}
									</select>

									<select
										className="filter-select"
										value={filterBrand}
										onChange={(e) => setFilterBrand(e.target.value)}
									>
										<option value="all">All Brands</option>
										{getUniqueValues(products, "productBrand").map((brand) => (
											<option key={brand} value={brand}>
												{brand}
											</option>
										))}
									</select>
								</div>
								<div className="search-container">
									<i className="fas fa-search search-icon"></i>
									<input
										type="text"
										placeholder="Search products..."
										className="search-input"
										onChange={searchHandler}
									/>
								</div>
							</div>
						</div>

						{/* Enhanced Table */}
						<div className="table-container">
							<table className="admin-table">
								<thead>
									<tr>
										<th>Image</th>
										<th>Product Details</th>
										<th>Vendor</th>
										<th>Category & Brand</th>
										<th>Price Info</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{filteredProducts?.map((product) => (
										<tr key={product._id}>
											<td>
												<div className="product-image-container">
													<img
														src={product.picURL}
														alt={product.title}
														className="table-image"
													/>
												</div>
											</td>
											<td>
												<div className="product-info">
													<div className="product-name">{product.title}</div>
													<div className="product-code">{product.productCode}</div>
												</div>
											</td>
											<td>
												<div className="vendor-info">
													<span className="vendor-email">{product.vendorEmail}</span>
												</div>
											</td>
											<td>
												<div className="category-brand-info">
													<span className="category-badge">{product.category}</span>
													<span className="brand-name">{product.productBrand}</span>
												</div>
											</td>
											<td>
												<div className="price-info">
													<div className="main-price">Rs. {product.price}</div>
													{product.discountPrice && (
														<div className="discount-price">Rs. {product.discountPrice}</div>
													)}
												</div>
											</td>
											<td>
												<div className="action-buttons">
													<Button
														size="sm"
														variant="outline-dark"
														className="btn-action"
														onClick={() => handleView(product)}
													>
														View
													</Button>
													<Button
														size="sm"
														variant="success"
														className="btn-action"
														href={`/admin-product-edit/${product._id}`}
													>
														Edit
													</Button>
													<Button
														size="sm"
														variant="outline-danger"
														className="btn-action"
														onClick={() => deleteHandler(product._id)}
													>
														Delete
													</Button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					<Modal 
						show={showModal} 
						onHide={() => setShowModal(false)}
						size="lg"
						centered
					>
						<Modal.Header closeButton>
							<Modal.Title style={{ color: '#000' }}>Product Details</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{selectedProduct && (
								<div className="product-details">
									<div className="d-flex justify-content-center mb-4">
										<img
											src={selectedProduct.picURL}
											alt={selectedProduct.title}
											style={{
												width: "200px",
												height: "200px",
												borderRadius: "10px",
												objectFit: "cover"
											}}
										/>
									</div>
									<div className="row">
										<div className="col-md-6">
											<h5>Basic Information</h5>
											<p><strong>Name:</strong> {selectedProduct.title}</p>
											<p><strong>Brand:</strong> {selectedProduct.productBrand}</p>
											<p><strong>Category:</strong> {selectedProduct.category}</p>
											<p><strong>Code:</strong> {selectedProduct.productCode}</p>
											<p><strong>Price:</strong> ${selectedProduct.price}</p>
											<p><strong>Discount Price:</strong> ${selectedProduct.discountPrice}</p>
											<p><strong>Quantity:</strong> {selectedProduct.quantity}</p>
										</div>
										<div className="col-md-6">
											<h5>Additional Details</h5>
											<p><strong>Vendor:</strong> {selectedProduct.vendorEmail}</p>
											<p><strong>Description:</strong> {selectedProduct.description}</p>
											<p><strong>Ingredients:</strong> {selectedProduct.ingredients}</p>
											<p><strong>Usage:</strong> {selectedProduct.usage}</p>
											<p><strong>Warnings:</strong> {selectedProduct.warnings}</p>
											<p><strong>Discount Note:</strong> {selectedProduct.discountNote}</p>
										</div>
									</div>
								</div>
							)}
						</Modal.Body>
					</Modal>
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

export default ProductsListForAdminScreen;
