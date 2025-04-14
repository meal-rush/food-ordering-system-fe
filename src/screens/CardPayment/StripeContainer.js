import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import PaymentForm from "./PaymentForm";

const PUBLIC_KEY =
	"pk_test_51OezYdHaXd6bkNZyeWQtkFY9LKmZsmBkqa1hWL1xMeo3mF6j0602NJTbjHLrvA9L70he99tSAjcbn8eBEcR30NGu00RrC75chD";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

export default function StripeContainer() {
	return (
		<>
			<br />
			<br />
			<br />
			<br />
			<Elements stripe={stripeTestPromise}>
				<PaymentForm />
			</Elements>
		</>
	);
}
