# 🪔 Alor Shohor – Puja Navigator 🪔  

### (Durga Puja Pandal Hopping System)

A **full-stack, role-based web application** designed to help users explore Durga Puja pandals, plan routes efficiently, and access nearby services like restaurants and transport — all with a **secure RBAC system and real-time navigation**.

🌐 **Live App:**  
https://durga-puja-pandel-hopping-app.onrender.com

---

## 📖 Table of Contents

- Overview  
- System Architecture  
- Workflow Diagram  
- Features  
- Role-Based Access (RBAC)  
- Tech Stack  
- Getting Started  
- Usage  
- Project Structure  
- Future Scope  
- Challenges  
- Contributing  
- License  

---

## ✨ Overview

Durga Puja is one of the largest festivals in India, where thousands of pandals are spread across cities.

**Alor Shohor – Puja Navigator** provides a centralized platform where:

- Users explore verified pandals  
- Authorities manage pandal data  
- Admins ensure data authenticity  

The system follows a **moderated architecture**, ensuring only approved and trusted data reaches end users.

---

## 🧩 System Architecture

Frontend (React.js)
↓
Backend (Spring Boot + JWT Security)
↓
Database (PostgreSQL)

---

### 🔍 Description

- **Frontend** → UI, routing, API calls  
- **Backend** → Business logic, RBAC, authentication  
- **Database** → Stores users, pandals, ownership, status  

---

## 🔁 Workflow Diagram

![Workflow Diagram](https://res.cloudinary.com/dyr6oh3vg/image/upload/v1774354550/mermaid-diagram_bk2qci.png)

---

## 👥 Role-Based System (RBAC)

The system is built on **JWT-based Role-Based Access Control**:

| Role | Description |
|------|------------|
| USER | Explore approved pandals |
| AUTHORITY | Create & manage pandals |
| ADMIN | Approve / reject pandals |

👉 **RBAC enforced using JWT (ROLE_USER / ROLE_AUTHORITY / ROLE_ADMIN)**

---

## 🚀 Features

### 👤 USER FEATURES

- View only **approved pandals**
- Explore pandals zone-wise  
- Navigate to:
  - 🏮 Pandals  
  - 🍽️ Restaurants  
  - 🚇 Transport  
- Map-based exploration  

---

### 🏢 AUTHORITY PANEL

- Create pandal request  
- View own pandals  
- Edit / delete own pandals  

#### 🔐 Ownership Logic

- Each pandal is linked to its creator  
- Only the owner can modify it  

---

### 🛠️ ADMIN PANEL

- View pending pandal requests  
- Approve pandals → visible to users  
- Reject pandals → deleted from database  
- Maintain system integrity  

---

### 🔐 AUTHENTICATION SYSTEM

- Sign Up / Login  
- JWT-based authentication  
- Role extracted from token  
- Protected routes  

---

### 📍 UNIFIED NAVIGATION SYSTEM

Navigation works across:
- Pandals  
- Restaurants  
- Transport  

#### 🔁 Flow:

1. User selects location  
2. System checks authentication  
3. Fetch user location  
4. Google Maps API  
5. Show shortest route  

👉 **Navigation is only enabled for authenticated users**

---

## 🖼️ Screenshots

### Desktop View

![Desktop Screenshot](https://res.cloudinary.com/dyr6oh3vg/image/upload/v1749886569/Screenshot_2025-06-14_123709_akxwqf.png)

### Mobile View

![Mobile Screenshot](https://res.cloudinary.com/dyr6oh3vg/image/upload/v1749886567/Screenshot_2025-06-14_123801_wwimu1.png)

---

## 🔄 System Workflow (Important)

### 🏢 Authority Flow

- Submit pandal → stored as **PENDING**
- Linked with `createdBy`
- Can only manage own pandals  

---

### 🛠️ Admin Flow

- Reviews pending pandals  
- Approve → visible to users  
- Reject → permanently deleted  

---

### 👤 User Flow

- Access only **approved pandals**  
- Navigation available after login  

---

## ⚙️ Tech Stack

### 🖥️ Frontend

- React.js  
- Tailwind CSS  
- Framer Motion  
- JavaScript  
- Lucide Icons  

### ⚙️ Backend

- Spring Boot  
- JWT Authentication (RBAC)  
- Swagger & Postman  

### 🗄️ Database

- PostgreSQL  
*(Migrated from MySQL)*  

### 🚀 Deployment

- Docker  
- Render  

---

## ⚡ Getting Started

### Prerequisites

- Node.js  
- Java (Spring Boot)  
- PostgreSQL  

---

### Installation

```bash
git clone https://github.com/ARPANkundu2404/Durga-Puja-Pandel-Hopping.git
cd Durga-Puja-Pandel-Hopping
```

#### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Run Backend

```bash
cd backend
mvn spring-boot:run
```

---

## 🚀 Usage

Home → Central navigation
Pandal → Explore pandals
Restaurant → Nearby suggestions
Transport → Metro & routes
Login → Access secure features

---

## 📁 Project Structure

```plaintext

frontend/
├── components/
├── pages/
├── context/
├── utils/

backend/
├── controller/
├── service/
├── repository/
├── entity/
├── security/

```

---

## 🧠 Future Enhancements

🤖 AI-based route optimization
🗺️ Personalized pandal planning
🍽️ Smart restaurant recommendations
📊 Crowd analysis
📶 Offline support

---

## ⚠️ Challenges Faced

Free API limitations
MySQL → PostgreSQL migration
Deployment issues
JWT inconsistencies (403 errors)
Designing RBAC system

---

## 🤝 Contributing

Fork the repo
Create a branch
Commit changes
Open PR

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🙏 Credits

Developed by Arpan Kundu
Inspired by the spirit of Durga Puja and built with modern web technologies.