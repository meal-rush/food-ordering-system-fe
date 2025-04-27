import axios from "axios";
import swal from "sweetalert";
import { API_ENDPOINT } from "../../config";
import {
  DRIVER_LOGIN_REQUEST,
  DRIVER_LOGIN_SUCCESS,
  DRIVER_LOGIN_FAIL,
  DRIVER_LOGOUT,
  DRIVER_REGISTER_REQUEST,
  DRIVER_REGISTER_SUCCESS,
  DRIVER_REGISTER_FAIL,
  DRIVER_UPDATE_STATUS_REQUEST,
  DRIVER_UPDATE_STATUS_SUCCESS,
  DRIVER_UPDATE_STATUS_FAIL,
  DRIVER_UPDATE_LOCATION_REQUEST,
  DRIVER_UPDATE_LOCATION_SUCCESS,
  DRIVER_UPDATE_LOCATION_FAIL,
} from "../../constants/driverManagementConstants/driverConstants";

export const driverLogin = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: DRIVER_LOGIN_REQUEST });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${API_ENDPOINT}/drivers/driver/login`,
      { email, password },
      config
    );

    if (data.error) {
      throw new Error(data.error);
    }

    dispatch({ type: DRIVER_LOGIN_SUCCESS, payload: data });
    
    swal({
      title: "Success!",
      text: "Welcome back! Login successful",
      icon: "success",
      timer: 2000,
      button: false,
    });

    localStorage.setItem("driverInfo", JSON.stringify(data));
    
    setTimeout(() => {
      window.location.href = "/driver-dashboard";
    }, 2000);
  } catch (error) {
    dispatch({
      type: DRIVER_LOGIN_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    
    swal({
      title: "Error!",
      text: error.response?.data?.message || error.message,
      icon: "error",
      button: "Ok",
    });
  }
};

export const driverRegister = (name, email, phone, vehicle, license, password) => async (dispatch) => {
  try {
    dispatch({ type: DRIVER_REGISTER_REQUEST });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${API_ENDPOINT}/drivers/driver/register`,
      { name, email, phone, vehicle, license, password },
      config
    );

    dispatch({ type: DRIVER_REGISTER_SUCCESS, payload: data });

    swal({
      title: "Success!",
      text: "Driver Registration Successful",
      icon: "success",
      timer: 2000,
      button: false,
    });

    setTimeout(() => {
      window.location.href = "/driver-login";
    }, 2000);
  } catch (error) {
    dispatch({
      type: DRIVER_REGISTER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const driverLogout = () => (dispatch) => {
  localStorage.removeItem("driverInfo");
  dispatch({ type: DRIVER_LOGOUT });
  window.location.href = "/";
};

export const updateDeliveryStatus = (deliveryId, status) => async (dispatch, getState) => {
  try {
    dispatch({ type: DRIVER_UPDATE_STATUS_REQUEST });

    const {
      driver_Login: { driverInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${driverInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `${API_ENDPOINT}/deliveries/delivery/get/${deliveryId}`,
      { 
        status,
        driverId: driverInfo._id,
        driverName: driverInfo.name,
        driverPhone: driverInfo.phone,
        driverVehicle: driverInfo.vehicle,
        assignedAt: new Date().toISOString()
      },
      config
    );

    dispatch({ type: DRIVER_UPDATE_STATUS_SUCCESS, payload: data });

    const statusMessages = {
      'Driver Assigned': 'You have accepted this delivery',
      'Driver Arrived at Restaurant': 'Marked as arrived at restaurant',
      'Picked Up': 'Order picked up successfully',
      'On the Way': 'Status updated - On the way to customer',
      'Arrived': 'Marked as arrived at customer location',
      'Completed': 'Delivery completed successfully'
    };

    swal({
      title: "Status Updated!",
      text: statusMessages[status] || "Status updated successfully",
      icon: "success",
      timer: 2000,
      button: false,
    });

    return data;
  } catch (error) {
    dispatch({
      type: DRIVER_UPDATE_STATUS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updateDeliveryLocation = (deliveryId, location) => async (dispatch, getState) => {
  try {
    dispatch({ type: DRIVER_UPDATE_LOCATION_REQUEST });

    const {
      driver_Login: { driverInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${driverInfo.token}`,
      },
    };

    await axios.put(
      `${API_ENDPOINT}/deliveries/${deliveryId}/update-location`,
      { location },
      config
    );

    dispatch({ type: DRIVER_UPDATE_LOCATION_SUCCESS });
  } catch (error) {
    dispatch({
      type: DRIVER_UPDATE_LOCATION_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
