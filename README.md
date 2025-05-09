# Web Utility for Time-Table Generation

## Overview

This project is an **Automated Time-Table Generator** built using the **MERN Stack**. It leverages advanced algorithms and modern web technologies to create optimized and constraint-based timetables automatically.

### 🔧 Concepts Covered

- MERN Stack (MongoDB, Express.js, React.js, Node.js)
- Genetic Algorithm
- Constraint Programming
- Redux for state management
- JWT Authentication

---

## 🛠 Development and Installation

Follow the steps below to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/vamshi0908/Web-Utility-for-time-table-generation.git
cd time-table
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
npm run client-install
```

### 4. Setup Development Keys

You can either:

#### Option A: Run a Local MongoDB Server

Install and start MongoDB on your local machine.

#### Option B: Use an Online MongoDB Service (like MongoDB Atlas or mLab)

Create a file named `keys_dev.js` inside the `config/` directory with the following content:

```js
module.exports = {
  mongoURI: "YOUR_LOCAL_OR_REMOTE_MONGO_URI",
  secretOrKey: "YOUR_SECRET"
};
```

### 5. Run the Application

To start both the backend and frontend servers in development mode:

```bash
npm run dev
```

---

## 📌 Note

Make sure to replace `"YOUR_LOCAL_OR_REMOTE_MONGO_URI"` and `"YOUR_SECRET"` with your actual database connection string and a secure JWT secret key.

---

## 📬 Contributors

**Mahindra University**  
- 🎓 Anish Kumar Maganti – *SE22UARI018*  
- 🎓 Sriman Satwik Reddy Chinnam – *SE22UARI166*  
- 🎓 Vamshi Krishna Thodupunury – *SE22UARI198*  
- 🎓 Venkata Kaashith Gopu – *SE22UARI200*

---

## 📄 License

This project is licensed under the MIT License.
