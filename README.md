# 🚀 Spring React Blog Platform

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.0-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A robust, full-stack blogging platform designed for developers and content creators. Built with a powerful **Spring Boot** backend and a dynamic **React** frontend, this project demonstrates modern web development practices, clean architecture, and secure authentication.

Whether you're looking to learn full-stack development, contribute to an open-source project, or build your own content hub, this platform provides a solid foundation.

## ✨ Key Features

- **🔐 Secure Authentication**: Stateless JWT-based authentication with Spring Security.
- **📝 Content Management**: comprehensive CRUD operations for posts, categories, and tags.
- **🏷️ Smart Organization**: Organize content with hierarchical categories and flexible tagging.
- **⏱️ Smart Features**: Automatic reading time calculation for articles.
- **🎨 Modern UI**: Responsive, mobile-first design using Tailwind CSS.
- **⚡ High Performance**: Optimized backend with JPA and fast React frontend powered by Vite.

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.4.0
- **Language**: Java 21
- **Database**: MySQL 8.0+ (Production), H2 (Testing)
- **Security**: Spring Security + JWT
- **ORM**: Spring Data JPA
- **Tools**: Lombok, MapStruct, Maven

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 🚀 Getting Started

Follow these steps to set up the project locally for development.

### Prerequisites

Ensure you have the following installed:
- **Java JDK 21** or later
- **Node.js v20** or later
- **MySQL 8.0** or later
- **Git**

### 1. Database Setup

Create a MySQL database for the application. You can use your preferred SQL client or command line:

```sql
CREATE DATABASE blog_db;
```

*Note: The application is configured to use `blog_user` with password `changemeinprod!`. You can update these in `src/main/resources/application.properties` or create a user with these credentials.*

### 2. Backend Setup

Navigate to the project root and build the backend:

```bash
# Clone the repository
git clone https://github.com/yourusername/blog-platform.git
cd blog-platform

# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

The backend API will start at `http://localhost:8080`.

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and start the development server:

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend application will be available at `http://localhost:5173`.

## 📚 API Documentation

The backend exposes a RESTful API. Here are some of the key endpoints:

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/login` | Authenticate user and receive JWT |

### User Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/user` | Get current user's profile (Requires Auth) |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/posts` | List all published posts |
| `GET` | `/api/v1/posts/{id}` | Get a specific post by ID |
| `POST` | `/api/v1/posts` | Create a new post (Requires Auth) |
| `PUT` | `/api/v1/posts/{id}` | Update an existing post (Requires Auth) |
| `DELETE` | `/api/v1/posts/{id}` | Delete a post (Requires Auth) |

### Categories & Tags
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/categories` | List all categories |
| `GET` | `/api/v1/tags` | List all tags |

*For a full list of endpoints, refer to the controller classes in `src/main/java/com/projects/blog_application/controllers`.*

## 🤝 Contributing

We love contributions! Here's how you can help make this project better:

1.  **Fork** the repository.
2.  Create a new **Branch** for your feature or bug fix (`git checkout -b feature/amazing-feature`).
3.  **Commit** your changes (`git commit -m 'Add some amazing feature'`).
4.  **Push** to the branch (`git push origin feature/amazing-feature`).
5.  Open a **Pull Request**.

Please ensure your code follows the existing style and passes all tests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Ahmad Raza]
