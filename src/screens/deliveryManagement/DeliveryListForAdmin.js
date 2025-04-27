import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { deliveriesListForAdminAction } from "../../actions/deliveryManagementActions/deliveriesAction";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import MainScreen from "../../components/MainScreen";
import "./deliveryLists.css";

export default function AdminDeliveryList() {
	const dispatch = useDispatch();
	const admin_Login = useSelector((state) => state.admin_Login);
	const { adminInfo } = admin_Login;

	const adminDeliveryList = useSelector((state) => state.adminDeliveryList);
	const { loading, deliveries, error } = adminDeliveryList;

	console.log(deliveries);

	const history = useHistory();
	useEffect(() => {
		dispatch(deliveriesListForAdminAction());
	}, [dispatch, history, adminInfo]);

	const groupDeliveriesByStatus = (deliveries) => {
		return deliveries?.reduce((groups, delivery) => {
			const status = delivery.status;
			if (!groups[status]) {
				groups[status] = [];
			}
			groups[status].push(delivery);
			return groups;
		}, {});
	};

	const renderDeliveryTable = (deliveries, status) => {
		return (
			<div className="delivery-section" key={status}>
				<h3 className="status-title">{status} Orders</h3>
				<Table hover responsive className="delivery-table">
					<thead>
						<tr>
							<th>Order ID</th>
							<th>Customer Name</th>
							<th>Customer Email</th>
							<th>Customer Phone</th>
							<th>Delivery Service</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{deliveries.map((delivery) => (
							<tr key={delivery._id}>
								<td>{delivery.orderId}</td>
								<td>{delivery.customerName}</td>
								<td>{delivery.customerEmail}</td>
								<td>{delivery.customerPhone}</td>
								<td>
									<span className="delivery-service">
										{delivery.deliveryServiceName}
									</span>
								</td>
								<td>
									<Button
										href={`/update-delivery/${delivery._id}`}
										className={`status-button ${status.toLowerCase()}`}
									>
										Update Status
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>
		);
	};

	if (adminInfo) {
		const groupedDeliveries = groupDeliveriesByStatus(deliveries);
		
		return (
			<div className="deliveryAdminList">
				<MainScreen title={
					<div className="dashboard-header">
						<h1>Delivery Management Dashboard</h1>
						<div className="stats-cards">
							{Object.entries(groupedDeliveries || {}).map(([status, items]) => (
								<div className={`stat-card ${status.toLowerCase()}`} key={status}>
									<h4>{status}</h4>
									<p>{items.length} Orders</p>
								</div>
							))}
						</div>
					</div>
				}>
					{error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
					{loading && <Loading />}
					
					<div className="tables-container">
						{Object.entries(groupedDeliveries || {}).map(([status, items]) => 
							renderDeliveryTable(items, status)
						)}
					</div>
				</MainScreen>
				<style jsx>{`
					.dashboard-header {
						margin-bottom: 30px;
					}
					.stats-cards {
						display: grid;
						grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
						gap: 20px;
						margin-top: 20px;
					}
					.stat-card {
						padding: 20px;
						border-radius: 10px;
						color: white;
						text-align: center;
					}
					.stat-card.processing { background: #ff9800; }
					.stat-card.dispatched { background: #4caf50; }
					.stat-card.delivered { background: #2196f3; }
					.stat-card.pending { background: #f44336; }
					
					.delivery-section {
						background: white;
						border-radius: 15px;
						padding: 20px;
						margin-bottom: 30px;
						box-shadow: 0 2px 10px rgba(0,0,0,0.1);
					}
					.status-title {
						color: #333;
						margin-bottom: 20px;
						font-weight: 600;
					}
					.delivery-table thead {
						background: #f8f9fa;
					}
					.delivery-table th {
						padding: 15px;
						font-weight: 600;
						color: #495057;
					}
					.delivery-service {
						background: #e3f2fd;
						color: #1976d2;
						padding: 5px 10px;
						border-radius: 4px;
						font-size: 0.9em;
					}
					.status-button {
						border: none;
						padding: 8px 16px;
						border-radius: 6px;
						font-weight: 500;
						transition: all 0.3s;
					}
					.status-button.processing { background: #ff9800; }
					.status-button.dispatched { background: #4caf50; }
					.status-button.delivered { background: #2196f3; }
					.status-button.pending { background: #f44336; }
					.status-button:hover {
						transform: translateY(-2px);
						box-shadow: 0 2px 5px rgba(0,0,0,0.2);
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
