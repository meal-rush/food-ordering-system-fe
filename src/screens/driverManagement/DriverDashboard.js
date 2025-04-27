import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Card, Container, Row, Col, Badge } from "react-bootstrap";
import { updateDeliveryStatus, driverLogout } from "../../actions/driverManagementActions/driverActions";
import { FaSignOutAlt, FaMotorcycle, FaMapMarkerAlt, FaClock, FaCheckCircle, FaStore, FaBox, FaTruck, FaFlag, FaUser } from "react-icons/fa";
import { MdDeliveryDining, MdOutlineDirectionsBike } from 'react-icons/md';
import { BiPackage } from 'react-icons/bi';
import { RiUserLocationFill } from 'react-icons/ri';
import MainScreen from "../../components/MainScreen";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import axios from "axios";
import { API_ENDPOINT } from "../../config";
import swal from "sweetalert";
import "./driverStyles.css";

const DELIVERY_STATUS_FLOW = {
  "Order Created": "Driver Assigned",
  "Processing": "Driver Assigned", 
  "Driver Assigned": "Driver Arrived at Restaurant",
  "Driver Arrived at Restaurant": "Picked Up",
  "Picked Up": "On the Way",
  "On the Way": "Arrived",
  "Arrived": "Completed"
};

const StatusTimeline = ({ currentStatus }) => {
  const statuses = [
    { id: 1, title: "Driver Assigned", icon: <MdDeliveryDining />, status: "Driver Assigned" },
    { id: 2, title: "Arrived at Restaurant", icon: <FaStore />, status: "Driver Arrived at Restaurant" },
    { id: 3, title: "Picked Up", icon: <BiPackage />, status: "Picked Up" },
    { id: 4, title: "On the Way", icon: <MdOutlineDirectionsBike />, status: "On the Way" },
    { id: 5, title: "Delivered", icon: <FaCheckCircle />, status: "Arrived" }
  ];

  const getCurrentStep = () => {
    const currentIndex = statuses.findIndex(s => s.status === currentStatus);
    return currentIndex !== -1 ? currentIndex + 1 : 0;
  };

  return (
    <div className="status-timeline">
      {statuses.map((status, index) => (
        <div 
          key={status.id} 
          className={`timeline-item ${index < getCurrentStep() ? 'active' : ''}`}
        >
          <div className="timeline-icon">{status.icon}</div>
          <div className="timeline-text">{status.title}</div>
        </div>
      ))}
    </div>
  );
};

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const driver_Login = useSelector((state) => state.driver_Login);
  const { driverInfo } = driver_Login;

  useEffect(() => {
    const fetchAvailableDeliveries = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_ENDPOINT}/deliveries/delivery/all`);
        const availableDeliveries = data.filter(delivery => 
          ["Order Created", "Processing"].includes(delivery.status)
        );
        setDeliveries(availableDeliveries);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAvailableDeliveries();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });

    const interval = setInterval(() => {
      if (activeDelivery) {
        updateLocation();
      }
    }, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, [activeDelivery]);

  const updateLocation = async () => {
    if (currentLocation && activeDelivery) {
      try {
        await axios.put(`${API_ENDPOINT}/deliveries/${activeDelivery._id}/update-location`, {
          location: `${currentLocation.lat},${currentLocation.lng}`,
          status: "ON_THE_WAY"
        });
      } catch (err) {
        console.error("Error updating location:", err);
      }
    }
  };

  const acceptDelivery = async (delivery) => {
    try {
      const updatedDelivery = await dispatch(updateDeliveryStatus(delivery._id, "Driver Assigned"));
      setActiveDelivery({
        ...updatedDelivery,
        status: "Driver Assigned"
      });
      setDeliveries(prev => prev.filter(d => d._id !== delivery._id));
      
      swal({
        title: "Success!",
        text: "Delivery assigned successfully. You can now start the delivery.",
        icon: "success",
        timer: 2000,
        button: false
      });
    } catch (err) {
      setError("Failed to accept delivery");
      swal({
        title: "Error!",
        text: "Failed to accept delivery. Please try again.",
        icon: "error",
        button: "Ok"
      });
    }
  };

  const updateDeliveryProgress = async (status) => {
    if (!activeDelivery) return;
    try {
      await dispatch(updateDeliveryStatus(activeDelivery._id, status));
      if (status === "Completed") {
        setActiveDelivery(null);
      } else {
        setActiveDelivery(prev => ({...prev, status}));
      }
    } catch (err) {
      setError("Failed to update delivery status");
    }
  };

  const handleLogout = () => {
    dispatch(driverLogout());
  };

  if (!driverInfo) {
    return (
      <div className="denied">
        <MainScreen />
        <br />
      </div>
    );
  }

  return (
    <div className="driver-dashboard">
      <MainScreen>
        <Container>
          <div className="dashboard-header">
            <div className="welcome-section">
              <h1>Welcome, {driverInfo?.name}</h1>
              <p>Your delivery dashboard</p>
            </div>
            <div className="status-section">
              <Badge bg={activeDelivery ? "success" : "info"}>
                {activeDelivery ? "On Delivery" : "Available"}
              </Badge>
              <Button variant="danger" onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt /> Logout
              </Button>
            </div>
          </div>

          {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
          {loading ? (
            <Loading />
          ) : (
            <>
              {activeDelivery ? (
                <ActiveDeliveryCard 
                  delivery={activeDelivery}
                  onUpdateStatus={updateDeliveryProgress}
                />
              ) : (
                <AvailableDeliveriesCard 
                  deliveries={deliveries}
                  onAccept={acceptDelivery}
                />
              )}
            </>
          )}
        </Container>
      </MainScreen>
    </div>
  );
};

// Sub-components
const ActiveDeliveryCard = ({ delivery, onUpdateStatus }) => {
  const getCurrentStatusButton = (status) => {
    const nextStatus = DELIVERY_STATUS_FLOW[status];
    if (!nextStatus) return null;

    let variant = "primary";
    let icon = <FaClock/>;

    switch (nextStatus) {
      case "Driver Arrived at Restaurant":
        variant = "info";
        icon = <FaStore/>;
        break;
      case "Picked Up":
        variant = "warning";
        icon = <FaBox/>;
        break;
      case "On the Way":
        variant = "primary";
        icon = <FaTruck/>;
        break;
      case "Arrived":
        variant = "success";
        icon = <FaCheckCircle/>;
        break;
      case "Completed":
        variant = "success";
        icon = <FaFlag/>;
        break;
      default:
        break;
    }

    return (
      <Button 
        variant={variant}
        onClick={() => onUpdateStatus(nextStatus)}
        className="status-btn"
      >
        {icon} Mark as {nextStatus}
      </Button>
    );
  };

  return (
    <div className="active-delivery-container">
      <Card className="active-delivery-card">
        <Card.Header className="delivery-header">
          <div className="header-content">
            <h4><MdDeliveryDining /> Active Delivery #{delivery.orderId}</h4>
            <Badge bg="primary" className="delivery-badge">
              {delivery.status}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <StatusTimeline currentStatus={delivery.status} />
          
          <div className="delivery-details">
            <div className="detail-item">
              <RiUserLocationFill />
              <div>
                <h5>Customer Details</h5>
                <p className="customer-name">{delivery.customerName}</p>
                <p className="customer-address">{delivery.customerAddress}</p>
                <p className="customer-phone">{delivery.customerPhone}</p>
              </div>
            </div>
            <div className="detail-item">
              <BiPackage />
              <div>
                <h5>Order Details</h5>
                <p>Order #{delivery.orderId}</p>
                <p>{delivery.items?.length || 0} items</p>
              </div>
            </div>
          </div>
          
          <div className="action-section">
            {getCurrentStatusButton(delivery.status)}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

const AvailableDeliveriesCard = ({ deliveries, onAccept }) => (
  <Card className="available-deliveries-card">
    <Card.Header className="deliveries-header">
      <h4><BiPackage /> Available Orders</h4>
      <Badge bg="info">{deliveries.length} Orders</Badge>
    </Card.Header>
    <Card.Body>
      {deliveries.length === 0 ? (
        <div className="no-deliveries">
          <MdDeliveryDining size={48} />
          <p>No available deliveries at the moment</p>
        </div>
      ) : (
        <div className="deliveries-grid">
          {deliveries.map((delivery) => (
            <Card key={delivery._id} className="delivery-item">
              <Card.Body>
                <div className="delivery-item-header">
                  <h5>Order #{delivery.orderId}</h5>
                  <Badge bg="warning">{delivery.status}</Badge>
                </div>
                <div className="delivery-item-details">
                  <p><FaMapMarkerAlt /> {delivery.customerAddress}</p>
                  <p><FaUser /> {delivery.customerName}</p>
                </div>
                <Button
                  variant="success"
                  onClick={() => onAccept(delivery)}
                  className="accept-btn"
                >
                  <FaMotorcycle /> Accept Delivery
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Card.Body>
  </Card>
);

export default DriverDashboard;
