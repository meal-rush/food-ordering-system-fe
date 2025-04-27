import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { vendorUpdateOrderStatusAction } from "../../actions/orderManagementActions/orderAction";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import MainScreen from "../../components/MainScreen";
import "./orderLists.css";
import { API_ENDPOINT } from "../../config";

function VendorUpdateOrder({ match, history }) {
  const [status, setStatus] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const vendor_Login = useSelector((state) => state.vendor_Login);
  const { vendorInfo } = vendor_Login;

  const orderUpdate = useSelector((state) => state.orderUpdateStatus);
  const { loading: loadingUpdate, error: errorUpdate } = orderUpdate;

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

  const updateHandler = (e) => {
    e.preventDefault();
    dispatch(vendorUpdateOrderStatusAction(match.params.id, status));
  };

  if (vendorInfo) {
    return (
      <div className="orderBackground">
        <MainScreen title="">
          <Card
            className="updateOrderCard"
            style={{
              margin: "30px",
              marginLeft: "10%",
              marginRight: "10%",
              padding: "20px",
              borderRadius: "20px",
              borderWidth: "0px",
              background: "rgba(231, 238, 238, 0.8)",
            }}
          >
            <Card.Header
              style={{
                textAlign: "center",
                borderRadius: "20px",
                background: "rgba(114, 171, 218, 0.8)",
                color: "white",
                fontWeight: "bold",
                fontFamily: "Times New Roman",
              }}
            >
              <h2>Update Order Status</h2>
            </Card.Header>
            <Card.Body>
              {errorUpdate && <ErrorMessage variant="danger">{errorUpdate}</ErrorMessage>}
              {loadingUpdate && <Loading />}
              {loading && <Loading />}
              {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
              {order && (
                <Form onSubmit={updateHandler}>
                  <div className="orderDetailsSection">
                    <h4>Order Details</h4>
                    <p><strong>Order ID:</strong> {order.orderID}</p>
                    <p><strong>Products:</strong> {order.products}</p>
                    <p><strong>Total Amount:</strong> Rs. {order.total}</p>
                    <p><strong>Current Status:</strong> {order.status}</p>
                  </div>
                  <Form.Group controlId="status">
                    <Form.Label
                      style={{
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        fontFamily: "Arial",
                        fontSize: "20px",
                      }}
                    >
                      Update Status
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      style={{
                        height: "45px",
                        fontSize: "18px",
                        borderRadius: "10px",
                        padding: "10px",
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready for Pickup</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Control>
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    style={{
                      width: "100%",
                      marginTop: "20px",
                      height: "45px",
                      borderRadius: "10px",
                      fontSize: "20px",
                    }}
                  >
                    Update Status
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
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