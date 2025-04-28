import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Card, Row, Col, Badge, ProgressBar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { vendorUpdateOrderStatusAction } from "../../actions/orderManagementActions/orderAction";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import MainScreen from "../../components/MainScreen";
import { FaArrowLeft, FaCheckCircle, FaTruck, FaHourglassHalf, FaBoxOpen, FaTimes, FaClipboardCheck } from "react-icons/fa";
import { BiFoodMenu } from "react-icons/bi";
import "./vendorUpdateOrder.css";
import { API_ENDPOINT } from "../../config";

function VendorUpdateOrder({ match, history }) {
  const [status, setStatus] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const dispatch = useDispatch();
  const vendor_Login = useSelector((state) => state.vendor_Login);
  const { vendorInfo } = vendor_Login;

  const orderUpdate = useSelector((state) => state.orderUpdateStatus);
  const { loading: loadingUpdate, error: errorUpdate, success: updateSuccess } = orderUpdate;

  useEffect(() => {
    // Function to fetch the order
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${vendorInfo.token}`,
          },
        };

        const { data } = await axios.get(`${API_ENDPOINT}/orders/order/get-vendor-orders/${vendorInfo._id}`, config);
        
        // Find the specific order from all vendor orders
        const specificOrder = data.find(o => o._id === match.params.id);
        
        if (specificOrder) {
          setOrder(specificOrder);
          setStatus(specificOrder.status);
        } else {
          setError("Order not found");
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch order details");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [match.params.id, vendorInfo]);

  useEffect(() => {
    if (updateSuccess) {
      setSuccessMessage("Order status updated successfully!");
      // Refresh order data after update
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [updateSuccess]);

  const updateHandler = (e) => {
    e.preventDefault();
    dispatch(vendorUpdateOrderStatusAction(match.params.id, status));
  };

  // Get appropriate icon for each status
  const getStatusIcon = (orderStatus) => {
    switch(orderStatus) {
      case "pending": return <FaHourglassHalf className="status-icon pending" />;
      case "confirmed": return <FaCheckCircle className="status-icon confirmed" />;
      case "preparing": return <BiFoodMenu className="status-icon preparing" size={22} />;
      case "ready": return <FaBoxOpen className="status-icon ready" />;
      case "delivered": return <FaTruck className="status-icon delivered" />;
      case "cancelled": return <FaTimes className="status-icon cancelled" />;
      default: return <FaHourglassHalf className="status-icon" />;
    }
  };

  // Calculate progress percentage based on status
  const getProgressPercentage = (orderStatus) => {
    const statuses = ["pending", "confirmed", "preparing", "ready", "delivered"];
    if (orderStatus === "cancelled") return 0;
    const index = statuses.indexOf(orderStatus);
    return index !== -1 ? ((index + 1) / statuses.length) * 100 : 0;
  };

  // Get progress bar variant based on status
  const getProgressVariant = (orderStatus) => {
    switch(orderStatus) {
      case "pending": return "warning";
      case "confirmed": return "info";
      case "preparing": return "primary";
      case "ready": return "success";
      case "delivered": return "success";
      case "cancelled": return "danger";
      default: return "info";
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get badge variant for status
  const getStatusBadgeVariant = (statusValue) => {
    switch(statusValue) {
      case "pending": return "warning";
      case "confirmed": return "info";
      case "preparing": return "primary";
      case "ready": return "success";
      case "delivered": return "dark";
      case "cancelled": return "danger";
      default: return "secondary";
    }
  };

  if (vendorInfo) {
    return (
      <div className="order-update-background">
        <MainScreen title="">
          <div className="update-order-container">
            <Button 
              variant="outline-primary"
              className="back-button mb-4"
              onClick={() => history.push("/vendor-orders")}
            >
              <FaArrowLeft /> Back to Orders
            </Button>

            <Card className="order-update-card">
              <Card.Header className="update-card-header">
                <h2 className="text-center mb-0">
                  <FaClipboardCheck className="me-2" />
                  Update Order Status
                </h2>
              </Card.Header>
              
              <Card.Body className="order-update-body">
                {errorUpdate && <ErrorMessage variant="danger">{errorUpdate}</ErrorMessage>}
                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                )}
                {loadingUpdate && <Loading />}
                {loading && <Loading />}
                {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
                
                {order && (
                  <>
                    {/* Order Status Progress */}
                    <div className="order-progress-section">
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="mb-0">Current Status: </h4>
                        <Badge 
                          bg={getStatusBadgeVariant(order.status)} 
                          className="ms-2 status-badge"
                        >
                          {getStatusIcon(order.status)} {order.status?.toUpperCase()}
                        </Badge>
                      </div>
                      <ProgressBar 
                        now={getProgressPercentage(order.status)} 
                        variant={getProgressVariant(order.status)}
                        className="order-progress"
                      />
                      <div className="status-labels">
                        <span className={order.status === "pending" ? "active" : ""}>Pending</span>
                        <span className={order.status === "confirmed" ? "active" : ""}>Confirmed</span>
                        <span className={order.status === "preparing" ? "active" : ""}>Preparing</span>
                        <span className={order.status === "ready" ? "active" : ""}>Ready</span>
                        <span className={order.status === "delivered" ? "active" : ""}>Delivered</span>
                      </div>
                    </div>

                    {/* Order Details Card */}
                    <div className="order-details-card">
                      <h4 className="details-header">Order Information</h4>
                      
                      <Row className="order-info-section">
                        <Col md={6}>
                          <div className="info-item">
                            <span className="info-label">Order ID:</span>
                            <span className="info-value">{order.orderID}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Date Placed:</span>
                            <span className="info-value">{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Total Amount:</span>
                            <span className="info-value price">Rs. {order.total?.toFixed(2)}</span>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="info-item">
                            <span className="info-label">Customer:</span>
                            <span className="info-value">{order.customerName || "Not available"}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Contact:</span>
                            <span className="info-value">{order.customerPhone || "Not available"}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Delivery Address:</span>
                            <span className="info-value">{order.deliveryAddress || "Not available"}</span>
                          </div>
                        </Col>
                      </Row>

                      <div className="order-items-section">
                        <h5 className="details-subheader">Order Items</h5>
                        <div className="order-items-content">
                          {order.products}
                        </div>
                      </div>
                    </div>

                    {/* Status Update Form */}
                    <Form onSubmit={updateHandler} className="status-update-form">
                      <h4 className="update-header">Update Status</h4>
                      
                      <Form.Group controlId="status" className="mb-4">
                        <div className="status-selection">
                          <Form.Control
                            as="select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="status-select"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready for Pickup</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </Form.Control>
                        </div>
                      </Form.Group>
                      
                      <div className="action-buttons">
                        <Button
                          variant="secondary"
                          onClick={() => history.push("/vendor-orders")}
                          className="cancel-btn"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          type="submit"
                          className="update-btn"
                          disabled={loadingUpdate}
                        >
                          {loadingUpdate ? "Updating..." : "Update Status"}
                        </Button>
                      </div>
                    </Form>
                  </>
                )}
              </Card.Body>
            </Card>
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

export default VendorUpdateOrder;