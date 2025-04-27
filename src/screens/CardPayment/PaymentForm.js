import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";
import { customerUpdateOrderStatusAction } from "../../actions/orderManagementActions/orderAction";
import axios from "axios"; // Import axios

import "./CardPayment.css";
import PayServices from "./paymentService";

const CARD_OPTIONS = {
	style: {
		base: {
			color: "#32325d",
			fontFamily: "Arial, sans-serif",
			fontSmoothing: "antialiased",
			fontSize: "16px",
			"::placeholder": {
				color: "#32325d",
			},
		},
		invalid: {
			fontFamily: "Arial, sans-serif",
			color: "#fa755a",
			iconColor: "#fa755a",
		},
	},
};

export default function PaymentForm() {
	const formPay = useRef();
	const stripe = useStripe();
	const elements = useElements();
	const [isSend, setisSend] = useState(false);
	const orderStatus = "paid";

	const { id } = useParams();
	const orderId = id;

	const dispatch = useDispatch();
	const customer_Login = useSelector((state) => state.customer_Login);
	const { customerInfo } = customer_Login;

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: "card",
			card: elements.getElement(CardElement),
		});

		if (!error) {
			try {
				console.log("PaymentMethod created:", paymentMethod); // Log the paymentMethod object
				if (!paymentMethod || !paymentMethod.id) {
					throw new Error("Invalid or undefined PaymentMethod ID");
				}

				const { id } = paymentMethod;
				const data = {
					amount: Number(localStorage.getItem("total")) + 100 + 300,
					id,
				};
				const response = await PayServices.pay(data);
				if (response.data.success) {
					console.log("Successful payment");
					Swal.fire({
						icon: "success",
						title: "Payment Successful",
						text: "Your order is placed now. Payment confirmation email has been sent to the email",
						footer: '<a href="/buyerProfile">View Your Orders</a>',
					}).then(async (result) => {
						if (result.isConfirmed) {
							// Dispatch order status update
							dispatch(customerUpdateOrderStatusAction(orderId, orderStatus));

							// Send SMS notification
							try {
								await axios.post("API_ENDPOINT/api/sms/send", {
									to: document.querySelector('input[name="user.phone"]').value,
									message: `Your order with ID ${orderId} has been successfully placed!`,
								});
								console.log("SMS sent successfully");
							} catch (smsError) {
								console.error("Error sending SMS:", smsError.message);
							}

							// Redirect to delivery creation page
							window.location.href = `/delivery-create/${orderId}`;
						}
					});
				}
			} catch (error) {
				console.error("Payment processing error:", error); // Log the error details
				Swal.fire({
					icon: "error",
					title: "Payment Failed",
					text: error.response?.data?.message || "Please Check The Payment Details",
				});
			}
		} else {
			console.error("Error creating PaymentMethod:", error.message); // Log the error message
			Swal.fire({
				icon: "error",
				title: "Payment Failed",
				text: error.message,
			});
		}

		emailjs
			.sendForm("service_chqhmre", "template_vokeufx", formPay.current, "LclqEw7ekzkAyRcv8")
			.then((result) => {
				console.log(result.text);
				setisSend(true);
				setTimeout(() => {
					setisSend(false);
					window.location.href = `/delivery-create/${orderId}`;
				}, 2500);
			})
			.catch((error) => {
				console.log(error.text);
			});
	};

	return (
		<>
			<div className="payContainer">
				<h3>Meal Rush Payment Process</h3>
				<hr />
				<label>Total from the cart : Rs. {eval(localStorage.getItem("total"))}</label> <br />
				<label>Delivery Cost - Rs.300 </label> <br />
				<label>Commission - Rs.100 </label> <hr />
				<label>Total Amount to be Paid- Rs. {eval(localStorage.getItem("total")) + 100 + 300} </label> <hr />
				<form onSubmit={handleSubmit} ref={formPay}>
					<div>
						<label>Email to send the payment confirmation: </label> <br />
						<input
							className="form-control form-control-sm"
							type="email"
							name="useremail"
							style={{ width: "300px", borderRadius: "3px" }}
						></input>
					</div>
					<br />
					<div>
						<label>Mobile number to contact about the delivery: </label> <br />
						<input
							className="form-control form-control-sm"
							type="tel"
							name="user.phone"
							style={{ width: "300px", borderRadius: "3px" }}
						></input>
					</div>{" "}
					<hr />
					<label>Enter your card details: </label>
					<fieldset className="FormGroupPay" style={{ width: "500px", alignContent: "left" }}>
						<div className="FormRowPay">
							<CardElement options={CARD_OPTIONS} />
						</div>
					</fieldset>
					<button className="pay" style={{ width: "200px" }}>
						Pay
					</button>{" "}
					<br />
				</form>
			</div>
			<br></br>
			<br></br>
			<br></br>
		</>
	);
}
