import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderStatusAction } from "../../actions/orderManagementActions/orderAction";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import MainScreen from "../../components/MainScreen";

export default function AdminUpdateOrder({ match, history }) {
	const [status, setStatus] = useState("");

	const dispatch = useDispatch();
	const admin_Login = useSelector((state) => state.admin_Login);
	const { adminInfo } = admin_Login;

	const orderUpdateStatus = useSelector((state) => state.orderUpdateStatus);
	const { loading, error } = orderUpdateStatus;

	const updateHandler = (e) => {
		e.preventDefault();
		dispatch(updateOrderStatusAction(match.params.id, status));
	};
	if (adminInfo) {
		return (
			<div
				className="adminUpdate"
				style={{
					minHeight: 200,
				}}
			>
				<br></br>
				<br></br>
				<MainScreen title="">
					<br></br>
					<br></br>
					<br></br>
					<h1 style={{ fontWeight: "400", fontSize: "50px" }}>UPDATE ORDER STATUS</h1>
					<br></br>

					<Button
						variant="success"
						style={{
							float: "left",
							marginTop: 5,
							fontSize: 15,
						}}
						href="/admin-orders"
					>
						{" "}
						Back To Order List
					</Button>
					<br></br>
					<br></br>
					<br></br>
					<br></br>

					<Card
						style={{
							width: "60%",
							borderWidth: 0,
							outline: "none",
							marginLeft: 150,
							background: "rgba(28, 96, 15, 0.1)",
							borderRadius: 0,
							borderRadius: "15px",
							boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
						}}
					>
						<Card.Body>
							<br></br>
							<Form onSubmit={updateHandler}>
								{error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
								<Form.Group controlId="reply">
									<Form.Label
										style={{
											fontSize: "1.25rem",
											color: "black",
											fontWeight: "bold",
											marginBottom: "0.5rem",
										}}
									>
										Status
									</Form.Label>

									<div style={{ position: "relative" }}>
										<select
											style={{
												height: "40px",
												width: "100%",
												borderRadius: "8px",
												border: "1px solid #ccc",
												padding: "0 40px 0 12px",
												fontSize: "1rem",
												color: "#333",
												backgroundColor: "#f8f9fa",
												boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
												outline: "none",
												appearance: "none",
												backgroundImage:
													'url(\'data:image/svg+xml;charset=UTF-8,<svg fill="%23666" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>\')',
												backgroundRepeat: "no-repeat",
												backgroundPosition: "right 10px center",
												backgroundSize: "24px 24px",
												cursor: "pointer",
											}}
											onChange={(e) => setStatus(e.target.value)}
										>
											<option value="pending">Pending</option>
											<option value="confirm">Confirm</option>
										</select>
									</div>
								</Form.Group>

								{loading && <Loading size={50} />}
								<div style={{ display: "flex", justifyContent: "center" }}>
									<Button
										style={{
											fontSize: "1rem",
											fontWeight: "bold",
											marginTop: "20px",
											padding: "10px 30px",
											backgroundColor: "#28a745", 
											borderColor: "#28a745",
											color: "white", 
											borderRadius: "50px",
											boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)", 
											outline: "none",
										}}
										type="submit"
									>
										Submit
									</Button>
								</div>
							</Form>
						</Card.Body>
						<br></br>
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
