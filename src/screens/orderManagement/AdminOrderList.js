import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { adminCustomerOrders } from "../../actions/orderManagementActions/orderAction";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import MainScreen from "../../components/MainScreen";
import "./orderLists.css";

export default function AdminOrderList() {
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");

    const dispatch = useDispatch();
    const admin_Login = useSelector((state) => state.admin_Login);
    const { adminInfo } = admin_Login;

    const adminOrderList = useSelector((state) => state.adminOrderList);
    const { loading, orders, error } = adminOrderList;

    const history = useHistory();
    useEffect(() => {
        dispatch(adminCustomerOrders());
    }, [dispatch, history, adminInfo]);

    const filterOrders = (orders) => {
        return orders?.filter(order => {
            const matchesStatus = filterStatus === "ALL" || order.status === filterStatus;
            const matchesSearch = order.orderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                order.products.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    };

    const groupOrdersByStatus = (orders) => {
        return orders?.reduce((acc, order) => {
            const status = order.status;
            if (!acc[status]) acc[status] = [];
            acc[status].push(order);
            return acc;
        }, {});
    };

    if (adminInfo) {
        const filteredOrders = filterOrders(orders);
        const groupedOrders = groupOrdersByStatus(filteredOrders);

        return (
            <div className="order-container">
                <MainScreen title="">
                    <div className="order-content">
                        <h1 className="order-title">Order Management</h1>
                        
                        <div className="filters-section">
                            <InputGroup className="search-input">
                                <Form.Control
                                    type="text"
                                    placeholder="Search orders..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                            <Form.Select 
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="status-select"
                            >
                                <option value="ALL">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </Form.Select>
                        </div>

                        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
                        {loading && <Loading />}

                        {!loading && !error && Object.entries(groupedOrders || {}).map(([status, statusOrders]) => (
                            <div key={status} className="status-table-section">
                                <h3 className="status-heading">
                                    {status} Orders ({statusOrders.length})
                                </h3>
                                <Table className="order-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Products</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {statusOrders.map((order) => (
                                            <tr key={order._id} className="order-row">
                                                <td>{order.orderID}</td>
                                                <td>{order.products}</td>
                                                <td>${order.total.toFixed(2)}</td>
                                                <td>
                                                    <span className={`status-button status-${order.status.toLowerCase()}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Button
                                                        className="edit-button"
                                                        href={`/update-order/${order._id}`}
                                                    >
                                                        Edit
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ))}
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
