import React, { useState, useRef } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import emailjs from "@emailjs/browser";
import Loading from "../../components/Loading";
import { createDeliveryAction } from "../../actions/deliveryManagementActions/deliveriesAction";
import ErrorMessage from "../../components/ErrorMessage";
import MainScreen from "../../components/MainScreen";

export default function DeliveriesCreate({ match, history }) {
	const orderID = useParams();

	const dispatch = useDispatch();
	const customer_Login = useSelector((state) => state.customer_Login);
	const { customerInfo } = customer_Login;

	const deliveryCreate = useSelector((state) => state.deliveryCreate);
	const { loading, error } = deliveryCreate;

	const [customerName] = useState(customerInfo.name);
	const [customerEmail] = useState(customerInfo.email);
	const [customerPhone] = useState(customerInfo.telephone);
	const [order] = useState(orderID.id);
	const customerId = useState(customerInfo._id);
	const str = customerId.toString();
	const customer = str.split(",").shift();

	const [deliveryServiceName, setDeliveryServiceName] = useState("");
	const [deliveryServiceEmail, setDeliveryServiceEmail] = useState("");
	const [deliveryServicePhone, setDeliveryServicePhone] = useState("");
	const [deliveryStatus, setDeliveryStatus] = useState("Processing");

	const formDelivery = useRef();
	const [isSend, setisSend] = useState(false);

	const resetHandler = () => {
		setDeliveryServiceName("");
		setDeliveryServicePhone("");
	};
	const submitHandler = (e) => {
		e.preventDefault();

		const sendingData = {
			order,
			customer,
			customerName,
			customerEmail,
			customerPhone,
			deliveryServiceName,
			deliveryServiceEmail,
			deliveryServicePhone,
			deliveryStatus,
		};
		console.log(sendingData);

		dispatch(
			createDeliveryAction(
				order,
				customer,
				customerName,
				customerEmail,
				customerPhone,
				deliveryServiceName,
				deliveryServiceEmail,
				deliveryServicePhone,
				deliveryStatus
			)
		);

		resetHandler();

		emailjs
			.sendForm("service_a0dl37h", "template_nolrmc6", formDelivery.current, "-l-yfdg2kBiYgzEht")
			.then((result) => {
				console.log(result.text);
				setisSend(true);
				setTimeout(() => {
					setisSend(false);
				}, 2500);
			})
			.catch((error) => {
				console.log(error.text);
			});
	};

	if (customerInfo) {
		return (
			<div className="DeliveriesBackgroundCreate" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
				<MainScreen title="Delivery Preferences">
					<Button
						variant="primary"
						className="back-button"
						href={`/customer-deliveries/${customerInfo._id}`}
						style={{
							margin: '20px',
							backgroundColor: '#088395',
							border: 'none',
							borderRadius: '8px',
							padding: '10px 20px'
						}}
					>
						← Back to Deliveries
					</Button>

					<Card className="delivery-form-card">
						<Card.Body>
							<Form onSubmit={submitHandler} ref={formDelivery}>
								{error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
								
								<div className="form-grid">
									<Form.Group>
										<Form.Label>Order ID</Form.Label>
										<Form.Control value={order} readOnly className="modern-input" />
									</Form.Group>

									<Form.Group>
										<Form.Label>Name</Form.Label>
										<Form.Control value={customerInfo.name} readOnly className="modern-input" />
									</Form.Group>

									<Form.Group>
										<Form.Label>Delivery Service</Form.Label>
										<Form.Select 
											value={deliveryServiceName}
											onChange={(e) => setDeliveryServiceName(e.target.value)}
											className="modern-select"
											required
										>
											<option>Select Delivery Partner</option>
											<option value="DHL">DHL Express</option>
											<option value="Eco Air">Eco Air Delivery</option>
											<option value="Pick Me">Pick Me</option>
											<option value="Uber">Uber Connect</option>
										</Form.Select>
									</Form.Group>

									<Form.Group>
										<Form.Label>Delivery Service Email</Form.Label>
										<Form.Select
											value={deliveryServiceEmail}
											onChange={(e) => setDeliveryServiceEmail(e.target.value)}
											className="modern-select"
											required
										>
											<option>Select Delivery Partner Mail</option>
											<option value="dhlshipping@co.lk">DHL - dhlshipping@co.lk</option>
											<option value="ecoshipping@co.lk">Eco Air - ecoshipping@co.lk</option>
											<option value="pickmedrops@pickme.com">Pick Me - pickmedrops@pickme.com</option>
											<option value="uberconnect@uberblog.com">Uber - uberconnect@uberblog.com</option>
										</Form.Select>
									</Form.Group>

									<Form.Group>
										<Form.Label>Delivery Service Phone</Form.Label>
										<Form.Select
											value={deliveryServicePhone}
											onChange={(e) => setDeliveryServicePhone(e.target.value)}
											className="modern-select"
											required
										>
											<option>Select Delivery Partner Phone</option>
											<option value="0777896532">DHL - 0777896532</option>
											<option value="0118956556">Eco Air - 0118956556</option>
											<option value="0115896236">Pick Me - 0115896236</option>
											<option value="0775689565">Uber - 0775689565</option>
										</Form.Select>
									</Form.Group>

									<Form.Group>
										<Form.Label>Status</Form.Label>
										<Form.Select
											value={deliveryStatus}
											onChange={(e) => setDeliveryStatus(e.target.value)}
											className="modern-select"
											required
										>
											<option value="Processing">Processing</option>
										</Form.Select>
									</Form.Group>
								</div>

								<div className="button-group">
									<Button type="submit" className="submit-btn">
										Submit
									</Button>
									<Button onClick={resetHandler} variant="outline-danger">
										Reset
									</Button>
								</div>
							</Form>
						</Card.Body>
					</Card>
				</MainScreen>
				<style jsx>{`
					.delivery-form-card {
						margin: 20px;
						border-radius: 15px;
						border: none;
						box-shadow: 0 4px 6px rgba(0,0,0,0.1);
						background: white;
					}
					.form-grid {
						display: grid;
						grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
						gap: 20px;
						padding: 20px;
					}
					.modern-input, .modern-select {
						height: 45px;
						border-radius: 8px;
						border: 1px solid #ddd;
						padding: 0 15px;
						transition: all 0.3s;
					}
					.modern-input:focus, .modern-select:focus {
						border-color: #088395;
						box-shadow: 0 0 0 3px rgba(8,131,149,0.1);
					}
					.button-group {
						display: flex;
						gap: 10px;
						padding: 20px;
					}
					.submit-btn {
						background: #088395;
						border: none;
						padding: 10px 30px;
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
