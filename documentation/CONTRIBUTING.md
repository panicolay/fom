# 🛠️ Contributing Guidelines

Thank you for contributing to this project! This document describes the standards we follow to keep our codebase clean, readable, and maintainable.

---

## ✍️ Commit Messages

We use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification to standardize commit history and enable better tooling (changelogs, CI pipelines, etc.).

### Format

```
<type>(optional-scope)/<short description>
```

**Examples:**

```
feat(pattern): add a pattern
fix(auth): prevent crash on login
docs(readme): update project setup instructions
```

### Allowed Types

| Type       | Description                                             |
| ---------- | ------------------------------------------------------- |
| `feat`     | A new feature                                           |
| `fix`      | A bug fix                                               |
| `docs`     | Documentation only changes                              |
| `style`    | Code style updates (formatting, white-space, etc)       |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf`     | Performance improvements                                |
| `test`     | Adding or updating tests                                |
| `chore`    | Maintenance tasks (e.g., config, tooling)               |
| `build`    | Build system changes                                    |
| `ci`       | Continuous Integration related changes                  |

## 🧪 Development & Tooling

We use the following tooling:

- **Prettier** for formatting
- **ESLint** for linting
- **Vitest** for testing
