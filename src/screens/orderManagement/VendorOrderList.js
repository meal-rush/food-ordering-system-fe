import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Card, Row, Col, Form, Table, Badge, Pagination, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { vendorOrders } from "../../actions/orderManagementActions/orderAction";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import MainScreen from "../../components/MainScreen";
import { FaSearch, FaSort, FaEye, FaArrowLeft, FaFilter } from "react-icons/fa";
import { BsFillBagCheckFill } from "react-icons/bs";
import "./vendorOrderList.css";

export default function VendorOrderList() {
  const dispatch = useDispatch();
  const vendor_Login = useSelector((state) => state.vendor_Login);
  const { vendorInfo } = vendor_Login;

  const adminOrderList = useSelector((state) => state.adminOrderList);
  const { loading, orders, error } = adminOrderList;

  // State variables
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("orderID");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const history = useHistory();
  
  useEffect(() => {
    dispatch(vendorOrders());
  }, [dispatch, history, vendorInfo]);

  // Search handler
  const searchHandler = (e) => {
    setSearch(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Toggle order details view
  const toggleOrderDetails = (id) => {
    if (expandedOrder === id) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(id);
    }
  };

  // Filter orders by search term and status
  const filterOrders = () => {
    if (!orders) return [];
    
    return orders.filter(order => {
      // Search filtering
      const matchesSearch = 
        order.orderID?.toLowerCase().includes(search) ||
        order.products?.toLowerCase().includes(search) ||
        order.status?.toLowerCase().includes(search);
      
      // Status filtering
      const matchesStatus = statusFilter === "all" || 
                            order.status?.toLowerCase() === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  // Sort orders
  const sortOrders = (orders) => {
    return [...orders].sort((a, b) => {
      if (sortField === "total") {
        return sortOrder === "asc" 
          ? Number(a.total) - Number(b.total)
          : Number(b.total) - Number(a.total);
      } else {
        return sortOrder === "asc"
          ? a[sortField]?.toString().localeCompare(b[sortField]?.toString())
          : b[sortField]?.toString().localeCompare(a[sortField]?.toString());
      }
    });
  };

  const filteredOrders = filterOrders();
  const sortedOrders = sortOrders(filteredOrders);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Generate pagination items
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <Pagination.Item key={i} active={i === currentPage} onClick={() => paginate(i)}>
        {i}
      </Pagination.Item>
    );
  }

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get status badge with appropriate styling
  const getStatusBadge = (status) => {
    let variant = "secondary";
    
    switch(status?.toLowerCase()) {
      case "pending":
        variant = "warning";
        break;
      case "confirmed":
        variant = "info";
        break;
      case "preparing":
        variant = "primary";
        break;
      case "ready":
        variant = "success";
        break;
      case "delivered":
        variant = "dark";
        break;
      case "cancelled":
        variant = "danger";
        break;
      default:
        variant = "secondary";
    }
    
    return <Badge bg={variant} className="status-badge">{status}</Badge>;
  };
  
  // Format date helper
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get urgency class based on order status and time
  const getUrgencyClass = (status, dateString) => {
    if (status?.toLowerCase() === "pending") {
      const orderTime = new Date(dateString);
      const now = new Date();
      const diffMs = now - orderTime;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins > 30) return "high-urgency";
      if (diffMins > 15) return "medium-urgency";
    }
    return "";
  };

  if (vendorInfo) {
    return (
      <div className="vendor-order-list-page">
        <MainScreen title="">
          {/* Header Section */}
          <div className="page-header d-flex flex-column align-items-center mb-4 text-center">
            <h2 className="orders-title mb-3">
              <BsFillBagCheckFill className="me-2" />
              Order Management
            </h2>
            <div className="d-flex justify-content-between w-100">
              <Button
                variant="outline-primary"
                className="back-button"
                onClick={() => history.push("/vendor")}
              >
                <FaArrowLeft /> Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <Card className="filter-card mb-4">
            <Card.Body>
              <Row className="align-items-center">
                <Col lg={4} md={6} sm={12}>
                  <div className="search-box">
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaSearch />
                      </span>
                      <Form.Control
                        type="text"
                        placeholder="Search by Order ID or Products..."
                        value={search}
                        onChange={searchHandler}
                        className="search-input"
                      />
                    </div>
                  </div>
                </Col>
                <Col lg={4} md={6} sm={6} className="mt-3 mt-lg-0">
                  <Form.Group>
                    <Form.Control
                      as="select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="status-filter"
                    >
                      <option value="all">All Orders</option>
                      <option value="pending">Pending Orders</option>
                      <option value="confirmed">Confirmed Orders</option>
                      <option value="preparing">Preparing Orders</option>
                      <option value="ready">Ready Orders</option>
                      <option value="delivered">Delivered Orders</option>
                      <option value="cancelled">Cancelled Orders</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col lg={4} md={6} sm={6} className="mt-3 mt-lg-0">
                  <Dropdown>
                    <Dropdown.Toggle 
                      variant="primary" 
                      id="dropdown-sort" 
                      className="sort-dropdown w-100"
                    >
                      <FaSort className="me-1" /> Sort By: {
                        sortField === "orderID" ? "Order ID" : 
                        sortField === "total" ? "Order Total" :
                        sortField === "status" ? "Status" :
                        sortField.charAt(0).toUpperCase() + sortField.slice(1)
                      }
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleSort("orderID")}>Order ID</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleSort("total")}>Order Total</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleSort("status")}>Status</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Error and Loading Messages */}
          {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
          {loading && <Loading />}

          {/* Results Summary */}
          <div className="results-summary mb-3">
            <p>
              Showing {filteredOrders.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, filteredOrders.length)} of{" "}
              {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
              {search && (
                <span className="ms-2">
                  matching "<strong>{search}</strong>"
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="ms-2">
                  with status "<strong>{statusFilter}</strong>"
                </span>
              )}
            </p>
          </div>

          {/* Orders Table */}
          <div className="table-responsive orders-table-container">
            <Table hover className="orders-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleSort("orderID")}>
                    Order ID {sortField === "orderID" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th>Products</th>
                  <th className="sortable" onClick={() => handleSort("total")}>
                    Total (Rs) {sortField === "total" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="sortable" onClick={() => handleSort("status")}>
                    Status {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th style={{ width: "130px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <>
                      <tr 
                        key={order._id} 
                        className={`order-row ${expandedOrder === order._id ? "expanded-row" : ""} ${getUrgencyClass(order.status, order.createdAt)}`}
                      >
                        <td className="order-id">{order.orderID}</td>
                        <td className="order-products">
                          {order.products.length > 50 ? 
                            `${order.products.substring(0, 50)}...` : 
                            order.products}
                        </td>
                        <td className="order-total">Rs. {order.total?.toFixed(2)}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td>
                          <div className="d-flex">
                            <Button
                              variant="outline-info"
                              size="sm"
                              className="me-2"
                              onClick={() => toggleOrderDetails(order._id)}
                            >
                              <FaEye />
                            </Button>
                            <Button
                              style={{
                                fontSize: 13,
                                backgroundColor: "#28a745",
                                borderRadius: 5,
                                border: "none",
                              }}
                              href={`/vendor-update-order/${order._id}`}
                            >
                              Update
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {expandedOrder === order._id && (
                        <tr className="details-row">
                          <td colSpan="5">
                            <div className="order-details-expanded">
                              <Row>
                                <Col md={6}>
                                  <div className="detail-item">
                                    <span className="detail-label">Order ID:</span> {order.orderID}
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">Customer:</span> {order.customerName || "Not available"}
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">Contact:</span> {order.customerPhone || "Not available"}
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">Address:</span> {order.deliveryAddress || "Not available"}
                                  </div>
                                </Col>
                                <Col md={6}>
                                  <div className="detail-item">
                                    <span className="detail-label">Order Date:</span> {formatDate(order.createdAt)}
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">Order Status:</span> {getStatusBadge(order.status)}
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">Payment Method:</span> {order.paymentMethod || "Not specified"}
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">Payment Status:</span> {order.paymentStatus || "Not specified"}
                                  </div>
                                </Col>
                              </Row>
                              
                              <div className="order-products-detail mt-3">
                                <h5 className="mb-3">Ordered Items</h5>
                                <div className="ordered-products">
                                  {order.products}
                                </div>
                              </div>
                              
                              <div className="order-total-section mt-3">
                                <div className="d-flex justify-content-between total-line">
                                  <span><strong>Total:</strong></span>
                                  <span><strong>Rs. {order.total?.toFixed(2) || "0.00"}</strong></span>
                                </div>
                              </div>
                              
                              <div className="action-buttons mt-3">
                                <Button
                                  variant="primary"
                                  href={`/vendor-update-order/${order._id}`}
                                  className="me-2"
                                >
                                  Update Status
                                </Button>
                                {order.status === "pending" && (
                                  <Button variant="outline-danger">
                                    Cancel Order
                                  </Button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="no-orders-message">
                        {search || statusFilter !== "all" ? 
                          "No orders match your search criteria" : 
                          "No orders found"
                        }
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredOrders.length > itemsPerPage && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                {paginationItems}
                <Pagination.Next
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
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