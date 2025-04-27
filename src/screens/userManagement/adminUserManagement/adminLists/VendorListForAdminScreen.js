import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import MainScreen from "../../../../components/MainScreen";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { vendorDeleteProfileById, vendorsList } from "../../../../actions/userManagementActions/vendorActions";
import Loading from "../../../../components/Loading";
import ErrorMessage from "../../../../components/ErrorMessage";
import swal from "sweetalert";
import "./userLists.css";

const VendorListForAdminScreen = () => {
	const dispatch = useDispatch();

	const vendorList = useSelector((state) => state.vendorList);
	const { loading, vendors, error } = vendorList;

	const admin_Login = useSelector((state) => state.admin_Login);
	const { adminInfo } = admin_Login;

	const vendorUpdate = useSelector((state) => state.vendorUpdate);
	const { success: successUpdate } = vendorUpdate;

	const vendorDeleteById = useSelector((state) => state.vendorDeleteById);
	const { loading: loadingDelete, error: errorDelete, success: successDelete } = vendorDeleteById;

	const history = useHistory();

	const [search, setSearch] = useState("");

	useEffect(() => {
		dispatch(vendorsList());
		if (!adminInfo) {
			history.push("/access-denied", { replace: true });
		}
	}, [dispatch, history, adminInfo, vendorDeleteById, successDelete, successUpdate]);

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
					dispatch(vendorDeleteProfileById(id));
					swal({
						title: "Success!",
						text: "Deleted Account Successfully",
						icon: "success",
						timer: 2000,
						button: false,
					});
				}
			})
			.catch((err) => {
				swal({
					title: "Error!",
					text: "Couldn't Delete Account",
					type: "error",
				});
			});
	};

	const viewDetails = (vendor) => {
		swal({
			title: "Vendor Details",
			content: {
				element: "div",
				attributes: {
					innerHTML: `
                        <img src="${vendor.pic}" class="profile-image" alt="${vendor.name}"/>
                        <div style="text-align: left; padding: 10px;">
                            <p><strong>Business Name:</strong> ${vendor.businessName}</p>
                            <p><strong>Owner Name:</strong> ${vendor.name}</p>
                            <p><strong>Email:</strong> ${vendor.email}</p>
                            <p><strong>Phone:</strong> ${vendor.telephone}</p>
                            <p><strong>Business Address:</strong> ${vendor.businessAddress}</p>
                            <p><strong>Home Address:</strong> ${vendor.homeAddress}</p>
                            <p><strong>Business Reg No:</strong> ${vendor.businessRegNumber}</p>
                            <p><strong>Website:</strong> ${vendor.website}</p>
                            <p><strong>Description:</strong> ${vendor.description}</p>
                            <p><strong>Registered:</strong> ${vendor.regDate}</p>
                        </div>
                    `,
				},
			},
			buttons: {
				close: {
					text: "Close",
					value: null,
					visible: true,
					className: "btn btn-secondary",
					closeModal: true,
				},
			},
		});
	};

	const searchHandler = (e) => {
		setSearch(e.target.value.toLowerCase());
	};

	if (adminInfo) {
		return (
			<div className="vendorList">
				<MainScreen>
					<div className="dashboard-container">
						<h1 className="dashboard-header">Welcome Back, {adminInfo?.name}</h1>
						
						<div className="d-flex justify-content-between align-items-center">
							<Button variant="success" href="/admin">
								Back to Dashboard
							</Button>
							<div className="search-container">
								<input
									type="text"
									placeholder="Search vendors..."
									className="search-box"
									onChange={searchHandler}
								/>
							</div>
						</div>

						{error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
						{errorDelete && <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>}
						{loading && <Loading />}

						<div className="dashboard-table">
							<Table hover responsive>
								<thead className="table-header">
									<tr>
										<th>Business Name</th>
										<th>Owner Name</th>
										<th>Email</th>
										<th>Phone</th>
										<th>Business Address</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{vendors?.filter(vendor => 
										vendor.businessName.toLowerCase().includes(search.toLowerCase()) ||
										vendor.email.includes(search)
									).map((vendor) => (
										<tr key={vendor._id} className="table-row">
											<td>{vendor.businessName}</td>
											<td>{vendor.name}</td>
											<td>{vendor.email}</td>
											<td>{vendor.telephone}</td>
											<td>{vendor.businessAddress}</td>
											<td>
												<div className="action-buttons">
													<Button
														className="btn-view"
														onClick={() => viewDetails(vendor)}
													>
														View
													</Button>
													<Button
														className="btn-edit"
														href={`/admin-vendor-edit/${vendor._id}`}
													>
														Edit
													</Button>
													<Button
														className="btn-delete"
														onClick={() => deleteHandler(vendor._id)}
													>
														Delete
													</Button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</div>
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

export default VendorListForAdminScreen;
