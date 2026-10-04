# 📘 Book API Learning Lab

A hands-on learning project that demonstrates **REST** and **SOAP** APIs, including:

* Headers, Authentication (JWT)
* Path & Query Parameters
* HTTP Status Codes
* SOAP XML operations
* Postman testing
* PostgreSQL integration
* Docker + Kubernetes deployment

Built with **Node.js (Express)** and **Sequelize**.

---

## 🚀 Features Overview

| Feature         | Description                                        |
| --------------- | -------------------------------------------------- |
| **REST API**    | CRUD endpoints using Express + Sequelize           |
| **SOAP API**    | Parallel service exposing the same CRUD operations |
| **Auth**        | JWT-based authentication header                    |
| **Database**    | PostgreSQL integration for persistence             |
| **HTTPS-ready** | Optional certificate support                       |
| **Postman**     | Ready-made collection for hands-on learning        |
| **Kubernetes**  | Deployable with manifests & secrets                |

---

## 🧱 Project Structure

```
book-api/
│
├── src/
│   ├── app.js                 # Entry point (REST + SOAP server)
│   ├── db.js                  # Sequelize DB connection
│   ├── models/
│   │   └── book.model.js      # Book table schema
│   ├── routes/
│   │   ├── book.routes.js     # REST endpoints
│   │   └── auth.routes.js     # Auth routes
│   ├── controllers/
│   │   ├── book.controller.js # Business logic
│   │   └── auth.controller.js # JWT token issuance
│   ├── middleware/
│   │   └── auth.js            # JWT verification middleware
│   └── soap/
│       └── bookService.js     # SOAP CRUD service + WSDL
│
├── package.json               # Dependencies & scripts
├── .env                       # Environment variables
├── Dockerfile                 # Containerization
├── k8s-deployment.yaml        # K8s deployment + service
├── BookAPI_LearningLab.postman_collection.json
└── README.md
```

---

## 🧰 Setup & Installation

### 1️⃣ Clone the repo

```bash
git clone https://github.com/your-org/book-api.git
cd book-api
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment variables

Create a `.env` file in the project root:

```bash
PORT=8080
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=booksdb
DB_USER=postgres
DB_PASS=password

JWT_SECRET=SUPER_SECRET_KEY_12345
```

### 4️⃣ Start PostgreSQL

You can use Docker:

```bash
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

### 5️⃣ Run the app

```bash
npm start
```

You should see:

```
🚀 REST + SOAP running at http://localhost:8080
🧼 SOAP WSDL: http://localhost:8080/soap/bookservice?wsdl
```

---

## 📚 API Documentation

### 🔑 Authentication

**Endpoint:**

```
POST /api/auth/login
```

**Body:**

```json
{
  "username": "admin",
  "password": "password"
}
```

**Response:**

```json
{
  "token": "JWT_TOKEN"
}
```

Use the token in subsequent requests:

```
Authorization: Bearer <JWT_TOKEN>
```

---

### 📘 REST API

| Method   | Endpoint         | Description    | Auth | Notes                     |
| -------- | ---------------- | -------------- | ---- | ------------------------- |
| `GET`    | `/api/books`     | Get all books  | ✅    | Supports `?author=` query |
| `GET`    | `/api/books/:id` | Get book by ID | ✅    | Demonstrates path param   |
| `POST`   | `/api/books`     | Create book    | ✅    | Requires JSON body        |
| `DELETE` | `/api/books/:id` | Delete book    | ✅    | Returns `204 No Content`  |

**Example `POST /api/books` body:**

```json
{
  "title": "Learn REST APIs",
  "author": "Jane Doe",
  "year": 2025
}
```

---

### 🧼 SOAP API

**WSDL URL:**

```
http://localhost:8080/soap/bookservice?wsdl
```

All SOAP requests use:

* `POST http://localhost:8080/soap/bookservice`
* Header: `Content-Type: text/xml`

#### 🧾 Example Requests

**GetBook**

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:book="http://example.com/books">
   <soapenv:Header/>
   <soapenv:Body>
      <book:GetBook>
         <id>1</id>
      </book:GetBook>
   </soapenv:Body>
</soapenv:Envelope>
```

**CreateBook**

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:book="http://example.com/books">
   <soapenv:Header/>
   <soapenv:Body>
      <book:CreateBook>
         <title>SOAP Made Easy</title>
         <author>John Smith</author>
         <year>2025</year>
      </book:CreateBook>
   </soapenv:Body>
</soapenv:Envelope>
```

**UpdateBook**

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:book="http://example.com/books">
   <soapenv:Header/>
   <soapenv:Body>
      <book:UpdateBook>
         <id>1</id>
         <title>SOAP Made Easy - Revised</title>
      </book:UpdateBook>
   </soapenv:Body>
</soapenv:Envelope>
```

**DeleteBook**

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:book="http://example.com/books">
   <soapenv:Header/>
   <soapenv:Body>
      <book:DeleteBook>
         <id>1</id>
      </book:DeleteBook>
   </soapenv:Body>
</soapenv:Envelope>
```

---

## 🧪 Postman Testing

1. Import **`BookAPI_LearningLab.postman_collection.json`**
2. Set environment variable:

   ```
   base_url = http://localhost:8080
   ```
3. Run the requests in order:

   * **AUTH - Get JWT Token**
   * **REST - CRUD Operations**
   * **SOAP - Operations**

💡 Toggle between REST and SOAP examples to see how both styles differ.

---

## 🐳 Docker

Build and run locally:

```bash
docker build -t book-api .
docker run -p 8080:8080 book-api
```

---

## ☸️ Kubernetes Deployment

Apply manifests:

```bash
kubectl apply -f k8s-deployment.yaml
```

Then verify:

```bash
kubectl get pods
kubectl get svc
```

To add TLS:

```bash
kubectl create secret tls book-api-tls --cert=certs/server.crt --key=certs/server.key
```

---

## 🔐 HTTPS (Optional)

If you want to enable HTTPS locally:

1. Generate a certificate:

   ```bash
   mkdir certs && cd certs
   openssl req -x509 -newkey rsa:2048 -keyout server.key -out server.crt -sha256 -days 365 -nodes -subj "/CN=localhost"
   ```
2. Uncomment the HTTPS section in `app.js`.
3. Access via:

   ```
   https://localhost:8443
   ```

---

## 🧠 Learning Objectives

After completing this lab, you’ll understand:

* REST vs SOAP architectures
* Authentication via JWT headers
* Using path and query parameters
* Common HTTP status codes
* SOAP request/response envelopes
* Database integration using Sequelize
* Docker + K8s deployment
* Postman testing for both REST & SOAP

---

## 🧑‍💻 Author & Credits

Created as a **team learning project** to explore backend API design, security, and deployment.  
Built using Node.js, Express, Sequelize, and SOAP.

**Author:** rpamu  


