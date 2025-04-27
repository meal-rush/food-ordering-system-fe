import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { deliveriesListForCustomerAction } from "../../actions/deliveryManagementActions/deliveriesAction";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import MainScreen from "../../components/MainScreen";
import "./deliveryLists.css";

export default function CustomerDeliveryList({ match }) {
    const dispatch = useDispatch();
    const customer_Login = useSelector((state) => state.customer_Login);
    const { customerInfo } = customer_Login;

    const customerDeliveryList = useSelector((state) => state.customerDeliveryList);
    const { loading, deliveries, error } = customerDeliveryList;

    console.log(deliveries);

    const history = useHistory();
    useEffect(() => {
        dispatch(deliveriesListForCustomerAction(match.params.id));
    }, [dispatch, history, customerInfo, match.params.id]);

    if (customerInfo) {
        return (
            <div className="deliveryCustomerList" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
                <MainScreen title={`My Deliveries`}>
                    <div style={{ padding: '20px' }}>
                        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
                        {loading && <Loading />}
                        <Table hover responsive className="table-modern" style={{ 
                            background: 'white',
                            borderRadius: '15px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <thead style={{ backgroundColor: '#088395', color: 'white' }}>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer Name</th>
                                    <th>Customer Email</th>
                                    <th>Customer Phone</th>
                                    <th>Delivery Service</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliveries?.reverse().map((delivery) => (
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
                                            <span className={`status-badge ${delivery.status.toLowerCase()}`}>
                                                {delivery.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </MainScreen>
                <style jsx>{`
                    .table-modern td, .table-modern th {
                        padding: 15px;
                        vertical-align: middle;
                    }
                    .delivery-service {
                        padding: 5px 10px;
                        border-radius: 4px;
                        background: #e3f2fd;
                        color: #1976d2;
                    }
                    .status-badge {
                        padding: 5px 10px;
                        border-radius: 4px;
                        font-weight: 500;
                    }
                    .status-badge.processing { background: #fff3e0; color: #f57c00; }
                    .status-badge.dispatched { background: #e8f5e9; color: #2e7d32; }
                    .status-badge.delivered { background: #e8eaf6; color: #3f51b5; }
                    .status-badge.pending { background: #ffebee; color: #c62828; }
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
