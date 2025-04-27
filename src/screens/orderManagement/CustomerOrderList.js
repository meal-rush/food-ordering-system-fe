import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { listCustomerOrders } from "../../actions/orderManagementActions/orderAction";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import MainScreen from "../../components/MainScreen";
import "./orderLists.css";

export default function CustomerOrderList() {
    const dispatch = useDispatch();
    const customer_Login = useSelector((state) => state.customer_Login);
    const { customerInfo } = customer_Login;

    const customerOrderList = useSelector((state) => state.customerOrderList);
    const { loading, customerOrders, error } = customerOrderList;

    const history = useHistory();
    useEffect(() => {
        dispatch(listCustomerOrders());
    }, [dispatch, history, customerInfo]);

    if (customerInfo) {
        return (
            <div className="order-container">
                <MainScreen title="">
                    <div className="order-content">
                        <h1 className="order-title">My Orders</h1>
                        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
                        {loading && <Loading />}
                        <Table className="order-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Products</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customerOrders?.reverse().map((order) => (
                                    <tr key={order._id} className="order-row">
                                        <td>{order.orderID}</td>
                                        <td>{order.products}</td>
                                        <td>${order.total.toFixed(2)}</td>
                                        <td>
                                            <Button
                                                href={`/payment/${order._id}`}
                                                className={`status-button status-${order.status.toLowerCase()}`}
                                                disabled={order.status === "pending" || order.status === "paid"}
                                            >
                                                {order.status}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
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
}
