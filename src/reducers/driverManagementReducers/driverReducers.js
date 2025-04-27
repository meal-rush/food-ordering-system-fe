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
} from "../../constants/driverManagementConstants/driverConstants";

export const driverLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case DRIVER_LOGIN_REQUEST:
      return { loading: true };
    case DRIVER_LOGIN_SUCCESS:
      return { loading: false, driverInfo: action.payload };
    case DRIVER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case DRIVER_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const driverRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case DRIVER_REGISTER_REQUEST:
      return { loading: true };
    case DRIVER_REGISTER_SUCCESS:
      return { loading: false, driverInfo: action.payload };
    case DRIVER_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const driverUpdateStatusReducer = (state = {}, action) => {
  switch (action.type) {
    case DRIVER_UPDATE_STATUS_REQUEST:
      return { loading: true };
    case DRIVER_UPDATE_STATUS_SUCCESS:
      return { loading: false, success: true };
    case DRIVER_UPDATE_STATUS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
