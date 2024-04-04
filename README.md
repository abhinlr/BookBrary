
# BooksBrary - Book CRUD Web Application

BookBrary is a web application for managing book details. It provides functionalities for creating, reading, updating, and deleting book records. The front end is built using Angular with Bootstrap and reactive forms for creating book details. The back end is powered by LoopBack 4, Node.js, and Express, with MongoDB as the database. Unit testing for the backend is performed using Mocha.


## Tech Stack

**Client:** Angular, Bootstrap, CSS, TypeScript

**Server:** Node, Express, Loopback4, Mocha, MongoDB


## Documentation

[Documentation](https://documenter.getpostman.com/view/23098033/2sA35LTyW4#bb549473-db00-4b43-b5f9-51e5ccc3c775)


## Installation

By default the client will be running on localhost:4200 and the server will be running on localhost:3000

## Run Locally

Clone the project

```bash
  git clone https://github.com/abhinlr/BookBrary.git
```

## To Run Client

Go to the project directory

```bash
  cd Client
```

Install dependencies

```bash
  npm install
```

Start the client

```bash
  ng serve
```

## To Run Server

Go to the project directory

```bash
  cd server
```

Install dependencies

```bash
  npm install
```

Start the client

```bash
  npm start
```




## For Unit Testing Server

Go to the project directory

```bash
  cd server
```

Run test

```bash
  lb-mocha --allow-console-logs "dist/__tests__"
```
or

```bash
  npm test
```

