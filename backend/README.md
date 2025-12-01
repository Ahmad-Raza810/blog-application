  # Blog Platform API

  A modern, full-featured blog platform built with Spring Boot 3.4.0, offering robust content management capabilities with JWT authentication, category organization, and flexible tagging system.

  ## 🚀 Features

  - **User Authentication & Authorization**: JWT-based stateless authentication
  - **Post Management**: Create, read, update, and delete blog posts with draft/published states
  - **Category System**: Organize content into hierarchical categories
  - **Flexible Tagging**: Multi-tag support for granular content classification
  - **Reading Time Calculation**: Automatic estimation of article reading duration
  - **RESTful API**: Clean, well-structured endpoints following REST principles
  - **Data Validation**: Comprehensive input validation with meaningful error messages

  ## 📋 Prerequisites

  Before you begin, ensure you have the following installed:

  - **Java**: JDK 21 or later
  - **Maven**: 3.6+ (bundled with project via Maven Wrapper)
  - **Docker**: Latest version (for running MySQL)
  - **Node.js**: v20+ (optional, for frontend)

  ## 🛠️ Tech Stack

  ### Backend
  - **Framework**: Spring Boot 3.4.0
  - **Security**: Spring Security with JWT (JJWT 0.11.5)
  - **Database**: MySQL with Spring Data JPA
  - **Validation**: Jakarta Validation API
  - **Mapping**: MapStruct 1.6.3
  - **Utilities**: Lombok 1.18.36

  ### Database
  - **Primary**: MySQL 8.0+
  - **Testing**: H2 (in-memory)

  ## 📦 Installation & Setup

  ### 1. Clone the Repository

  ```bash
  git clone <repository-url>
  cd blog-platform
  ```

  ### 2. Set Up MySQL Database

  Create a `docker-compose.yml` file in the project root:

  ```yaml
  services:
    mysql:
      image: mysql:8.0
      container_name: blog-mysql
      ports:
        - "3306:3306"
      restart: always
      environment:
        MYSQL_ROOT_PASSWORD: rootpassword
        MYSQL_DATABASE: blog_db
        MYSQL_USER: blog_user
        MYSQL_PASSWORD: changemeinprod!
      volumes:
        - mysql_data:/var/lib/mysql

    # Optional: Database management interface
    phpmyadmin:
      image: phpmyadmin:latest
      container_name: blog-phpmyadmin
      restart: always
      ports:
        - "8888:80"
      environment:
        PMA_HOST: mysql
        PMA_PORT: 3306
        MYSQL_ROOT_PASSWORD: rootpassword

  volumes:
    mysql_data:
  ```

  Start the database:

  ```bash
  docker-compose up -d
  ```

  Access phpMyAdmin at `http://localhost:8888` with:
  - **Server**: mysql
  - **Username**: blog_user (or root)
  - **Password**: changemeinprod! (or rootpassword for root)

  ### 3. Configure Application Properties

  Update `src/main/resources/application.properties`:

  ```properties
  # Server Configuration
  server.port=8080

  # MySQL Database Connection
  spring.datasource.url=jdbc:mysql://localhost:3306/blog_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
  spring.datasource.username=blog_user
  spring.datasource.password=changemeinprod!
  spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

  # JPA/Hibernate Configuration
  spring.jpa.hibernate.ddl-auto=update
  spring.jpa.show-sql=true
  spring.jpa.properties.hibernate.format_sql=true
  spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
  spring.jpa.open-in-view=false

  # JWT Configuration
  jwt.secret=your-256-bit-secret-key-here-make-it-at-least-32-bytes-long-change-this-in-production

  # Logging
  logging.level.com.devtiro.blog=DEBUG
  logging.level.org.springframework.security=DEBUG
  ```

  ⚠️ **Important**: Change the JWT secret and database credentials in production!

  ### 4. Build the Project

  ```bash
  # Windows
  .\mvnw clean install

  # macOS/Linux
  ./mvnw clean install
  ```

  ### 5. Run the Application

  ```bash
  # Windows
  .\mvnw spring-boot:run

  # macOS/Linux
  ./mvnw spring-boot:run
  ```

  The API will be available at `http://localhost:8080`

  ## 🧪 Running Tests

  The application uses H2 in-memory database for testing, no MySQL required:

  ```bash
  # Run all tests
  ./mvnw test

  # Run with coverage
  ./mvnw clean test jacoco:report
  ```

  Test configuration is automatically loaded from `src/test/resources/application.properties`.

  ## 📚 API Documentation

  ### Base URL
  ```
  http://localhost:8080/api/v1
  ```

  ### Authentication

  #### Register/Login
  ```http
  POST /api/v1/auth/login
  Content-Type: application/json

  {
    "email": "user@test.com",
    "password": "password"
  }

  Response:
  {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 86400
  }
  ```

  **Default Test User**:
  - Email: `user@test.com`
  - Password: `password`

  ### Categories

  #### List All Categories
  ```http
  GET /api/v1/categories
  ```

  #### Create Category
  ```http
  POST /api/v1/categories
  Authorization: Bearer <token>
  Content-Type: application/json

  {
    "name": "Technology"
  }
  ```

  #### Delete Category
  ```http
  DELETE /api/v1/categories/{id}
  Authorization: Bearer <token>
  ```

  ### Tags

  #### List All Tags
  ```http
  GET /api/v1/tags
  ```

  #### Create Tags
  ```http
  POST /api/v1/tags
  Authorization: Bearer <token>
  Content-Type: application/json

  {
    "names": ["spring-boot", "java", "tutorial"]
  }
  ```

  #### Delete Tag
  ```http
  DELETE /api/v1/tags/{id}
  Authorization: Bearer <token>
  ```

  ### Posts

  #### List Published Posts
  ```http
  GET /api/v1/posts
  GET /api/v1/posts?categoryId={categoryId}
  GET /api/v1/posts?tagId={tagId}
  GET /api/v1/posts?categoryId={categoryId}&tagId={tagId}
  ```

  #### Get Single Post
  ```http
  GET /api/v1/posts/{id}
  ```

  #### List Draft Posts (Authenticated)
  ```http
  GET /api/v1/posts/drafts
  Authorization: Bearer <token>
  ```

  #### Create Post
  ```http
  POST /api/v1/posts
  Authorization: Bearer <token>
  Content-Type: application/json

  {
    "title": "Getting Started with Spring Boot",
    "content": "Spring Boot makes it easy to create stand-alone...",
    "categoryId": "uuid-here",
    "tagIds": ["uuid-1", "uuid-2"],
    "status": "DRAFT"
  }
  ```

  #### Update Post
  ```http
  PUT /api/v1/posts/{id}
  Authorization: Bearer <token>
  Content-Type: application/json

  {
    "id": "post-uuid",
    "title": "Updated Title",
    "content": "Updated content...",
    "categoryId": "uuid-here",
    "tagIds": ["uuid-1", "uuid-2"],
    "status": "PUBLISHED"
  }
  ```

  #### Delete Post
  ```http
  DELETE /api/v1/posts/{id}
  Authorization: Bearer <token>
  ```

  ## 🏗️ Project Structure

  ```
  src/main/java/com/devtiro/blog/
  ├── config/              # Configuration classes (Security, etc.)
  ├── controllers/         # REST API endpoints
  ├── domain/
  │   ├── entities/        # JPA entities
  │   ├── dtos/            # Data Transfer Objects
  │   └── PostStatus.java  # Enums
  ├── mappers/             # MapStruct mappers
  ├── repositories/        # Spring Data JPA repositories
  ├── security/            # Security components (JWT filter, UserDetails)
  └── services/            # Business logic
      └── impl/            # Service implementations
  ```

  ## 🔐 Security Features

  - **JWT Authentication**: Stateless authentication with 24-hour token expiration
  - **Password Encryption**: BCrypt password encoding with DelegatingPasswordEncoder
  - **Role-Based Access**: ROLE_USER for authenticated operations
  - **Public Endpoints**: GET requests for posts, categories, and tags are publicly accessible
  - **Protected Operations**: Creating, updating, and deleting content requires authentication

  ## 🗄️ Database Schema

  ### Main Tables
  - **users**: User accounts with encrypted passwords
  - **posts**: Blog posts with content, status, and metadata
  - **categories**: Content categories
  - **tags**: Flexible content tags
  - **post_tags**: Many-to-many relationship between posts and tags

  ### Relationships
  - User → Posts (One-to-Many)
  - Category → Posts (One-to-Many)
  - Post ↔ Tags (Many-to-Many)

  ## 🚦 Error Handling

  The API returns consistent error responses:

  ```json
  {
    "status": 400,
    "message": "Category already exists with name: Technology",
    "errors": [
      {
        "field": "name",
        "message": "Validation failed"
      }
    ]
  }
  ```

  ### HTTP Status Codes
  - `200 OK`: Successful GET/PUT requests
  - `201 Created`: Successful POST requests
  - `204 No Content`: Successful DELETE requests
  - `400 Bad Request`: Validation errors
  - `401 Unauthorized`: Authentication required
  - `404 Not Found`: Resource not found
  - `409 Conflict`: Business rule violation
  - `500 Internal Server Error`: Unexpected errors

  ## 🎨 Frontend Setup (Optional)

  If you have the React frontend:

  ```bash
  cd frontend
  npm install
  npm run dev
  ```

  Access at `http://localhost:5173`

  ## 🔧 Development Tips

  ### Hot Reload
  Use Spring Boot DevTools for automatic restarts:
  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-devtools</artifactId>
      <scope>runtime</scope>
  </dependency>
  ```

  ### Database Debugging
  - View SQL queries: `spring.jpa.show-sql=true`
  - Access phpMyAdmin: `http://localhost:8888`
  - Check logs: `logging.level.org.hibernate.SQL=DEBUG`

  ### Testing Endpoints
  Use tools like:
  - Postman
  - Insomnia
  - cURL
  - HTTPie

  Example with cURL:
  ```bash
  # Login
  curl -X POST http://localhost:8080/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"user@test.com","password":"password"}'

  # Get posts
  curl http://localhost:8080/api/v1/posts
  ```

  ## 🐛 Troubleshooting

  ### Port Already in Use
  ```bash
  # Change server.port in application.properties
  server.port=8081
  ```

  ### MySQL Connection Failed
  ```bash
  # Check if MySQL is running
  docker ps

  # View MySQL logs
  docker logs blog-mysql

  # Restart containers
  docker-compose restart
  ```

  ### Build Failures
  ```bash
  # Clean and rebuild
  ./mvnw clean install -DskipTests

  # Update dependencies
  ./mvnw dependency:resolve
  ```

  ## 📝 Environment Variables

  For production deployment, use environment variables:

  ```bash
  export SPRING_DATASOURCE_URL=jdbc:mysql://prod-host:3306/blog_db
  export SPRING_DATASOURCE_USERNAME=blog_user
  export SPRING_DATASOURCE_PASSWORD=secure-password
  export JWT_SECRET=production-secret-key-at-least-32-bytes
  ```

  ## 🚀 Production Deployment

  ### Considerations
  1. **Change JWT Secret**: Use a strong, unique secret key
  2. **Database Credentials**: Use secure passwords
  3. **HTTPS**: Enable SSL/TLS certificates
  4. **CORS Configuration**: Restrict allowed origins
  5. **Rate Limiting**: Implement API rate limiting
  6. **Logging**: Configure appropriate log levels
  7. **Monitoring**: Add health checks and metrics

  ### Build for Production
  ```bash
  ./mvnw clean package -DskipTests
  java -jar target/blog-0.0.1-SNAPSHOT.jar
  ```

  # Contributing to Blog Platform API

Thank you for your interest in contributing! We welcome all contributions from the community.


### Prerequisites

- Java JDK 21+
- Maven 3.6+ (or use Maven Wrapper)
- Git

### Setup

1. **Fork and clone**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/blog-platform.git
   cd blog-platform
   ```

2. **Add upstream**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL-OWNER/blog-platform.git
   ```

3. **Install and run**:
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

## 🔄 Development Workflow

### Branch Naming

- **Feature**: `feature/add-comment-system`
- **Bug fix**: `fix/post-creation-validation`
- **Docs**: `docs/update-api-examples`

```bash
git checkout -b feature/your-feature-name
```

### Making Changes

1. Create a branch from `main`
2. Make your changes with clear commits
3. Push and create a pull request

## 💻 Coding Standards

### Java Style

- **Meaningful names**: Self-documenting code
- **Short methods**: Under 30 lines, single responsibility
- **Java 21 features**: Use records, pattern matching, enhanced switch

### Naming Conventions

- Classes: `PascalCase` (e.g., `PostController`)
- Methods: `camelCase` (e.g., `findPostById`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_PAGE_SIZE`)
- Variables: `camelCase` (e.g., `postDto`)



## 🐛 Reporting Issues

**Found a bug?** Open an issue with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Java version)

**Want a feature?** Open an issue describing:
- The problem it solves
- Proposed solution
- Example usage

---

**Thank you for contributing! 🎉**
