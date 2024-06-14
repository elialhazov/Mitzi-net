//Eliyahu Alhazov - 318874831
//Michael Miron - 315199109

document.addEventListener("DOMContentLoaded", function() {
  // Retrieve form elements by their IDs
  const emailField = document.getElementById('Email');
  const registerForm = document.getElementById('registerForm');
  const emailError = document.getElementById('emailError');
  const submitButton = document.getElementById('submitButton');
  const deleteForm = document.getElementById('deleteForm');
  const deleteEmailField = document.getElementById('deleteEmail');
  const deletePasswordField = document.getElementById('deletePassword');
  const deleteEmailError = document.getElementById('deleteEmailError');

  // Helper function to validate names (only letters)
  function validateName(name) {
    return /^[a-zA-Z]+$/.test(name); // Regular expression to test for letters only
  }

  // Helper function to validate phone numbers (only digits, at least 8)
  function validatePhone(phone) {
    return /^[0-9]{8,}$/.test(phone); // Regular expression to test for at least 8 digits
  }

  // Event listener for email field blur event
  emailField.addEventListener('blur', () => {
    const email = emailField.value; // Get the value of the email field
    fetch('/check-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Set the content type to JSON
      },
      body: JSON.stringify({ Email: email }) // Send the email in the request body
    })
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
      if (data.error) {
        emailError.textContent = data.error; // Display error message if email already exists
        submitButton.disabled = true; // Disable the submit button
      } else {
        emailError.textContent = ''; // Clear the error message
        submitButton.disabled = false; // Enable the submit button
      }
    })
    .catch(err => {
      emailError.textContent = 'Error checking email'; // Display generic error message
      submitButton.disabled = true; // Disable the submit button on error
    });
  });

  // Event listener for registration form submission
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Retrieve form field values
    const First_name = document.getElementById('First_name').value;
    const last_name = document.getElementById('last_name').value;
    const Phone = document.getElementById('Phone').value;
    const Email = document.getElementById('Email').value;
    const Password = document.getElementById('Password').value;
    const Password_verification = document.getElementById('Password_verification').value;

    // Validate names and phone number
    if (!validateName(First_name)) {
      alert('First name should contain only letters.'); // Alert for invalid first name
      return;
    }

    if (!validateName(last_name)) {
      alert('Last name should contain only letters.'); // Alert for invalid last name
      return;
    }

    if (!validatePhone(Phone)) {
      alert('Phone number should contain only numbers and be at least 8 digits long.'); // Alert for invalid phone number
      return;
    }

    // Send registration data to the server
    fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Set the content type to JSON
      },
      body: JSON.stringify({ First_name, last_name, Phone, Email, Password, Password_verification }) // Send form data in the request body
    })
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
      if (data.error) {
        alert(data.error); // Display error message if registration fails
      } else {
        alert('Registration successful!'); // Display success message
        registerForm.reset(); // Reset the form
      }
    })
    .catch(err => {
      alert('Error during registration'); // Display generic error message on fetch error
    });
  });

  // Event listener for delete form submission
  deleteForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Retrieve form field values
    const Email = deleteEmailField.value;
    const Password = deletePasswordField.value;

    // Send delete request to the server
    fetch('/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Set the content type to JSON
      },
      body: JSON.stringify({ Email, Password }) // Send form data in the request body
    })
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
      if (data.error) {
        alert(data.error); // Display error message if deletion fails
      } else {
        alert('Record deleted successfully'); // Display success message
        deleteForm.reset(); // Reset the form
      }
    })
    .catch(err => {
      alert('Error during deletion'); // Display generic error message on fetch error
    });
  });
});


