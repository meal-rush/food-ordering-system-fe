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
            <div className="adminUpdate" style={{ 
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                padding: "2rem"
            }}>
                <MainScreen title="">
                    <div className="d-flex flex-column align-items-center">
                        <h1 style={{ 
                            fontWeight: "600", 
                            fontSize: "2.5rem",
                            color: "#2c3e50",
                            marginBottom: "2rem",
                            textTransform: "uppercase",
                            letterSpacing: "2px"
                        }}>
                            Update Order Status
                        </h1>

                        <Button
                            variant="primary"
                            style={{
                                padding: "0.8rem 1.5rem",
                                fontSize: "1rem",
                                borderRadius: "30px",
                                background: "linear-gradient(45deg, #2193b0, #6dd5ed)",
                                border: "none",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                                marginBottom: "2rem",
                                transition: "transform 0.2s ease",
                            }}
                            href="/admin-orders"
                        >
                            Back To Order List
                        </Button>

                        <Card style={{
                            width: "100%",
                            maxWidth: "600px",
                            background: "rgba(255, 255, 255, 0.9)",
                            borderRadius: "15px",
                            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                            border: "none",
                            padding: "2rem"
                        }}>
                            <Card.Body>
                                <Form onSubmit={updateHandler}>
                                    {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
                                    <Form.Group controlId="status" className="mb-4">
                                        <Form.Label style={{
                                            fontSize: "1.2rem",
                                            color: "#34495e",
                                            fontWeight: "500",
                                            marginBottom: "1rem"
                                        }}>
                                            Order Status
                                        </Form.Label>
                                        <select
                                            className="form-select"
                                            onChange={(e) => setStatus(e.target.value)}
                                            style={{
                                                height: "50px",
                                                fontSize: "1rem",
                                                borderRadius: "10px",
                                                border: "2px solid #e0e0e0",
                                                padding: "0.5rem 1rem",
                                                transition: "all 0.3s ease"
                                            }}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="confirm">Confirm</option>
                                        </select>
                                    </Form.Group>

                                    {loading ? (
                                        <Loading size={50} />
                                    ) : (
                                        <Button 
                                            type="submit" 
                                            style={{
                                                width: "100%",
                                                padding: "1rem",
                                                fontSize: "1.1rem",
                                                borderRadius: "10px",
                                                background: "linear-gradient(45deg, #11998e, #38ef7d)",
                                                border: "none",
                                                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                                                transition: "transform 0.2s ease"
                                            }}
                                        >
                                            Update Status
                                        </Button>
                                    )}
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </MainScreen>
            </div>
        );
    } else {
        return (
            <div className="denied" style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
            }}>
                <MainScreen />
            </div>
        );
    }
}
