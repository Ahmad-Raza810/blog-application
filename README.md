# 🚀 Content-Hub: Full-Stack Blogging Platform

A professional, high-performance blogging platform built with **Spring Boot 3.5**, **Java 21**, and **React 18**. This project demonstrates modern web development patterns, advanced security, and optimized data handling.

## ✨ Key Technical Features

- **🔐 Advanced Security**:
    - Stateless **JWT-based Authentication**.
    - Robust **Refresh Token mechanism** for persistent login.
    - Role-based Access Control (RBAC) with Spring Security.
- **⚡ Performance & Optimization**:
    - **Cursor-based Pagination**: Efficient data fetching for large datasets, avoiding deep-page performance hits.
    - **Caffeine Caching**: High-performance, near-cache implementation for frequently accessed data.
- **📝 Post & Content Management**:
    - Full CRUD for posts, categories, and tags.
    - **Post Cover Images**: Multipart file upload support.
    - **Smart Features**: Automatic reading time calculation.
- **🗄️ Database & Migrations**:
    - **MySQL Integration**: Reliable relational data storage.
    - **Flyway Migrations**: Seamless database schema evolution and version control.
    - **Complex Relationships**: Advanced entity modeling with One-to-Many and Many-to-Many associations.
- **🎨 Modern Frontend**:
    - Built with **React 18**, **TypeScript**, and **Vite**.
    - Styled with **Tailwind CSS** for a responsive, premium UI.

## 🛠️ Tech Stack

- **Backend**: Java 21, Spring Boot 3.5, Hibernate/JPA, MySQL, Flyway, Caffeine, JWT.
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite.

## 🚀 Getting Started

### Prerequisites
- JDK 21+
- Node.js 20+
- MySQL 8.0+

### Installation

1. **Database Setup**:
   Create a database named `blog_test` in MySQL.

2. **Backend Setup**:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   *Migrations will run automatically via Flyway on startup.*

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📊 Entity Relationships
<img width="900" height="800" alt="Entity Relationships" src="https://github.com/user-attachments/assets/f4d28a7e-1581-416e-804e-fb2beed9744d" />

---
Made with ❤️ by [Ahmad Raza]

