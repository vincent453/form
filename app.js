const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./module");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://lawrencevincent453:4QMYNB5teNPQz1py@cluster0.0ldculs.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/login-signup.html");
});

app.get("/form", function (req, res) {
  res.sendFile(__dirname + "/login-signup.html");
});

app.get("/login-signup.html", function (req, res) {
  res.sendFile(__dirname + "/login-signup.html");
});

app.get('/details-:number.html', (req, res) => {
  const { number } = req.params;
  const fileName = `details-${number}.html`;
  const filePath = path.join(__dirname, fileName);

  res.sendFile(filePath);
});

app.get('/products-:number.html', (req, res) => {
  const { number } = req.params;
  const fileName = `products-${number}.html`;
  const filePath = path.join(__dirname, fileName);

  res.sendFile(filePath);
});

// Define an array of route paths
const routePaths = ['products.html', 'products-detail.html', 'cart.html', 'About.html','index.html',];

// Loop through the route paths and create route handlers
routePaths.forEach((routePath) => {
  app.get(`/${routePath}`, (req, res) => {
    const filePath = path.join(__dirname, routePath);
    res.sendFile(filePath);
  });
});

// Validate email function
function isValidEmail(email) {
  // Define a regular expression pattern for a valid email address
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Test the provided email against the pattern
  return emailPattern.test(email);
}

// Validate email in the /form route
app.post("/form", async function (req, res) {
  try {
    const { name, email, password } = req.body;

    // Check if the email is valid
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    // Check if a user with the same name already exists
    const existingUser = await User.findOne({ name });

    if (existingUser) {
      // If a user with the same name exists, send an error response
      return res.status(400).json({ error: "Username is already taken." });
    }

    // If no user with the same name exists, create a new user
    const newUser = new User({ name, email, password });
    const savedUser = await newUser.save();
    console.log("User saved:", savedUser);
    res.status(200).json(savedUser);
  } catch (err) {
    console.error("Error during user creation:", err);
    res.status(500).json({ error: "Failed to save user." });
  }
});

app.post("/login", async function (req, res) {
  try {
    const { name, password } = req.body;

    // Find the user by name in the database
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Compare the provided password with the hashed password in the database using bcrypt
    const passwordMatch = await user.comparePassword(password);

    if (passwordMatch) {
      // Passwords match; login successful
      res.sendFile(__dirname + "/index.html");
    } else {
      // Password doesn't match
      res.status(401).json({ error: "Incorrect password" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
