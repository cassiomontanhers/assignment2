const express = require('express')
const helmet = require('helmet')
const http = require('http')
const MessagingResponse = require('twilio').twiml.MessagingResponse
const cors = require('cors')
const bodyParser = require('body-parser')
const pool = require('./dbconnection')
const winston = require('winston')

const app = express()

app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();
    insertTodo(req.body.Body, function(data){
      twiml.message(data);
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    });
})

app.get('/list', (req, res) => {
    var data = getAllTodos(req.query,function(data){
      res.json(data);
    }
    );
})

app.get('/', (req, res) => {
  var data = {status: 200,
              message: "Success",
              info : "Hello, this API is a Todo List using twilo, you can send a message to (604) 260-0259 to insert a new todo item, and retrieve information using the get method /list."};
    res.json(data);
})

async function getAllTodos(param,callback) {
  try {
    if(param.code == 'fail'){
      throw("Code intended to throw an error.");
    }
    logger.log({
      level: 'info',
      message: 'Fetching todo list.',
    });
    const result = await pool.query(`select * from todo`)
    var strData = JSON.stringify(result);
    var jsonData = JSON.parse(strData);
    var data = {status: 200,
                  message: "Success",
                  todoList : jsonData};
    callback(data);
  } catch (error) {
    logger.log({
      level: 'error',
      message: 'It was not possible to fetch the todo list.'+error,
    });
    var data = {status: 500,
                  message: "Failure. It was not possible to retrieve the todo list.",
                  error : error};
    callback(data);
  }
}

async function insertTodo(text, callback) {
  try {
    logger.log({
      level: 'info',
      message: 'Saving a new todo item.',
    });
    const newTodo = await pool.query(`insert into todo values(null, '${text}');`)
    callback("Todo item successfully saved: " + text);
  } catch (error) {
    logger.log({
      level: 'error',
      message: 'It was not possible to save the new todo item.'+error,
    });
    callback("Error. Todo item couldn't be saved " + error);
  }
}


module.exports = app
// http.createServer(app).listen(1337, () => {
//   console.log('Express server listening on port 1337');
// });
