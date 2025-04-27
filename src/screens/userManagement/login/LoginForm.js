import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col, Alert } from "react-bootstrap";
import { FaEnvelope, FaLock, FaSignInAlt, FaArrowLeft } from "react-icons/fa";
import Loading from "../../../components/Loading";
import "./LoginScreen.css";

const LoginForm = ({ 
  title, 
  userType, 
  loading, 
  error, 
  onSubmit, 
  logoSrc 
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password, userType);
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={6} md={8} sm={12}>
            <Card className="login-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <img 
                    src={logoSrc || "https://cdn-icons-png.flaticon.com/512/4039/4039232.png"} 
                    alt={`${userType} Login`} 
                    className="login-logo"
                  />
                  <h2 className="login-title">{title}</h2>
                  <p className="login-subtitle">Enter your credentials to access your account</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                
                {loading ? (
                  <Loading />
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="form-group">
                      <div className="input-icon-wrapper">
                        <FaEnvelope className="input-icon" />
                        <Form.Control
                          type="email"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="input-with-icon"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <div className="input-icon-wrapper">
                        <FaLock className="input-icon" />
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="input-with-icon"
                        />
                      </div>
                    </Form.Group>

                    <Row className="align-items-center mb-4">
                      <Col>
                        <Form.Check
                          type="checkbox"
                          id="rememberMe"
                          label="Remember me"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="remember-me"
                        />
                      </Col>
                      <Col className="text-end">
                        <a href="/forgot-password" className="forgot-password">
                          Forgot password?
                        </a>
                      </Col>
                    </Row>

                    <Button 
                      variant="primary" 
                      type="submit" 
                      className={`login-btn ${userType.toLowerCase()}-login-btn`}
                    >
                      <FaSignInAlt className="me-2" /> Login
                    </Button>

                    {userType === "Customer" && (
                      <div className="text-center mt-3">
                        <p className="mb-0">
                          Don't have an account? <a href="/register" className="signup-link">Sign up</a>
                        </p>
                      </div>
                    )}
                  </Form>
                )}
              </Card.Body>
            </Card>

            <div className="back-link text-center mt-3">
              <a href="/" className="btn btn-outline-secondary btn-sm">
                <FaArrowLeft className="me-1" /> Back to Selection
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginForm;