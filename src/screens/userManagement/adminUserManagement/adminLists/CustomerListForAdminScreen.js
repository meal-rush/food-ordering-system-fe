import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col, Form, Table } from "react-bootstrap";
import MainScreen from "../../../../components/MainScreen";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { customerDeleteProfileById, customersList } from "../../../../actions/userManagementActions/customerActions";
import Loading from "../../../../components/Loading";
import ErrorMessage from "../../../../components/ErrorMessage";
import swal from "sweetalert";
import "./userLists.css";

const CustomerListForAdminScreen = () => {
	const dispatch = useDispatch();

	const customerList = useSelector((state) => state.customerList);
	const { loading, customers, error } = customerList;

	const admin_Login = useSelector((state) => state.admin_Login);
	const { adminInfo } = admin_Login;

	const customerUpdate = useSelector((state) => state.customerUpdate);
	const { success: successUpdate } = customerUpdate;

	const customerDeleteById = useSelector((state) => state.customerDeleteById);
	const { loading: loadingDelete, error: errorDelete, success: successDelete } = customerDeleteById;

	const history = useHistory();

	const [search, setSearch] = useState("");

	useEffect(() => {
		dispatch(customersList());
		if (!adminInfo) {
			history.push("/access-denied", { replace: true });
		}
	}, [dispatch, history, adminInfo, customerDeleteById, successDelete, successUpdate]);

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
					dispatch(customerDeleteProfileById(id));
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

	const viewDetails = (customer) => {
		swal({
			title: "Customer Details",
			content: {
				element: "div",
				attributes: {
					innerHTML: `
                        <img src="${customer.pic}" class="profile-image" alt="${customer.name}"/>
                        <div style="text-align: left; padding: 10px;">
                            <p><strong>Name:</strong> ${customer.name}</p>
                            <p><strong>Email:</strong> ${customer.email}</p>
                            <p><strong>Phone:</strong> ${customer.telephone}</p>
                            <p><strong>Address:</strong> ${customer.address}</p>
                            <p><strong>Registered:</strong> ${customer.regDate}</p>
                        </div>
                    `
				}
			},
			buttons: {
				close: {
					text: "Close",
					value: null,
					visible: true,
					className: "btn btn-secondary",
					closeModal: true,
				}
			}
		});
	};

	const searchHandler = (e) => {
		setSearch(e.target.value.toLowerCase());
	};

	if (adminInfo) {
		return (
			<div className="customerList">
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
									placeholder="Search customers..."
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
										<th>Name</th>
										<th>Email</th>
										<th>Phone</th>
										<th>Address</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{customers?.filter(customer => 
										customer.name.toLowerCase().includes(search.toLowerCase()) ||
										customer.email.includes(search)
									).map((customer) => (
										<tr key={customer._id} className="table-row">
											<td>{customer.name}</td>
											<td>{customer.email}</td>
											<td>{customer.telephone}</td>
											<td>{customer.address}</td>
											<td>
												<div className="action-buttons">
													<Button
														className="btn-view"
														onClick={() => viewDetails(customer)}
													>
														View
													</Button>
													<Button
														className="btn-edit"
														href={`/admin-customer-edit/${customer._id}`}
													>
														Edit
													</Button>
													<Button
														className="btn-delete"
														onClick={() => deleteHandler(customer._id)}
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

export default CustomerListForAdminScreen;
