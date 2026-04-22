# ⚡ ATHUKORALA INDUSTRIAL OS (v2.0)
> **An Advanced, ML Enhanced Enterprise Resource Planning (ERP) System for Modern Hardware Commerce.**

<p align="center">
  <img src="https://capsule-render.vercel.app/render?type=soft&color=D4AF37&height=200&section=header&text=ATHUKORALA%20OS&fontSize=70&fontColor=000000&animation=fadeIn" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.2-green?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/MySQL-8.0-orange?style=for-the-badge&logo=mysql" />
  <img src="https://img.shields.io/badge/Security-JWT%20%2B%20BCrypt-red?style=for-the-badge" />
</p>

---

## 🚀 PROJECT OVERVIEW
The **Athukorala Industrial OS** is a sophisticated, dark-themed management ecosystem engineered for the hardware industry. It provides a seamless, real-time interface for **Administrators**, **Operational Staff**, and **Market Clients** to manage high-volume inventory and smart fiscal protocols.

---

## 🧠 INTELLIGENCE LAYER: AI/ML DEMAND PREDICTION
We have integrated a Python-based AI microservice to transform static data into predictive intelligence.
* **📈 Demand Forecasting:** Uses past sales data to predict required stock for the upcoming month.
* **⚖️ Classification Model:** Automatically decides if a product requires restocking (YES/NO).
* **🎯 Regression Model:** Predicts the exact number of units to order based on projected demand.
* **💰 Discount Optimization:** ML identifies overstock items and suggests discount strategies to clear slow-moving inventory.

---

## 🛠️ CORE OPERATIONAL MODULES (6-CRUD ARCHITECTURE)

### 1. User Accounts & Identity Registry
* **Secure Auth:** Implements JWT-based authentication with BCrypt password encryption.
* **Role-Based Dashboards:** Distinct interfaces for Admin, Staff, and Customer identities.
* **Profile Config:** Full CRUD for managing personal credentials, addresses, and secure sessions.

### 2. Product Catalog & Asset Registry
* **Asset CRUD:** Comprehensive management of product names, descriptions, and high-res visuals.
* **Categorization:** Advanced organizational logic for Electrical, Plumbing, Painting, and Power Tools.
* **Premium Browsing:** High-performance filtering by brand, category, and real-time price ranges.

### 3. Inventory & Stock Management
* **Delta Sync:** Specialized "+ / -" increment protocol for rapid physical stock adjustments.
* **Low-Stock Intelligence:** Automated visual alerts triggered when stock hits reorder thresholds.
* **Audit Trail:** Every movement (In/Out/Adjust) is logged with a timestamp and staff signature.

### 4. Discount & Promotion Management
* **Smart Valuation:** CRUD for percentage and fixed-amount discounts across products or categories.
* **Temporal Control:** Set automated start and end dates for promotion visibility.
* **Live Price Sync:** Discounts reflect instantly in the Market Registry and Curated Lists.

### 5. Orders & Payments Management
* **Transaction Flow:** End-to-end purchasing registry from Cart management to Checkout.
* **Payment Simulation:** Secure recording of payment status (Paid, Pending, Failed).
* **Curated Archives:** "Wishlist" feature allowing customers to track assets and price drops.

### 6. Admin Command & Monitoring
* **Fiscal Intelligence:** Executive dashboard showing Total Sales, Revenue Trends, and KPI cards.
* **Broadcast Hub:** Dual communication system for Staff internal notices and Customer alerts.
* **Audit Registry:** A permanent, live feed of all administrative system integrity logs.



## 🎬 SYSTEM INITIALIZATION

### Backend (Java Engine)
```bash
cd athukorala-backend
mvn spring-boot:run
```

## 🔒 SECURITY PROTOCOL

- **JWT Token Security:** Tokens have short expiration times and are strictly verified on every API request.  
- **Zero-Inference RBAC:** Backend verifies roles before granting access to sensitive business endpoints.  
- **Data Integrity:** Protection against SQL Injection and unauthorized registry access.  

---

## 👨‍💻 CORE ARCHITECT

**ThevinduDha and Team**

- 🎓 Data Science Undergraduates  
- 🌍 Sri Lanka  
- 🛠️ Specialized in DevOps & Smart ERP Development  

### 👥 Team Members
- ThevinduDha  
- Dinuli  
- Dulashee  
- Bashitha  
- Hirunima  
- Ashini  

<p align="center">
  <img src="https://capsule-render.vercel.app/render?type=waving&color=D4AF37&height=100&section=footer" />
</p>

---
