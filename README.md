# 🚀 Node.js & Express.js Learning Journey

This README serves as a comprehensive guide for Chapter 1 to 3, covering Node.js basics, HTTP servers, and the Express.js framework.

---

## 📝 Quick Summary (आसान सारांश)

* **English:** Node.js lets you run JavaScript on your computer (not just browsers). NPM is a library for downloading tools, and Express makes building servers fast and easy.
* **Hindi:** Node.js की मदद से हम कंप्यूटर पर JS चला सकते हैं। NPM एक लाइब्रेरी की तरह है जहाँ से हम बने-बनाए टूल्स (packages) डाउनलोड करते हैं, और Express की मदद से सर्वर बनाना बहुत आसान हो जाता है।

---

## 📂 Chapter 1: Introduction to Node, NPM, and Package.JSON

### [[ Chapter Notes ]]
* **Installation:** Use only **LTS** versions from `nodejs.org`.
* **Check Version:** Use `node -v` and `npm -v`.
* **REPL:** Type `node` in terminal to test JS directly. `Ctrl+D` to exit.
* **Running Files:** `node filename.js`.
* **Module Systems:**
    * **CommonJS:** Uses `require()` and `module.exports`.
    * **ES Modules:** Uses `import` and `export`.
* **FileSystem (fs):** Core module to read/write files. **Async** is preferred to avoid I/O blocking.
* **NPM Initialization:** `npm init` creates `package.json`.
* **Dependencies:**
    * `npm install <package>`: Local installation.
    * `npm install -g <package>`: Global installation.
    * `nodemon`: Restarts the server automatically on code changes.
* **Package Files:**
    * `package.json`: Project configuration, scripts, and dependencies.
    * `package-lock.json`: Stores exact versions of dependencies.
* **Security:** Never share `node_modules`. Always use a `.gitignore` file.

---

## 🌐 Chapter 2: Server Concepts with Node - HTTP Module



### [[ Chapter Notes ]]
* **Request Object:**
    * **Method:** GET, POST, PUT, DELETE.
    * **Headers:** Metadata (browser info, cookies).
    * **Params:** Query params (`?id=1`) and Route params (`/user/1`).
* **Response Object:**
    * **Status Codes:** 200 (OK), 404 (Not Found), 500 (Server Error).
    * **Body:** Data sent back (HTML, JSON, Images).
* **Server Basics:** A server is a function that processes a request and returns **exactly one** response.
* **Ports:** Use port numbers > 1024 to avoid system conflicts.
* **POSTMAN:** Essential software for testing complex API requests.

---

## ⚡ Chapter 3: Express JS

### [[ Chapter Notes ]]
* **Definition:** The de-facto web framework for Node.js. Install via `npm install express`.
* **Middlewares:** Functions that modify the request/response before it reaches the final route.
    * **Application Level:** `app.use()`.
    * **Built-in:** `express.json()`, `express.static()`.
    * **Third-party:** `morgan`.
* **Static Hosting:** Use `app.use(express.static('public'))` to serve files like `index.html`.

### [[ Data Transmission Methods ]]

| Method | Access in Express | Best Use Case |
| :--- | :--- | :--- |
| **Query String** | `req.query` | Filtering/Searching (`/search?q=node`) |
| **URL Params** | `req.params` | Specific Resource (`/products/:id`) |
| **Request Body** | `req.body` | Sending Data (Forms/JSON) |
