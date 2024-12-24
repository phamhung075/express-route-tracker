# 📚 **Express Route Tracker**

**Express Route Tracker** is a lightweight library designed to add metadata and logging capabilities to your Express.js routes. It enhances route handlers with information about their source file and route name, making debugging, tracing, and logging much easier.

---

## 🚀 **Features**

- ✅ **Automatic Route Metadata:** Adds `__source` and `__name` properties to handlers.  
- ✅ **Logging Middleware:** Logs route method, path, and handler source for better traceability.  
- ✅ **Seamless Integration:** Easily wraps around Express routes without modifying existing logic.  
- ✅ **Supports All HTTP Methods:** `GET`, `POST`, `PUT`, `DELETE`, `PATCH`.  

---

## 📦 **Installation**

Using npm:

```bash
npm install express-route-tracker
```

Using yarn:

```bash
yarn add express-route-tracker
```

---

## 🛠️ **Usage**

### **1. Create a Router with `createRouter`**

Import `createRouter` from `express-route-tracker` and use it to define your routes.

```typescript
//src\_core\server\app\app.service.ts
import { RouteDisplay } from '@node_modules/express-route-tracker/dist';

app.use("/", router);
const routeDisplay = new RouteDisplay(app);  // <-- This is the key line
routeDisplay.displayRoutes();  // <-- This is the key line
```

```typescript
//src\modules\index.ts
import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';

const router = Router();


router.use('/api/contact', require('./contact'));  // <-- This is the key line

router.post('/', (_req: Request, res: Response, _next: NextFunction) => {
	return res.status(200).json({
		message: 'Welcome to AIAnalyst!'
	})
});


export default router;
```

```typescript
// src\modules\contact\index.ts
import { asyncHandlerFn } from '@/_core/helper/async-handler/async-handler';
import contactController from './contact.controller.factory';
import {
  ContactIdSchema,
  CreateContactSchema,
  UpdateContactSchema
} from './contact.validation';
import { validateSchema } from '@/_core/middleware/validateSchema.middleware';
import { createRouter } from '@node_modules/express-route-tracker/dist';

// Create router with source tracking
const router = createRouter(__filename);  // <-- This is the key line

// Named Handlers
async function createContactHandler(req: any, res: any, next: any) {
  await contactController.createContact(req, res, next);
}

async function getAllContactsHandler(req: any, res: any, next: any) {
  await contactController.getAllContacts(req, res, next);
}

async function getContactByIdHandler(req: any, res: any, next: any) {
  await contactController.getContactById(req, res, next);
}

async function updateContactHandler(req: any, res: any, next: any) {
  await contactController.updateContact(req, res, next);
}

async function deleteContactHandler(req: any, res: any, next: any) {
  await contactController.deleteContact(req, res, next);
}

// Define routes without baseApi prefix
router.post('/', validateSchema(CreateContactSchema), asyncHandlerFn(createContactHandler));
router.get('/', asyncHandlerFn(getAllContactsHandler));
router.get('/:id', validateSchema(ContactIdSchema), asyncHandlerFn(getContactByIdHandler));
router.put('/:id', validateSchema(UpdateContactSchema), asyncHandlerFn(updateContactHandler));
router.delete('/:id', validateSchema(ContactIdSchema), asyncHandlerFn(deleteContactHandler));

export = router;
```

---

### **2. Middleware Logging**

The library automatically applies a **logging middleware** that logs the route method, path, and source file.

**Example Output in Console:**
```
[Route Log]: GET / - Source: src/routes/example.route.ts
[Route Log]: POST /data - Source: src/routes/example.route.ts
[Route Log]: GET /user/:id - Source: src/routes/example.route.ts
```

---

### **3. Access Route Metadata**

Each route handler now has metadata available:

```typescript
router.get('/meta', (req: Request, res: Response) => {
    res.json({
        handlerSource: (req.route?.stack || [])
            .map(layer => (layer.handle as any).__source || 'unknown')
    });
});
```

**Output:**
```json
{
    "handlerSource": "src/routes/example.route.ts"
}
```

---

## 🔧 **Advanced Configuration**

### **Custom Middleware**

You can still add your custom middlewares before the handler:

```typescript
// src\modules\contact\index.ts
import { createRouter } from 'express-route-tracker';
import { Request, Response, NextFunction } from 'express';

const router = createRouter(__filename);

// Custom Middleware
function customLogger(req: Request, res: Response, next: NextFunction) {
    console.log('Custom Middleware Triggered!');
    next();
}

// Route with Custom Middleware
router.get('/custom', customLogger, (req: Request, res: Response) => {
    res.send('Custom route with middleware');
});
```

**Console Output:**
```
Custom Middleware Triggered!
[Route Log]: GET /custom - Source: src/routes/example.route.ts
```

---

## 🧪 **Testing**

To verify the functionality:
1. Start your Express server.
2. Access routes like:
   - `http://localhost:3000/`
   - `http://localhost:3000/data`
   - `http://localhost:3000/user/123`
3. Check your terminal logs for metadata and route logs.

---

## 📄 **API Reference**

### **`createRouter(filename: string)`**
- **Description:** Creates a router instance with metadata tracking and route logging.
- **Parameters:**  
   - `filename` *(string)*: The source file name (use `__filename`).
- **Returns:** `express.Router`

### **Route Handler Metadata**
Each route handler will have:
- `__source`: Path of the source file.
- `__name`: HTTP method and path.

### **Middleware: `routeLoggerMiddleware`**
- Logs method, path, and source file.

---

## 🛡️ **Best Practices**

- Use `createRouter(__filename)` for all route files.  
- Avoid directly manipulating `__source` and `__name` properties.  
- Leverage the middleware for debugging and monitoring.

---

## 🌟 **Contributing**

We welcome contributions! If you encounter bugs, have feature requests, or want to improve the library:
- Open an issue on GitHub.  
- Submit a pull request.

---

## 📃 **License**

This project is licensed under the **MIT License**.

---

## 📷 **Example Screenshot**

![Example Usage](https://scontent.fctt1-1.fna.fbcdn.net/v/t1.15752-9/467180401_8763723233676664_3702955183771849645_n.png?_nc_cat=102&ccb=1-7&_nc_sid=9f807c&_nc_ohc=OYgL8sgr8YsQ7kNvgGKVb__&_nc_zt=23&_nc_ht=scontent.fctt1-1.fna&oh=03_Q7cD1gF_tvMcfrEkJqZjf_OdZN4lVqRx42obp83WH8vt8gq4cA&oe=67918186)

---

## 📞 **Support**

For help or inquiries:
- 📧 **Email:** daihung.pham@gmail.com  
- 🌐 **Git:** [https://github.com/phamhung075](https://github.com/phamhung075)  

Happy Coding! 🚀✨

