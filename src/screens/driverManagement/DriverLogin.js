import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { driverLogin } from "../../actions/driverManagementActions/driverActions";
import LoginForm from "../userManagement/login/LoginForm";

const DriverLogin = ({ history }) => {
  const dispatch = useDispatch();
  const driver_Login = useSelector((state) => state.driver_Login);
  const { loading, error, driverInfo } = driver_Login;

  useEffect(() => {
    if (driverInfo) {
      history.push("/driver-dashboard");
    }
  }, [history, driverInfo]);

  const submitHandler = (email, password) => {
    dispatch(driverLogin(email, password));
  };

  return (
    <LoginForm
      title="Delivery Partner Login"
      userType="Driver" 
      loading={loading}
      error={error}
      onSubmit={submitHandler}
      logoSrc="https://cdn-icons-png.flaticon.com/512/2830/2830305.png"
    />
  );
};

export default DriverLogin;
