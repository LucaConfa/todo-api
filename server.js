var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var PORT = 3000;
var todos = [];
var todoNextId = 1;
var requiredFields = ['description', 'completed'];

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Todo API');
});

// GET todos collection
app.get('/todos', (req, res) =>{
  res.json(todos);
});

// GET todo by id
app.get('/todos/:id', (req, res) =>{
  var todoId = parseInt(req.params.id, 10);

  var foundTodo = _.find(todos,{id:todoId});

  if(typeof foundTodo === 'undefined'){
    res.status(404).send('404');
  } else {
    res.json(foundTodo);
  }
});

// POST create new todo
app.post('/todos', (req, res) => {
  let body = req.body;
  body = _.pick(body, requiredFields);

  if(!_.isBoolean(body.completed) || !_.isString(body.description) 
  || body.description.trim().length === 0){
    return res.status(400).send('400');
  }

  body.description = body.description.trim();
  body.id = todoNextId++;
  todos.push(body);

  res.json(body);
});


app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});