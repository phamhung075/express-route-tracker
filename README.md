# 📚 **Express Route Tracker with HATEOAS**

**Express Route Tracker** A lightweight library for Express.js that adds route tracking and HATEOAS (Hypermedia as the Engine of Application State) capabilities to your API.

---
## 📷 **Example Screenshot**

![Example Usage](https://scontent.fctt1-1.fna.fbcdn.net/v/t1.15752-9/467114773_1049798083500442_9220589951170052487_n.png?_nc_cat=109&ccb=1-7&_nc_sid=9f807c&_nc_ohc=LagamJ5YO6EQ7kNvgH1emSC&_nc_zt=23&_nc_ht=scontent.fctt1-1.fna&oh=03_Q7cD1gFU3TRmRpEfgInCnhodelyaslhhCB0O5245mzhQYKnuWg&oe=67918C78)

## **Example Project Node.js express typescript**
[https://github.com/phamhung075/AIanalist](https://github.com/phamhung075/AIanalist)

## **Example Project Bun express typescript**
[https://github.com/phamhung075/AIanalist](https://github.com/phamhung075/AIanalist_bun_version)

---

## Quick Start

### 1. Installation

```bash
npm install express-route-tracker
# or
yarn add express-route-tracker
```

### 2. Basic Setup

```typescript
// src/app.ts
import { RouteDisplay } from 'express-route-tracker';
import express from 'express';

const app = express();
app.use("/", router);

// Display all routes in console when starting the app
const routeDisplay = new RouteDisplay(app);
routeDisplay.displayRoutes();
```


```typescript
//src\modules\index.ts
import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';

const router = Router();


router.use('/api/contact', require('./contact'));  //<-- need add this line for each module

// router.use('/v1/api/error', require('./error'));
router.post('/', (_req: Request, res: Response, _next: NextFunction) => {
	return res.status(200).json({
		message: 'Welcome !'
	})
});


export default router;
```



### 3. Creating Routes basic (option 1)
In your route module (e.g., `src/modules/contact/index.ts`):

```typescript
// src/modules/contact/index.ts
import { createHATEOASMiddleware, createRouter } from 'express-route-tracker';
import {
  createContactHandler,
  deleteContactHandler,
  getAllContactsHandler,
  getContactByIdHandler,
  updateContactHandler
} from './contact.handler';
import { asyncHandler } from '@/_core/helper/asyncHandler';
import { config } from '@/_core/config/dotenv.config';

// Create router with source tracking
const router = createRouter(__filename);  // replace const router = express.Router();

// Define routes without baseApi prefix
router.post('/', asyncHandler(createContactHandler));
router.get('/', asyncHandler(getAllContactsHandler));
router.get('/:id', asyncHandler(getContactByIdHandler));
router.put('/:id', asyncHandler(updateContactHandler));
router.delete('/:id', asyncHandler(deleteContactHandler));

export = router;  // replace export default router;
```

### 3. Creating Routes with HATEOAS (option 2)
In your route module (e.g., `src/modules/contact/index.ts`):

```typescript
// src/modules/contact/index.ts
import { createHATEOASMiddleware, createRouter } from 'express-route-tracker';
import {
  createContactHandler,
  deleteContactHandler,
  getAllContactsHandler,
  getContactByIdHandler,
  updateContactHandler
} from './contact.handler';
import { asyncHandler } from '@/_core/helper/asyncHandler';
import { config } from '@/_core/config/dotenv.config';

// Create router with source tracking
const router = createRouter(__filename);  // replace const router = express.Router();

router.use(createHATEOASMiddleware(router, {
  autoIncludeSameRoute: true,
  baseUrl: config.baseUrl,
  includePagination: true,
  customLinks: {
      documentation: (_req) => ({
          rel: 'documentation',
          href: config.baseUrl+'/docs',
          method: 'GET',
          'title': 'API Documentation'
      })
  }
}));

// Define routes without baseApi prefix
router.post('/', asyncHandler(createContactHandler));
router.get('/', asyncHandler(getAllContactsHandler));
router.get('/:id', asyncHandler(getContactByIdHandler));
router.put('/:id', asyncHandler(updateContactHandler));
router.delete('/:id', asyncHandler(deleteContactHandler));

export = router;  // replace export default router;
```

---

## Response Format

Your API responses will now automatically include HATEOAS links:

```json
{
    "id": "yQg9OD4KRTNywa2fHwxN",
    "name": "John Doe",
    "links": {
        "self": {
            "rel": "self",
            "href": "localhost:3333/api/contact/yQg9OD4KRTNywa2fHwxN",
            "method": "GET"
        },
        "create": {
            "title": "POST /",
            "rel": "create",
            "href": "localhost:3333/api/contact/",
            "method": "POST"
        },
        "collection": {
            "title": "GET /",
            "rel": "collection",
            "href": "localhost:3333/api/contact/",
            "method": "GET"
        },
        "item": {
            "title": "GET /:id",
            "rel": "item",
            "href": "localhost:3333/api/contact/yQg9OD4KRTNywa2fHwxN",
            "method": "GET"
        },
        "update": {
            "title": "PUT /:id",
            "rel": "update",
            "href": "localhost:3333/api/contact/yQg9OD4KRTNywa2fHwxN",
            "method": "PUT"
        },
        "delete": {
            "title": "DELETE /:id",
            "rel": "delete",
            "href": "localhost:3333/api/contact/yQg9OD4KRTNywa2fHwxN",
            "method": "DELETE"
        },
        "documentation": {
            "rel": "documentation",
            "href": "localhost:3333/docs",
            "method": "GET",
            "title": "API Documentation"
        }
    }
}
```

## Configuration Options

The `createHATEOASMiddleware` accepts several options:

1. `autoIncludeSameRoute`: When true, includes all routes from the same file in the links
2. `baseUrl`: The base URL for generating absolute URLs
3. `includePagination`: Adds pagination links when response includes pagination data
4. `customLinks`: Custom link generators for additional relationships

## Pagination Support

When `includePagination` is enabled and your response includes pagination data:

```typescript
{
    data: items,
    pagination: {
        currentPage: 1,
        totalPages: 5
    },
    links: {
        // Regular links...
        first: { rel: 'first', href: '/api/contacts?page=1', method: 'GET' },
        next: { rel: 'next', href: '/api/contacts?page=2', method: 'GET' },
        last: { rel: 'last', href: '/api/contacts?page=5', method: 'GET' }
    }
}
```

## 📄 **API Reference**

### **`createRouter(filename: string)`**
- **Description:** Creates a router instance with metadata tracking and route logging.
- **Parameters:**  
   - `filename` *(string)*: The source file name (use `__filename`).
- **Returns:** `express.Router`
Each route handler will have:
- `__source`: Path of the source file.
- `__name`: HTTP method and path.

### **Middleware: `routeLoggerMiddleware`**
- Logs method, path, and source file.

### **Middleware: `createHATEOASMiddleware`**
- Automatically generates HATEOAS links for your API.



---

## 🛡️ **Best Practices**

1. **Consistent Base URLs**: Use configuration to maintain consistent base URLs across environments.

```typescript
// config.ts
export const config = {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3333',
    baseApi: '/api'
};
```

2. **Meaningful Relationships**: Use semantic rel values that describe the relationship:
   - `self`: Current resource
   - `collection`: List endpoint
   - `create`: Creation endpoint
   - `update`: Update endpoint
   - `delete`: Delete endpoint

3. **Error Handling**: Ensure your error responses also include appropriate HATEOAS links:

```typescript
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    res.status(500).json({
        error: err.message,
        links: {
            self: {
                rel: 'self',
                href: `${config.baseUrl}${req.originalUrl}`,
                method: req.method as any
            }
        }
    });
}
```

- Use `createRouter(__filename)` for all route files.  
- Avoid directly manipulating `__source` and `__name` properties.  
- Use `createHATEOASMiddleware` to automatically generate HATEOAS links for your API.

---

## 🌟 **Contributing**

We welcome contributions! If you encounter bugs, have feature requests, or want to improve the library:
- Open an issue on GitHub.  
- Submit a pull request.

---

## 📃 **License**

This project is licensed under the **MIT License**.

---


# ✔️ **Contributing to Express Route Tracker**

Every contribution matters, whether it’s bug fixes, feature requests, or improving documentation.

## 🛠️ **Steps to Contribute**
1. **Fork and Clone the Repository**  
   ```bash
   git clone https://github.com/phamhung075/express-route-tracker.git
   cd express-route-tracker
   ```

2. **Install Dependencies**  
   ```bash
   npm install
   ```

4. **Make Changes**  
   - Create a new branch:  
     ```bash
     git checkout -b feature/your-feature
     ```
   - Commit your changes:  
     ```bash
     git add .
     git commit -m "Your detailed commit message"
     ```

## 📞 **Support**

For help or inquiries:
- 📧 **Email:** daihung.pham@gmail.com  
- 🌐 **Git:** [https://github.com/phamhung075](https://github.com/phamhung075)  

Happy Coding! 🚀✨

