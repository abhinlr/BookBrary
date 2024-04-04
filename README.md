BookBrary - Book CRUD Web Application
BookBrary is a web application for managing book details. It provides functionalities for creating, reading, updating, and deleting book records. The front end is built using Angular with Bootstrap and reactive forms for creating book details. The back end is powered by LoopBack 4, Node.js, and Express, with MongoDB as the database. Unit testing for the backend is performed using Mocha.

Prerequisites
Before running the application, ensure you have the following software installed:

Node.js (version 18 or above)
MongoDB
Angular CLI (version 17 or above)
Installation
Clone the repository:

bash
Copy code
git clone <repository-url>
Navigate to the project directory:

bash
Copy code
cd BookBrary
Install dependencies for both the front end and the back end:

bash
Copy code
cd client
npm install
cd ../server
npm install
Running the Application
Front End (Angular)
To run the Angular front end:

bash
Copy code
cd client
ng serve
The front end will be accessible at http://localhost:4200 by default.

Back End (LoopBack 4)
To run the LoopBack 4 back end:

bash
Copy code
cd server
npm start
The back end will start running at http://localhost:3000.

Testing
Unit tests for the back end are written using Mocha and Chai. To run the tests:

bash
Copy code
cd server
npm test
Contributing
Contributions are welcome! Please follow the contributing guidelines.

License
This project is licensed under the MIT License.

Acknowledgments
Angular
Bootstrap
LoopBack
Mocha
Chai
MongoDB
Node.js
Express
Support
For support, please contact Abhijith P A.

Authors
Abhijith P A
