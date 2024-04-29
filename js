// Eliyahu Alhazov 318874831

function validateForm() {
    // Clear massage function
    clearMessages();

    // Check variables
    var firstName = document.getElementById("first-name").value;
    var lastName = document.getElementById("last-name").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm-password").value;

    var isValid = true;

    // check if the fields currect
    if (firstName.trim() === "") {
        isValid = false;
        showMessage("First name is required", "first-name");
    }

    if (lastName.trim() === "") {
        isValid = false;
        showMessage("Last name is required", "last-name");
    }

    if (phone.trim() === "") {
        isValid = false;
        showMessage("Phone is required", "phone");
    }

    if (email.trim() === "") {
        isValid = false;
        showMessage("Email is required", "email");
    }

    if (password.trim() === "") {
        isValid = false;
        showMessage("Password is required", "password");
    } else if (password.length < 8) {
        isValid = false;
        showMessage("Password must be at least 8 characters long", "password");
    }

    if (confirmPassword.trim() === "") {
        isValid = false;
        showMessage("Confirm Password is required", "confirm-password");
    } else if (password !== confirmPassword) {
        isValid = false;
        showMessage("Passwords do not match", "confirm-password");
    }

// if all fields is good return true
    return isValid;
}

// Function to display an error message
function showMessage(message, elementId) {

        // Create a new <div> element for the error message
    var messageElement = document.createElement("div");
    messageElement.className = "error-message";
    messageElement.textContent = message;
    var inputElement = document.getElementById(elementId);
    inputElement.parentNode.appendChild(messageElement);
    inputElement.style.borderColor = "red";
}

// Function to clear all error messages and reset input borders
function clearMessages() {
    var messages = document.getElementsByClassName("error-message");
    while (messages.length > 0) {
        messages[0].parentNode.removeChild(messages[0]);
    }

        // Get all input elements
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].style.borderColor = "";
    }
}
