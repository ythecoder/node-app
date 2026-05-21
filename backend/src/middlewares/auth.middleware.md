# Auth Middleware Guide

A quick reference guide for the authentication and authorization middleware defined in `auth.middleware.js`.

---

## Configuration

* `JWT_SECRET`: Secret key for signing/verifying tokens (defaults to `'your-secret-key'`).
* `JWT_EXPIRE`: Expiration duration of tokens (defaults to `'7d'`).

---

## Token Utilities

### 1. `generateToken(userId, tenantId)`
Generates a signed JWT with `userId` and `tenantId` in the payload.

```javascript
export const generateToken = (userId, tenantId) => {
  return jwt.sign({ userId, tenantId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};
```

* **Parameters:**
  * `userId`: Database ID of the user.
  * `tenantId`: ID of the tenant context.
* **Returns:** Signed JWT string.

---

### 2. `verifyToken(token)`
Verifies and decodes a JWT.

```javascript
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
```

* **Parameters:**
  * `token`: The JWT string.
* **Returns:** Decoded payload `{ userId, tenantId }` or `null` if invalid/expired.

---

## Middlewares

### 3. `auth`
Middleware that authenticates requests using the `Authorization` header.

```javascript
export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ message: 'Invalid or expired token' });

    const user = await User.findById(decoded.userId).populate('role');
    if (!user || !user.isActive) return res.status(401).json({ message: 'User not found or inactive' });

    req.user = user;
    req.tenantId = decoded.tenantId;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};
```

* **Action:**
  * Extracts the token from `Bearer <token>`.
  * Verifies the token.
  * Fetches the user from the database and populates their role.
  * Attaches `req.user` and `req.tenantId`.
  * Calls `next()`.

---

### 4. `authorize(requiredPermissions)`
Higher-order middleware to enforce permission-based authorization.

```javascript
export const authorize = (requiredPermissions = []) => {
  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'User not authenticated' });

      const role = req.user.role;
      if (role.name === 'SuperAdmin') return next();

      const hasPermission = role.permissions.includes('all') || 
        requiredPermissions.every(permission => role.permissions.includes(permission));

      if (!hasPermission) {
        return res.status(403).json({
          message: 'Insufficient permissions',
          required: requiredPermissions,
          available: role.permissions,
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Authorization error', error: error.message });
    }
  };
};
```

* **Action:**
  * Ensures user is authenticated.
  * Bypasses checks if role is `'SuperAdmin'`.
  * Verifies if user has `'all'` permission or **all** permissions in `requiredPermissions`.
  * Allows access or returns a `403 Forbidden` error.

---

### 5. `checkPermission(permission)`
Shorthand middleware to check for a single permission.

```javascript
export const checkPermission = (permission) => {
  return authorize([permission]);
};
```

---

## Route Usage Examples

```javascript
import { auth, checkPermission, authorize } from './middlewares/auth.middleware.js';

// 1. Authentication Only
router.get('/profile', auth, getProfile);

// 2. Single Permission Requirement
router.post('/products', auth, checkPermission('products:create'), createProduct);

// 3. Multiple Permissions Requirement
router.get('/reports', auth, authorize(['reports:read', 'reports:export']), getReports);
```
