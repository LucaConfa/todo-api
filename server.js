var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var PORT = 3000;
var todos = [];
var todoNextId = 1;
var requiredFields = ['description', 'completed'];

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Todo API');
});

// GET todos collection
app.get('/todos', (req, res) => {
  res.json(todos);
});

// GET todo by id
app.get('/todos/:id', (req, res) => {
  var todoId = parseInt(req.params.id, 10);

  var foundTodo = _.find(todos, { id: todoId });

  if (typeof foundTodo === 'undefined') {
    res.status(404).send('404');
  } else {
    res.json(foundTodo);
  }
});

// POST create new todo
app.post('/todos', (req, res) => {
  let body = req.body;
  body = _.pick(body, requiredFields);

  if (!_.isBoolean(body.completed) || !_.isString(body.description)
    || body.description.trim().length === 0) {
    return res.status(400).send('400');
  }

  body.description = body.description.trim();
  body.id = todoNextId++;
  todos.push(body);

  res.json(body);
});

// DELETE a todo
app.delete('/todos/:id', (req, res) => {

  var todoId = parseInt(req.params.id, 10);
  var foundTodo = _.find(todos, { id: todoId });

  if (typeof foundTodo === 'undefined') {
    res.status(404).send({ status: 404, error: 'No todo found' });
  } else {
    todos = _.without(todos, foundTodo);
    res.json(foundTodo);
  }
});

// update a todo
app.patch('/todos/:id', (req, res) => {
  let body = req.body;
  body = _.pick(body, requiredFields);
  let todoId = parseInt(req.params.id, 10);
  let foundTodo = _.find(todos, { id: todoId });

  let validAttributes = [];

  if(!foundTodo){
    return res.status(404).send('404');
  }

  if (_.has(body, 'completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (_.has(body, 'completed')) {
    return res.status(400).send('400');
  }

  if (_.has(body, 'description') && _.isString(body.description) && body.description.length > 0) {
    validAttributes.description = body.description;
  } else if (_.has(body, 'description')) {
    return res.status(400).send('400');
  }

  // validation is passed
  _.assignIn(foundTodo, validAttributes);
  
  res.json(foundTodo);
});



app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});