# HMS Backend API

This is the backend for the Hospital Management System (HMS) built with **Node.js**, **Express**, **MongoDB**, and **JWT-based authentication** using `accessToken` and `refreshToken`.

---

## 📦 Technologies Used

- Node.js
- Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- dotenv
- cookie-parser
- Express Async Handler
- Role-based access control (Admin, Doctor, Patient)

---

## 📁 Project Structure


---

## 🚀 API Endpoints

### 🔐 Auth Routes (`/api/user`)
| Method | Route         | Description            | Access |
|--------|---------------|------------------------|--------|
| POST   | `/register`   | Register new user      | Public |
| POST   | `/login`      | Login user, returns access & refresh tokens | Public |
| GET    | `/me`         | Get logged-in user info| Private (Authenticated) |
| GET    | `/refresh`    | Get new access token from refresh token | Public |
| POST   | `/logout`     | Logout & clear cookie  | Private |

### 👨‍⚕️ Doctor Profile Routes (`/api/doctorprofile`)
| Method | Route                     | Description                       | Access        |
|--------|---------------------------|-----------------------------------|---------------|
| POST   | `/create`                 | Create doctor profile             | Private (Doctor) |
| GET    | `/all-doctors`           | Get all doctors                   | Public        |
| GET    | `/single/:id`             | Get single doctor profile by ID   | Public        |
| PUT    | `/update/:id`             | Update doctor profile             | Private (Doctor) |

### 📅 Appointment Routes (`/api/appointment`)
| Method | Route         | Description                | Access        |
|--------|---------------|----------------------------|---------------|
| POST   | `/book`       | Book an appointment        | Private (Patient) |
| GET    | `/my`         | Get my appointments        | Private (All) |
| GET    | `/doctor`     | Doctor's appointments      | Private (Doctor) |

### 💵 Billing Routes (`/api/bill`)
| Method | Route         | Description                | Access        |
|--------|---------------|----------------------------|---------------|
| POST   | `/generate`   | Generate a bill            | Private (Doctor/Admin) |
| GET    | `/patient/:id`| Get patient's bill         | Private        |

---

## 🔐 Authentication Flow

- User logs in → `accessToken` (short-lived) + `refreshToken` (stored in cookie).
- Protected routes use `accessToken` in headers.
- When accessToken expires → frontend sends request to `/refresh` to get a new one using `refreshToken`.

---

## 🛡️ Middlewares

- `authMiddleware.js`: Verifies JWT and attaches `req.user`.
- `roleMiddleware.js`: Checks user role (admin, doctor, patient).
- `errorMiddleware.js`: Handles async errors and formats response.

---

## 📄 .env Example


---

## 🧪 Testing APIs

Use **Postman** or **Thunder Client** with these:

- Set `Authorization: Bearer <accessToken>` for protected routes.
- Send refresh token via cookie in `/refresh` endpoint.

---

## 🧹 Future Enhancements

- Password Reset via Email
- Image upload with Cloudinary/S3
- Admin dashboard for managing users
- Stripe/Paytm integration for payments

---

## 🤝 Author

**Mohit Bhardwaj**  
MERN Stack Developer  
[GitHub Profile](https://github.com/xmohitbhardwaj)

---

