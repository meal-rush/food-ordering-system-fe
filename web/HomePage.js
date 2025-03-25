import React from "react";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Welcome to Foodie's Paradise</h1>
        <p>Order your favorite meals with ease!</p>
      </header>
      <section className="home-content">
        <button className="order-now-btn">Order Now</button>
      </section>
      <section className="featured-meals">
        <h2>Featured Meals</h2>
        <div className="meal-list">
          <div className="meal-item">
            <img src="meal1.jpg" alt="Meal 1" />
            <p>Delicious Pizza</p>
          </div>
          <div className="meal-item">
            <img src="meal2.jpg" alt="Meal 2" />
            <p>Spicy Burger</p>
          </div>
          <div className="meal-item">
            <img src="meal3.jpg" alt="Meal 3" />
            <p>Fresh Salad</p>
          </div>
        </div>
      </section>
      <footer className="home-footer">
        <p>&copy; 2023 Foodie's Paradise. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
