import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaUtensils, FaTruck, FaUserShield, FaSmile } from "react-icons/fa";
import MainScreen from "../../../components/MainScreen";
import "./aboutUs.css";

const AboutUsScreen = () => {
  const features = [
    {
      title: "Diverse Restaurant Selection",
      icon: <FaUtensils className="feature-icon" />,
      description: "Choose from hundreds of local restaurants offering a wide variety of cuisines."
    },
    {
      title: "Fast & Reliable Delivery",
      icon: <FaTruck className="feature-icon" />,
      description: "Our efficient delivery network ensures your food arrives hot and on time."
    },
    {
      title: "Secure Payments",
      icon: <FaUserShield className="feature-icon" />,
      description: "Multiple secure payment options to make your ordering experience hassle-free."
    },
    {
      title: "Customer Satisfaction",
      icon: <FaSmile className="feature-icon" />,
      description: "Our priority is your satisfaction, with responsive support and quality service."
    }
  ];

  return (
    <div className="aboutUsBackground">
      <MainScreen title={""}>
        <Container fluid className="about-container">
          {/* Hero Section */}
          <Row className="about-hero-section">
            <Col md={12} className="text-center">
              <h1 className="about-title">About MealRush</h1>
              <div className="title-underline"></div>
              <p className="about-subtitle">
                Connecting hungry people with the best restaurants since 2022
              </p>
            </Col>
          </Row>

          {/* Our Story Section */}
          <Row className="about-story-section">
            <Col lg={6} md={12} className="story-text">
              <h2 className="section-heading">Our Story</h2>
              <p>
                MealRush was founded in 2022 with a simple mission: to connect 
                hungry customers with their favorite restaurants while providing 
                an exceptional delivery experience.
              </p>
              <p>
                What started as a small startup in Colombo has now grown into 
                one of Sri Lanka's leading food delivery platforms, serving 
                thousands of customers daily across multiple cities.
              </p>
              <p>
                We're passionate about food, technology, and creating opportunities 
                for local restaurants and delivery partners. Our platform is built 
                on cutting-edge microservices architecture to ensure reliability, 
                scalability, and an outstanding user experience.
              </p>
            </Col>
            <Col lg={6} md={12} className="story-image">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/4341/4341769.png" 
                alt="MealRush Story" 
                className="about-img"
              />
            </Col>
          </Row>

          {/* Features Section */}
          <Row className="about-features-section">
            <Col xs={12}>
              <h2 className="section-heading text-center">Why Choose MealRush</h2>
            </Col>
            {features.map((feature, index) => (
              <Col key={index} md={3} sm={6} xs={12} className="mb-4">
                <Card className="feature-card">
                  <Card.Body>
                    <div className="feature-icon-container">
                      {feature.icon}
                    </div>
                    <Card.Title className="feature-title">{feature.title}</Card.Title>
                    <Card.Text>{feature.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Contact Section */}
          <Row className="about-contact-section">
            <Col xs={12}>
              <h2 className="section-heading text-center">Contact Us</h2>
            </Col>
            <Col md={4} className="contact-info">
              <div className="contact-card">
                <FaMapMarkerAlt className="contact-icon" />
                <h3>Address</h3>
                <p>Meal Rush Corporation,<br />Galle Road, Colombo</p>
              </div>
            </Col>
            <Col md={4} className="contact-info">
              <div className="contact-card">
                <FaPhone className="contact-icon" />
                <h3>Phone</h3>
                <p>077 7785441</p>
              </div>
            </Col>
            <Col md={4} className="contact-info">
              <div className="contact-card">
                <FaEnvelope className="contact-icon" />
                <h3>Email</h3>
                <p>meal-rush@gmail.com</p>
              </div>
            </Col>
          </Row>
        </Container>
      </MainScreen>
    </div>
  );
};

export default AboutUsScreen;