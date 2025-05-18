import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import MainScreen from "../../../components/MainScreen";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import "./contactUs.css";

const ContactScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setShowAlert(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setValidated(false);
      setIsSubmitting(false);
      
      // Hide alert after 5 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="contactScreen">
      <MainScreen title="">
        <Container fluid>
          {/* Hero Section */}
          <Row className="contact-hero-section">
            <Col md={12} className="text-center">
              <h1 className="contact-title">Get in Touch</h1>
              <p className="contact-subtitle">
                We'd love to hear from you! Whether you have a question about our services,
                need help with an order, or want to join our team, we're here to help.
              </p>
            </Col>
          </Row>

          {/* Contact Information Section */}
          <Row className="contact-info-section">
            <Col lg={4} md={6} sm={12} className="contact-info-col">
              <Card className="contact-info-card">
                <Card.Body>
                  <div className="contact-icon-container">
                    <FaMapMarkerAlt size={30} />
                  </div>
                  <Card.Title>Our Location</Card.Title>
                  <Card.Text>
                    Meal Rush Corporation<br />
                    Galle Road, Colombo
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} md={6} sm={12} className="contact-info-col">
              <Card className="contact-info-card">
                <Card.Body>
                  <div className="contact-icon-container">
                    <FaPhoneAlt size={30} />
                  </div>
                  <Card.Title>Phone Number</Card.Title>
                  <Card.Text>
                    <a href="tel:0777785441" className="contact-link">077 7785441</a>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} md={12} sm={12} className="contact-info-col">
              <Card className="contact-info-card">
                <Card.Body>
                  <div className="contact-icon-container">
                    <FaEnvelope size={30} />
                  </div>
                  <Card.Title>Email Address</Card.Title>
                  <Card.Text>
                    <a href="mailto:meal-rush@gmail.com" className="contact-link">meal-rush@gmail.com</a>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Form and Map Section */}
          <Row className="contact-form-section">
            <Col lg={6} md={12} className="mb-4 mb-lg-0">
              <Card className="contact-form-card">
                <Card.Body>
                  <Card.Title className="form-title">Send us a Message</Card.Title>
                  
                  {showAlert && (
                    <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                      Thank you for your message! We will get back to you shortly.
                    </Alert>
                  )}
                  
                  <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formName">
                      <Form.Label>Your Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide your name.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid email address.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formSubject">
                      <Form.Label>Subject</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a subject.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formMessage">
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Your message..."
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your message.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button 
                      type="submit" 
                      className="contact-submit-btn" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6} md={12}>
              <Card className="contact-map-card">
                <Card.Body>
                  <Card.Title className="map-title">Our Location</Card.Title>
                  <div className="map-container">
                    <iframe
                      title="MealRush Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.80385596283!2d79.82168693446984!3d6.921833369203988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1650915687870!5m2!1sen!2sus"
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Social Media Section */}
          <Row className="social-media-section">
            <Col md={12} className="text-center">
              <h3 className="social-title">Connect With Us</h3>
              <div className="social-icons">
                <a href="#!" className="social-icon">
                  <FaFacebook size={30} />
                </a>
                <a href="#!" className="social-icon">
                  <FaTwitter size={30} />
                </a>
                <a href="#!" className="social-icon">
                  <FaInstagram size={30} />
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </MainScreen>
    </div>
  );
};

export default ContactScreen;