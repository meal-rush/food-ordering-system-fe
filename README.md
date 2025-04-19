# Food Ordering System - Frontend

This is the frontend of the Food Ordering System, a web application that allows users to browse menus, place orders, and manage their food delivery experience. The frontend is built using modern web technologies to ensure a seamless and responsive user experience.

## Features

- User-friendly interface for browsing food items.
- Add items to the cart and place orders.
- View order history and track current orders.
- Responsive design for mobile and desktop devices.
- Integration with backend APIs for real-time data.

## Technologies Used

- **Framework**: React.js
- **State Management**: Redux
- **Styling**: Material UI
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/meal-rush/food-ordering-system-fe.git
   cd food-ordering-system-fe
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and add the necessary API keys and configurations. 
   Example:
   ```
   REACT_APP_API_BASE_URL=http://localhost:5001/api
   ```

## Running the Application

To start the development server, run:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

## Building for Production

To create a production build, run:
```bash
npm run build
# or
yarn build
```

The build files will be generated in the `build` directory.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push the branch.
4. Open a pull request.
