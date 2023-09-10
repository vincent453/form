const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./module");
const bcrypt = require("bcrypt");

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
async function connectToDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://lawrencevincent453:5TuRPt3NgAh6t54J@cluster0.0ldculs.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToDB();

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.post("/fail", function (req, res) {
  res.redirect("/");
});

app.post("/success", function (req, res) {
  res.redirect("/");
});

app.post("/form", async function (req, res) {
  try {
    const { name, email, password } = req.body;

    // Try to find a user with the same name
    const existingUser = await User.findOne({ name });

    if (existingUser) {
      // If a user with the same name exists, update their information
      existingUser.email = email;
      existingUser.password = password;
      const updatedUser = await existingUser.save();
      console.log("User updated:", updatedUser);
      res.status(200).json(updatedUser);
     
    } else {
      // If no user with the same name exists, create a new user
      const newUser = new User({ name, email, password });
      const savedUser = await newUser.save();
      console.log("User saved:", savedUser);
      res.status(200).json(savedUser);
    }
  } catch (err) {
    console.error("Error during user creation/update:", err);
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
      res.sendFile(__dirname + "/success.html"); // Redirect to a dashboard or another page
	
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
