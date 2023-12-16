# YKHO-Pharmacy

The project revolves around establishing a comprehensive virtual clinic integrated with an associated pharmacy, serving both the clinic and its patients. El7a2ny presents a software solution designed for clinics, doctors, pharmacists, and patients, aiming to simplify and automate the interactions among patients, medical professionals, and pharmacists. This encompasses a wide range of functionalities, including searching for a doctor, scheduling appointments, conducting on-site or virtual meetings, receiving prescriptions, setting up follow-up reminders, accessing medical histories, and ordering prescribed medications.

## Table of Contents
- [Motivation](#motivation)
- [Build Status](#build-status)
- [Code Style](#code-style)
- [Screenshots](#screenshots)
- [Tech/Framework used](#techframework-used)
- [Features](#features)
- [Code Examples](#code-examples)
- [Installation](#installation)
- [API Refrences](#api-refrences)
- [Tests](#tests)
- [How To Use](#how-to-use)
- [Contribute](#contribute)
- [Credits](#credits)
- [License](#license)

## Motivation

The motivation behind the YKHO-Pharmacy project includes:

- Gain proficiency in utilizing the Agile Methodology for effective project planning and software development.
- Understand the process of implementing software development based on a predefined set of system requirements.
- Acquire research skills and expertise in utilizing the MERN Stack (MongoDB, Express.js, React, Node.js).
- Learn collaborative teamwork using GitHub as a platform.
- Develop the ability to integrate and merge two functioning systems into a unified solution.

## Build Status

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](link_to_ci_cd_pipeline)

This section provides information about the current build status of the project. The badge above indicates that the build is passing, ensuring that the project is in a stable state. 

If you encounter any bugs, errors, or issues, please [open an issue](link_to_project_issues) on our GitHub repository. By reporting issues, you contribute to the improvement of the project. Developers familiar with the issue can provide solutions or insights directly, saving time and ensuring a more efficient resolution.

## Code Style

We follow a set of coding conventions to maintain consistency throughout the project. Contributors are encouraged to adhere to the following guidelines:

- **Indentation:** Use 2 spaces for indentation.
- **Naming Conventions:** Follow camelCase for variable and function names.
- **Comments:** Include comments for complex code sections or where additional explanation is needed.
- **File Organization:** Organize files logically, placing related files in the same directory.
- **Error Handling:** Implement proper error handling to enhance code robustness.
- **Documentation:** Include inline documentation for functions and major code sections using JSDoc comments.

### Example

Here is an example illustrating the preferred coding style for this project:

```javascript
// Good
function calculateTotalPrice(itemPrice, quantity) {
  // Calculate the total price
  const totalPrice = itemPrice * quantity;

  return totalPrice;
}

// Bad
function calculateTotal(item_price, Quantity) {
  const total = item_price * Quantity; // Calculating total
  return total; // Return total
}
```

## Screenshots

Here are some screenshots showcasing the key features of the YKHO-Pharmacy project:

<details>
<summary><strong>Screenshots</strong></summary>

1. **Login:**
   ![Login](https://github.com/advanced-computer-lab-2023/YKHO-Pharmacy/blob/242981dd8eb6a9b98eca518a8f0727cfff6e8bbf/login.png?raw=true)

2. **Register:**
   ![Register](https://github.com/advanced-computer-lab-2023/YKHO-Pharmacy/blob/main/register.png?raw=true)

3. **Reset Password:**
   ![Request](https://github.com/advanced-computer-lab-2023/YKHO-Pharmacy/blob/main/resetPassword.png?raw=true)
   ![OTP](https://github.com/advanced-computer-lab-2023/YKHO-Pharmacy/blob/main/otp.png?raw=true)
   ![Reset](https://github.com/advanced-computer-lab-2023/YKHO-Pharmacy/blob/main/passwordChange.png?raw=true)

4. **Home Page:**
   ![Patient](https://github.com/advanced-computer-lab-2023/YKHO-Pharmacy/blob/main/home.png?raw=true)
   ![Pharmacist](https://github.com/advanced-computer-lab-2023/YKHO-Pharmacy/blob/main/pharmHome.png?raw=true)
   ![Admin](https://github.com/advanced-computer-lab-2023/YKHO-Pharmacy/blob/main/homeadmin.png?raw=true)

</details>


## Tech/Framework used

The YKHO-Pharmacy project utilizes the MERN Stack (MongoDB, Express.js, React, Node.js) for its development:

- [MongoDB](https://www.mongodb.com/): A NoSQL database used for storing and managing data.
- [Express.js](https://expressjs.com/): A web application framework for Node.js, simplifying the development of server-side applications.
- [React](https://reactjs.org/): A JavaScript library for building user interfaces, used for creating dynamic and interactive client-side components.
- [Node.js](https://nodejs.org/): A JavaScript runtime environment that allows the execution of server-side code.

These technologies collectively provide a robust and efficient foundation for the development of the virtual clinic and pharmacy solution.

## Features

The YKHO-Pharmacy project incorporates the following key features:

1. **User Authentication:**
   - Secure user authentication system for patients, administrators, and pharmacists.

2. **Admin Panel:**
   - An interface to manage and administrate the system as a whole.

3. **Telemedicine Integration:**
   - Seamless integration for conducting real-time meetings and consultations between pharmacists, patients, and doctors.

4. **Prescription Ordering:**
   - Electronic prescription system for patient to issue and purchase medication.

5. **Follow-up Reminders:**
   - Automated reminders for pharmacists to follow up on medicines that are out of stock.

6. **Order History Access:**
   - Centralized access to order histories for patients to provide better-informed care.

7. **Medication Ordering:**
   - User-friendly system for patients to order medications from the integrated pharmacy.

8. **Search Functionality:**
   - Efficient search capabilities to help users find specific medicines.

9. **Filter Functionality:**
   - Efficient filter capabilities to help users find specific medicines.

10. **Sales Report Dashboard:**
    - A dashboard for pharmacists to view sales performance of each medicine.

11. **Data Security:**
    - Implementation of robust security measures to safeguard patient and medical data.

12. **User Registration:**
    - An interface to allow users to register to the system.

13. **User Login:**
    - An interface to allow users to login to the system using their credentials. 

14. **OTP Password-Reset:**
    - A secure method to allow users to reset their forgotten passwords using a OTP sent through email.

15. **Pharmacist Panel:**
    - An interface to manage and administrate the system with stuff related to medicines and patients.

These features collectively contribute to creating a comprehensive virtual clinic and pharmacy solution, enhancing the overall healthcare experience for users.

## Code Examples

### User Authentication:

```javascript
// Placeholder code for user authentication logic
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}
```

### Search Functionality:

```javascript
// Placeholder code for search logic
exports.searchMedicines = async (req, res) => {
  try {
    const { search } = req.query;
    const searchRegex = new RegExp(search, 'i');
    const medicines = await Medicine.find({ name: searchRegex });
    res.render('patient/medicines', { medicines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

### Filter Functionality:

```javascript
// Placeholder code for filter logic
exports.filterMedicinesByMedUse = async (req, res) => {
  try {
    const { medUse } = req.query;

    if (!medUse) {
      return res.status(400).json({ error: 'Please provide a "medUse" filter' });
    }

    const medicines = await Medicine.find({ medUse: medUse });
    res.render('patient/medicines', { medicines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

### Create Medicine Functionality

```javascript
// Placeholder code for create medicine logic
exports.createMedicine = async (req, res) => {
  try {
    const {
      image,
      name,
      dosage,
      description,
      medUse,
      detail,
      quantity,
      sales,
      price,
      needPres,
    } = req.body;

    const prescriptionRequired = needPres === 'on';

    let existingMedicine = await Medicine.findOne({ name });

    if (existingMedicine) {
      return res.status(404).json({
        message: 'Medicine with the same name already exists',
        medicine: existingMedicine,
      });
    }

    const newMedicine = new Medicine({
      image,
      name,
      dosage,
      description,
      medUse,
      detail,
      quantity,
      sales,
      price,
      needPres: prescriptionRequired,
    });

    await newMedicine.save();

    res.status(201).json({
      message: 'Medicine added successfully',
      medicine: newMedicine,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

### Change Password Functionality:

```javascript
// Placeholder code for change password logic
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const username = req.session.user.username;

    const admin = await Administrator.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: 'Administrator not found' });
    }

    if (oldPassword !== admin.password) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

### Reset Password Functionality:

```javascript
// Placeholder code for reset password logic
exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const username = req.session.user.username;

    const admin = await Administrator.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: 'admin not found' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

## Installation

Follow these steps to set up and run the YKHO-Pharmacy project locally:

### Prerequisites

Make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/): JavaScript runtime for executing server-side code.
- [npm](https://www.npmjs.com/) (Node Package Manager): Package manager for JavaScript.

### Install Dependencies

```bash
npm install
```

### Install Additional Packages

```bash
npm install express mongoose multer socket.io
```

### Clone the Repository

```bash
git clone https://github.com/advanced-computer-lab-2023/YKHO-Pharmacy.git
cd YKHO-Pharmacy
```

## API References

### Admin Routes

- **Home**: `GET /admin/adminHome`
- **Add Administrator**: 
  - View: `GET /admin/addadministrator`
  - Action: `POST /admin/addadministrator`
- **Remove Pharmacist**: 
  - View: `GET /admin/removePharmacist`
  - Action: `POST /admin/removePharmacist`
- **Remove Patient**: 
  - View: `GET /admin/removePatient`
  - Action: `POST /admin/removePatient`
- **Get Patient**: 
  - View: `GET /admin/getPatient`
  - Action: `POST /admin/getPatient`
- **Get Pharmacist**: 
  - View: `GET /admin/getPharmacist`
  - Action: `POST /admin/getPharmacist`
- **Get Requests**: `GET /admin/getRequests`
- **Accept Request**: `POST /admin/acceptRequest`
- **Reject Request**: `POST /admin/rejectRequest`
- **Medicines**: `GET /admin/medicines`
- **Search Medicines**: `GET /admin/searchMedicines`
- **Filter Medicines by Medical Use**: `GET /admin/medicines/filter`
- **Change Password**: 
  - View: `GET /admin/change-password`
  - Action: `POST /admin/change-password`
- **Reset Password**: 
  - View: `GET /admin/resetPassword`
  - Action: `POST /admin/resetPassword`
- **Sales Report**: 
  - View: `GET /admin/salesReport`
  - Action: `POST /admin/salesReport`

### Patient Routes

- **Home**: `GET /patient/patientHome`
- **Medicines**: `GET /patient/medicines`
- **Search Medicines**: `GET /patient/searchMedicines`
- **Filter Medicines by Medical Use**: `GET /patient/medicines/filter`
- **Change Password**: 
  - View: `GET /patient/change-password`
  - Action: `POST /patient/change-password`
- **Reset Password**: 
  - View: `GET /patient/resetPassword`
  - Action: `POST /patient/resetPassword`
- **Add to Cart**: `POST /patient/addToCart`
- **Shopping Cart**: `GET /patient/ShoppingCart`
- **Remove From Cart**: `POST /patient/removeFromCart`
- **Edit Cart Item Quantity**: `POST /patient/editCartItemQuantity`
- **Get Checkout**: `GET /patient/getcheckout`
- **Add Address**: `POST /patient/addAddress`
- **Checkout**: `POST /patient/checkout`
- **Empty Cart**: `POST /patient/emptyCart`
- **Success Page**: `GET /patient/success`
- **Failed Order**: `POST /patient/failedOrder`
- **Failure Page**: `GET /patient/failure`
- **Orders**: `GET /patient/orders`
- **Cancel Order**: `POST /patient/cancelOrder`
- **Wallet**: `GET /patient/wallet`
- **Chat**: `GET /patient/chat`
- **Alternative Medicines**: `GET /patient/medicines/alternative`
- **Prescribed Medicines**: `GET /patient/presMed`
- **Upload Prescription**: 
  - View: `POST /patient/presMed`
  - Action: `upload.single('file')`

### Pharmacist Routes

- **Home**: `GET /pharmacist/pharmacistHome`
- **Medicines**: `GET /pharmacist/medicines`
- **Create Medicines**: 
  - View: `GET /pharmacist/createMedicines`
  - Action: `POST /pharmacist/createMedicines`
- **Search Medicines**: `GET /pharmacist/searchMedicines`
- **Filter Medicines by Medical Use**: `GET /pharmacist/medicines/filter`
- **Edit Medicines**: 
  - View: `POST /pharmacist/edit`
  - Action: `POST /pharmacist/editMedicine`
- **Change Password**: 
  - View: `GET /pharmacist/change-password`
  - Action: `POST /pharmacist/change-password`
- **Reset Password**: 
  - View: `GET /pharmacist/resetPassword`
  - Action: `POST /pharmacist/resetPassword`
- **Archive/Restore Medicine**: `POST /pharmacist/archive/:medicineId`
- **Wallet**: `GET /pharmacist/wallet`
- **Chat**: `GET /pharmacist/chat`
- **Notifications**: `GET /pharmacist/notifications`
- **Sales Report**: 
  - View: `GET /pharmacist/salesReport`
  - Action: `POST /pharmacist/salesReport`
- **All Sold Medicines Report**: `GET /pharmacist/allSoldMedicinesReport`
- **Filter Medicines by Name**: `GET /pharmacist/filterMedicinesByName`
- **Filter Medicines by Date**: `GET /pharmacist/filterMedicinesByDate`

### Guest Routes

- **Home**: `GET /guest/guestHome`
- **Create Patient**: 
  - View: `GET /guest/createPatient`
  - Action: `POST /guest/createPatient`
- **Create Request**: 
  - View: `GET /guest/createRequest`
  - Action: `POST /guest/createRequest`
- **Fetch File**: `GET /fetchFile`

### Authentication and Authorization

- **Login**: 
  - View: `GET /login`
  - Action: `POST /login`
- **Logout**: `GET /logout`
- **Authentication Middleware**: `isAuthenticated`

### OTP Routes

- **Enter OTP Page**: `GET /enter-otp`
- **Request Reset Page**: `GET /request-reset`
- **Request Reset**: `POST /request-reset`
- **Verify OTP**: `POST /verify-otp`

### Chat Routes

- **Get Chats**: `GET /chats`
- **Send Text Message**: `POST /text`
- **Mark Message as Read**: `POST /read`
- **Start Chat**: `POST /start`
- **Get Contacts**: `GET /contacts`

## Tests

### Overview

Testing for the YKHO-Pharmacy project is primarily conducted using Postman, a comprehensive API testing tool. The tests cover various scenarios to ensure the functionality and reliability of API endpoints.

### Testing with Postman

We leverage Postman collections and environments to structure and run tests. Below are examples of common scenarios tested using Postman:

#### 1. **User Authentication:**

   - Verify that a patient can successfully log in.
   - Check the authentication flow for administrators and pharmacists.

#### 2. **Medicine Operations:**

   - Test adding, updating, and retrieving medicine information.
   - Validate the search and filter functionality for medicines.

#### 3. **Order Management:**

   - Test the ordering process for patients.
   - Verify that pharmacists can receive and process orders.

#### 4. **Administrative Operations:**

   - Test administrator functionalities such as managing patients, pharmacists, and medicines.
   - Validate the approval and rejection of registration requests.

#### 5. **Pharmacist Operations:**

   - Validate medicine creation by pharmacists.
   - Check pharmacist-related functionalities like sales reports and notifications.

#### 6. **Patient Operations:**

   - Test patient-specific actions, including cart management and order placement.

### Continuous Testing

The Postman collections are integrated into our continuous integration pipeline, ensuring that API endpoints are tested automatically with each deployment.

### How to Run Tests

To execute Postman tests, follow these steps:

1. Open Postman.
2. Import the provided Postman collection and environment.
3. Configure the environment variables such as base URL and authentication tokens.
4. Run the entire collection or specific test suites.

Adjust the test scenarios based on your specific API endpoints and functionalities.

### Test Documentation

Detailed documentation of test cases, including expected responses and edge cases, is available within the Postman collection for reference.

### Test Reports

Postman generates test reports that can be reviewed for each test run, providing insights into test success, failures, and execution times.

## How To Use

Follow these step-by-step instructions to set up and run the YKHO-Pharmacy project locally:

### Prerequisites

1. **Node.js and npm:**
   - Ensure that Node.js is installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).

2. **MongoDB:**
   - Install MongoDB and make sure it's running. You can download it from [mongodb.com](https://www.mongodb.com/try/download/community).

### Clone the Repository

```bash
git clone <https://github.com/advanced-computer-lab-2023/YKHO-Pharmacy.git>
cd YKHO-Pharmacy
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

1. Create a .env file in the root directory.
2. Define the following environment variables in the .env file:
MONGODB_URI="mongodb+srv://fuji:Aaa12345@clinic.qyxz3je.mongodb.net/clinic?retryWrites=true&w=majority"

### Run The Application

```bash
cd client
npm start
cd src
node app
```
The application should now be running on http://localhost:3000.

## Contribute

We appreciate contributions from the community to enhance the YKHO-Pharmacy project. If you're interested in contributing, please follow these guidelines:

### How to Contribute

1. **Fork the Repository:**
   - Fork the [YKHO-Pharmacy repository](<repository-url>) to your GitHub account.

2. **Clone the Repository:**
   - Clone the forked repository to your local machine.

   ```bash
   git clone <your-forked-repository-url>
   cd YKHO-Pharmacy
   ```

3. **Create a Branch:**
   - Create a new branch for your contribution.

   ```bash
   git checkout -b feature/new-feature
   ```

4. **Make Changes:**
   - Implement your changes or additions. Ensure that your code follows the coding conventions and style guide.

5. **Test Your Changes:**
   - Test your changes locally to ensure they work as expected.

6. **Commit Changes:**
   - Commit your changes with a descriptive commit message.

   ```bash
   git add .
   git commit -m "Add feature: new feature"
   ```

7. **Push Changes:**
 - Push your changes to your forked repository.

   ```bash
   git push origin feature/new-feature
   ```

### Coding Guidlines

Follow the coding conventions and guidelines mentioned in the Code Style section of the project's documentation. This ensures consistency across the codebase.

### Reporting Issues

If you encounter any issues or have suggestions for improvements, please open an issue on the GitHub repository. Provide a detailed description of the problem or your suggestion.

### Get in Touch

If you have questions or need further assistance, feel free to reach out to us through the GitHub issues or contact the maintainers directly.

Thank you for contributing to the YKHO-Pharmacy project! Your efforts help make the project better for everyone.

## Credits

We would like to give credit to the following resources and individuals that have inspired or assisted in the development of the YKHO-Pharmacy project:

1. [TechStack Overflow](https://stackoverflow.com/): A valuable resource for technical questions and problem-solving.

2. [MERN Stack Tutorial](https://www.tutorialspoint.com/mern_stack/mern_stack_tutorial.pdf): An insightful tutorial that provided guidance on implementing the MERN stack.

3. [Node.js Documentation](https://nodejs.org/en/docs/): The official documentation for Node.js, which proved essential for understanding server-side JavaScript.

4. [React Documentation](https://reactjs.org/docs/getting-started.html): The official documentation for React, offering comprehensive guidance on building user interfaces.

5. [MongoDB University](https://university.mongodb.com/): Courses and resources from MongoDB University that helped in mastering MongoDB.

6. [Express.js Guide](https://expressjs.com/): The official guide for Express.js, aiding in building robust web applications.

7. [Socket.io Documentation](https://socket.io/docs/): The official documentation for Socket.io, which facilitated real-time communication implementation.

8. [Multer Documentation](https://www.npmjs.com/package/multer): Documentation for the Multer middleware used for handling file uploads.

9. [GitHub](https://github.com/): A collaborative platform that enabled version control and team collaboration.

10. [Open Source Community](https://opensource.org/): The broader open-source community for fostering collaborative development.

11. [PedroTech](https://www.youtube.com/@PedroTechnologies): A youtuber that helped us implementing complex tasks.

12. [Net Ninja](https://www.youtube.com/@NetNinja): A youtuber that helped us implementing complex tasks.

## License

The YKHO-Pharmacy project utilizes the following third-party libraries and frameworks, each governed by its respective license:

1. [Stripe](https://stripe.com/)
   - License: [Stripe Terms of Service](https://stripe.com/terms)

2. [Socket.io](https://socket.io/)
   - License: [MIT License](https://opensource.org/licenses/MIT)

3. [Multer](https://github.com/expressjs/multer)
   - License: [MIT License](https://opensource.org/licenses/MIT)

4. [Express.js](https://expressjs.com/)
   - License: [MIT License](https://opensource.org/licenses/MIT)

5. [Node.js](https://nodejs.org/)
   - License: [MIT License](https://opensource.org/licenses/MIT)

6. [MongoDB](https://www.mongodb.com/)
   - License: [Server Side Public License (SSPL)](https://www.mongodb.com/licensing/server-side-public-license)

7. [React](https://reactjs.org/)
   - License: [MIT License](https://opensource.org/licenses/MIT)

Please review the individual licenses for each component to ensure compliance with their terms.
