# Contributing to Blog Platform API

Thank you for your interest in contributing! We welcome all contributions from the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

Be respectful, inclusive, and professional. We're committed to providing a welcoming environment for all contributors.

## 🚀 Getting Started

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

### Example

```java
@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {
    
    private final PostService postService;
    
    @GetMapping
    public ResponseEntity<List<PostDto>> getAllPosts() {
        return ResponseEntity.ok(postService.findAll());
    }
}
```


## 🔄 Pull Request Process

### Before Submitting

1. ✅ Update documentation if needed
2. ✅ Keep commits clean and focused

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Self-reviewed code

### Review Process

1. At least one reviewer approval
2. Address feedback promptly
3. Resolve merge conflicts

---

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
