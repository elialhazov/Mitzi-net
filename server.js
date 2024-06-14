//Eliyahu Alhazov - 318874831
//Michael Miron - 315199109

const express = require('express'); // Import Express framework
const mongojs = require('mongojs'); // Import MongoJS library for MongoDB interactions
const path = require('path'); // Import Path module for file path operations
const bcrypt = require('bcrypt'); // Import Bcrypt library for hashing passwords

// MongoDB connection
const db = mongojs('mongodb+srv://Student:webdev2024student@cluster0.uqyflra.mongodb.net/webdev2024', ['tasks']); // Connect to MongoDB Atlas cluster
const tasks_coll = db.collection('mitzinet_Eliyahu_Alhazov_Michael_miron'); // Specify the collection within the database

const app = express(); // Initialize Express application
app.use(express.json()); // Middleware to parse JSON body

app.use(express.static('static')); // Serve static files from the 'static' directory

// Route to serve the registration form HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html')); // Send the index.html file when '/' is accessed
});

// Endpoint to check if an email already exists in the database
app.post('/check-email', (req, res) => {
  const email = req.body.Email; // Extract email from the request body

  // Check if the email exists in the tasks collection
  tasks_coll.findOne({ Email: email }, (err, doc) => {
    if (err) {
      return res.status(500).json({ error: err.message }); // Return 500 status with error message if MongoDB query fails
    }
    if (doc) {
      return res.status(400).json({ error: 'Email already exists' }); // Return 400 status if email already exists in the database
    }
    res.status(200).json({ msg: 'Email is available' }); // Return 200 status if email is available
  });
});

// Endpoint to handle user registration
app.post('/tasks', async (req, res) => {
  const { First_name, last_name, Phone, Email, Password, Password_verification } = req.body; // Destructure user registration data from request body

  // Validation checks for registration data
  if (!Email || !/^\S+@\S+\.\S+$/.test(Email)) {
    return res.status(400).json({ error: "Invalid or empty email" }); // Return 400 status with error if email is invalid or empty
  }
  if (!First_name || !last_name) {
    return res.status(400).json({ error: "First name and last name are required" }); // Return 400 status with error if first name or last name is missing
  }
  if (!Password || Password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long" }); // Return 400 status with error if password is less than 8 characters
  }
  if (Password !== Password_verification) {
    return res.status(400).json({ error: "Password verification does not match" }); // Return 400 status with error if password verification does not match
  }

  try {
    const hashedPassword = await bcrypt.hash(Password, 10); // Hash the password with bcrypt (salt rounds: 10)

    // Create a new task object with hashed password
    const task = { First_name, last_name, Phone, Email, Password: hashedPassword };

    // Insert the task object into MongoDB collection
    tasks_coll.insert(task, (err, doc) => {
      if (err) {
        return res.status(500).json({ error: err.message }); // Return 500 status with error if MongoDB insertion fails
      }
      res.status(200).json({ msg: "Registration successful", task: doc }); // Return 200 status with success message and inserted document
    });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Return 500 status with error if bcrypt hashing fails
  }
});

// Endpoint to handle deletion of user record
app.post('/delete', async (req, res) => {
  const { Email, Password } = req.body; // Destructure email and password from request body

  // Find user record in MongoDB collection based on email
  tasks_coll.findOne({ Email: Email }, async (err, doc) => {
    if (err) {
      return res.status(500).json({ error: err.message }); // Return 500 status with error if MongoDB query fails
    }
    if (!doc) {
      return res.status(400).json({ error: "Email not found" }); // Return 400 status with error if email does not exist in database
    }

    // Compare hashed password with provided password using bcrypt
    const passwordMatch = await bcrypt.compare(Password, doc.Password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid password" }); // Return 400 status with error if passwords do not match
    }

    // Remove user record from MongoDB collection
    tasks_coll.remove({ Email: Email }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message }); // Return 500 status with error if MongoDB deletion fails
      }
      res.status(200).json({ msg: "Record deleted successfully" }); // Return 200 status with success message
    });
  });
});

const PORT = process.env.PORT || 3000; // Set port for server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Start listening on specified port and log a message
});
