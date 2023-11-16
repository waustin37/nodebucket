/**
 * Title: app.js
 * Author: Professor Krasso
 * Date: 8/5/2023
 */


// Require statements
const express = require('express');
const createServer = require('http-errors');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const swaggerJS = require('swagger-jsdoc');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const employeeAPI = require('./routes/employee-routes');


// Create the Express app
let app = express()

//Create MongoDB Connection
const CONN = 'mongodb+srv://waustin37:wa16171617@cluster0.hkbvlmn.mongodb.net/nodebucketDB?retryWrites=true&w=majority';
mongoose.connect(CONN).then(() => {
    console.log('Connection to the database was successful');
}).catch(err => {
    console.log('MongoDB Error: ' + err.message);
});


// Configure the app
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../dist/nodebucket')))
app.use('/', express.static(path.join(__dirname, '../dist/nodebucket')))
app.use(cors({ origin: 'http://localhost:4200' }));

const options = {
  definition: {
      openapi: '3.0.0',
      info: {
          title: 'NodeBucket',
          version: '1.0.0',
      },
  },
  apis: ['./server/routes/employee-routes.js'], 
}
const openapiSpecifications = swaggerJS(options);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openapiSpecifications));
app.use('/api', employeeAPI);

// error handler for all other errors
app.use(function(err, req, res, next) {
  res.status(err.status || 500) // set response status code

  // send response to client in JSON format with a message and stack trace
  res.json({
    type: 'error',
    status: err.status,
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined
  })
})


module.exports = app // export the Express application