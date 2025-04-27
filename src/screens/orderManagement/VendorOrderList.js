import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { vendorOrders } from "../../actions/orderManagementActions/orderAction";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import MainScreen from "../../components/MainScreen";
import "./orderLists.css";

export default function VendorOrderList() {
  const dispatch = useDispatch();
  const vendor_Login = useSelector((state) => state.vendor_Login);
  const { vendorInfo } = vendor_Login;

  const adminOrderList = useSelector((state) => state.adminOrderList);
  const { loading, orders, error } = adminOrderList;

  const history = useHistory();
  useEffect(() => {
    dispatch(vendorOrders());
  }, [dispatch, history, vendorInfo]);

  if (vendorInfo) {
    return (
      <div className="orderVendorList">
        <br></br>
        <MainScreen title="">
          <div
            style={{
              minHeight: 700,
              marginBottom: "100px",
            }}
          >
            <br></br>
            <h1 style={{ fontWeight: "400", fontSize: "50px" }}>INCOMING ORDERS</h1>
            <br></br>
            {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
            {loading && <Loading />}
            <Table style={{ background: "white", borderRadius: 10, width: "1000px" }}>
              <>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Products</th>
                    <th>Total (Rs)</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.reverse().map((order) => (
                    <tr
                      key={order._id}
                      style={{
                        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                        borderRadius: 10,
                      }}
                    >
                      <td
                        style={{
                          fontSize: 20,
                        }}
                      >
                        {order.orderID}
                      </td>
                      <td
                        style={{
                          fontSize: 20,
                        }}
                      >
                        {order.products}
                      </td>
                      <td
                        style={{
                          fontSize: 20,
                        }}
                      >
                        {order.total}
                      </td>
                      <td
                        style={{
                          fontSize: 20,
                          color: order.status === "pending" ? "orange" : 
                                 order.status === "confirmed" ? "blue" :
                                 order.status === "preparing" ? "purple" :
                                 order.status === "ready" ? "green" :
                                 order.status === "delivered" ? "teal" : "red",
                          fontWeight: "bold"
                        }}
                      >
                        {order.status}
                      </td>
                      <td>
                        <Button
                          style={{
                            fontSize: 15,
                            backgroundColor: "#28a745",
                            borderRadius: 5,
                            border: "none",
                          }}
                          href={`/vendor-update-order/${order._id}`}
                        >
                          Update Status
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            </Table>

            <br></br>
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