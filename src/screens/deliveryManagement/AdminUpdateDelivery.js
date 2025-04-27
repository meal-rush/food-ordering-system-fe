import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateDeliveryStatusAction } from "../../actions/deliveryManagementActions/deliveriesAction";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import MainScreen from "../../components/MainScreen";

export default function AdminUpdateDelivery({ match, history }) {
	const [status, setStatus] = useState("");

	const dispatch = useDispatch();
	const admin_Login = useSelector((state) => state.admin_Login);
	const { adminInfo } = admin_Login;

	const deliveryUpdateStatus = useSelector((state) => state.deliveryUpdateStatus);
	const { loading, error } = deliveryUpdateStatus;

	const updateHandler = (e) => {
		e.preventDefault();
		dispatch(updateDeliveryStatusAction(match.params.id, status));
	};

	if (adminInfo) {
		return (
			<div className="admin-update-page">
				<MainScreen title={<span style={{ color: '#000000' }}>Update Delivery Status</span>}>
					<Button
						variant="primary"
						href="/admin-deliveries"
						className="back-button"
					>
						← Back to Deliveries
					</Button>

					<Card className="update-status-card">
						<Card.Body>
							<Form onSubmit={updateHandler}>
								{error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
								
								<Form.Group className="status-group">
									<Form.Label className="status-label">Update Status</Form.Label>
									<Form.Select 
										onChange={(e) => setStatus(e.target.value)}
										className="status-select"
									>
										<option value="Processing">Processing</option>
										<option value="Dispatched">Dispatched</option>
										<option value="Delivered">Delivered</option>
									</Form.Select>
								</Form.Group>

								{loading && <Loading size={50} />}
								
								<Button type="submit" className="update-btn">
									Update Status
								</Button>
							</Form>
						</Card.Body>
					</Card>
				</MainScreen>
				<style jsx>{`
					.admin-update-page {
						background: linear-gradient(to bottom right, #f8f9fa, #e9ecef);
						min-height: 100vh;
						padding: 30px;
					}
					.back-button {
						margin-bottom: 25px;
						background: #0a5c6d;
						border: none;
						padding: 12px 24px;
						border-radius: 10px;
						font-weight: 500;
						transition: all 0.3s ease;
					}
					.back-button:hover {
						background: #088395;
						transform: translateY(-2px);
						box-shadow: 0 4px 8px rgba(8,131,149,0.2);
					}
					.update-status-card {
						max-width: 550px;
						margin: 0 auto;
						border-radius: 20px;
						border: none;
						box-shadow: 0 8px 16px rgba(0,0,0,0.1);
						background: #ffffff;
						padding: 10px;
					}
					.status-group {
						margin: 25px 0;
					}
					.status-label {
						font-weight: 600;
						color: #2c3e50;
						margin-bottom: 10px;
					}
					.status-select {
						height: 50px;
						border-radius: 12px;
						border: 2px solid #e0e0e0;
						padding: 0 20px;
						margin-top: 12px;
						transition: all 0.3s ease;
						font-size: 16px;
						margin-left: 50px;
						background-color: #f8f9fa;
					}
					.status-select:focus {
						border-color: #088395;
						box-shadow: 0 0 0 4px rgba(8,131,149,0.1);
						background-color: #ffffff;
					}
					.update-btn {
						width: 100%;
						background: linear-gradient(135deg, #088395, #0a5c6d);
						border: none;
						padding: 14px;
						border-radius: 12px;
						margin-top: 25px;
						font-weight: 600;
						letter-spacing: 0.5px;
						transition: all 0.3s ease;
					}
					.update-btn:hover {
						transform: translateY(-2px);
						box-shadow: 0 6px 12px rgba(8,131,149,0.2);
						background: linear-gradient(135deg, #0a5c6d, #088395);
					}
				`}</style>
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
