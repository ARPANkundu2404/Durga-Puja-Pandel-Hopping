# 🪔 Durga Puja Pandal Hopping 🪔

A web-based application designed to help users explore **Durga Puja pandals, nearby restaurants, location details, and metro/transport information** in Kolkata through a structured and easy-to-use interface.

🌐 **Live Project:** [https://durga-puja-pandel-hopping.onrender.com/](https://durga-puja-pandel-hopping.onrender.com/)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [System Flow](#️-system-flow-based-on-project-flowchart)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Overview

**Durga Puja Pandal Hopping** acts as a digital guide during the Durga Puja festival.  
The application is structured around a central **Home** page from which users can navigate to different modules such as:

- Pandal exploration (zone-wise)
- Nearby restaurants
- Location awareness
- Metro and transport guidance
- User authentication

The system follows a **simple and traditional flow**, ensuring clarity, maintainability, and usability.

---

## ⚙️ System Flow (Based on Project Flowchart)

### 🔹 Entry Point

- User enters the application → **Home Page**

### 🔹 Navigation (Navbar)

From the Home page, users can navigate to:

- Pandal
- Location
- Sign-in / Sign-up

---

### 🏛️ Pandal Module Flow

1.  Home → **Pandal**
2.  Pandal → **Zone Selection**
3.  Zone → **List of Pandals**
4.  Select a Pandal → **Pandal Details**
5.  Click Address Pin →
    - Fetch user location
    - Show **shortest route & direction** using Google Maps API

---

### 🍽️ Restaurant Module Flow

1.  Home → **Restaurant**
2.  Fetch user location
3.  Display **list of nearby restaurants**
4.  Select a restaurant → **Restaurant Details**
5.  Restaurant data fetched using Google Maps / location-based services

---

### 📍 Location Module

- Detects and displays the user's current location
- Helps other modules (Restaurant, Direction, Metro) work accurately

---

### 🚇 Metro Module

- Provides nearby:
  - Metro stations
  - Railway stations
  - Bus stops
- Displays accessible routes and transport information
- Informational and user-assist focused

---

### 🔐 Authentication Flow

1.  Home → Sign-in / Sign-up
2.  **Sign-in:**
    - Login with credentials
    - Option for **Forgot Password**
3.  **Sign-up:**
    - New user registration
4.  After authentication → Redirect back to Home

---

## 🎉 Features

- Responsive UI for mobile and desktop
- Zone-wise pandal browsing
- Detailed pandal information
- Location-based nearby restaurants
- Direction and route assistance
- Metro and transport information
- Authentication flow (Sign-in / Sign-up / Forgot Password)
- Clean and modular page structure

---

## 🖼️ Screenshots

### Desktop View

![Desktop Screenshot](https://res.cloudinary.com/dyr6oh3vg/image/upload/v1749886569/Screenshot_2025-06-14_123709_akxwqf.png)

### Mobile View

![Mobile Screenshot](https://res.cloudinary.com/dyr6oh3vg/image/upload/v1749886567/Screenshot_2025-06-14_123801_wwimu1.png)

---

## ⚡ Getting Started

### Prerequisites

- Node.js (v14 or above)
- npm or yarn

### Installation

````bash
git clone [https://github.com/ARPANkundu2404/Durga-Puja-Pandel-Hopping.git](https://github.com/ARPANkundu2404/Durga-Puja-Pandel-Hopping.git)
cd Durga-Puja-Pandel-Hopping
npm install
# or
yarn install
### Run Locally

```bash
npm start
# or
yarn start
Open in browser: `http://localhost:3000`

---

## 🚀 Usage
* **Home:** Central navigation hub
* **Pandal:** Browse pandals by zone and view details
* **Restaurant:** Find nearby food options using location
* **Location:** View current user location
* **Metro:** Check nearby metro, railway, and bus routes
* **Login:** Access authentication features

---

## 📁 Project Structure

```plaintext
Durga-Puja-Pandel-Hopping/
├── public/                 # Static files
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Home, Pandal, Restaurant, Metro, Auth pages
│   ├── data/               # Zone and pandal data
│   ├── context/            # Authentication & global state
│   ├── App.js              # Routing and layout
│   └── index.js            # Application entry point
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
## 🤝 Contributing
Contributions are welcome.

1. **Fork** the repository
2. **Create** a new branch
3. **Commit** your changes
4. **Open** a pull request

Please follow the existing structure and coding standards.

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 🙏 Credits
**Developed by Arpan Kundu** Inspired by the tradition of Durga Puja and built with modern web technologies.
````
