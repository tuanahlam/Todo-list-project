// select element
const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo");
const todoListElm = document.getElementById("todos-list");
const notificationEl = document.querySelector(".notification")


//Vars 
let todos = JSON.parse(localStorage.getItem('todos')) || []; 
let EditTodoId = -1;

// 1st render 
renderTodos()

// Form submit
form.addEventListener("submit", function (event) {
  event.preventDefault();
  //console.log(event.target.tagName) Nothing

  saveTodo();
  renderTodos();
  localStorage.setItem('todos' , JSON.stringify(todos));
});

//Save to do
function saveTodo() {
  const todoValue = todoInput.value;
  // check if the todo is empty
  const isEmpty = todoValue === "";
  // check duplicate
  const isDuplicate = todos.some((todo) => todo.value.toUpperCase() === todoValue.toUpperCase()); //Got it; This is arrow function
  if (isEmpty) {
    showNotification("Todo's is empty");
  } else if (isDuplicate) {
    showNotification("Todo already exist!");
  } else {
    if (EditTodoId >= 0) {
      todos = todos.map((todo, index) => ({
        ...todo,
        value: index === EditTodoId ? todoValue : todo.value,
      }));
      EditTodoId = -1;
    } else {
      todos.push({
        value: todoValue,
        checked: false,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      });
    }

    todoInput.value = "";
  }
}

//Render ToDos
function renderTodos() {
  if(todos.length === 0){
    todoListElm.innerHTML = '<center>Nothing to do! </center>'
    return;
  }
  //Clear element before render
  todoListElm.innerHTML = "";
  //Render toDos
  todos.forEach((todo, index) => {
    todoListElm.innerHTML += `
    <div class="todo" id= ${index}>
    <i 
        class="bi ${todo.checked ? "bi-check-circle-fill" : "bi-circle"}"
        style="color : ${todo.color}"
        data-action = "check"
      ></i> 
      <p class=" ${todo.checked ? 'checked' : ''}" data-action = "check">${todo.value}</p>
    <i class="bi bi-pencil-square" data-action = "edit"></i>
    <i class="bi bi-trash" data-action = "delete"></i> 
</div>`;
  });
}

// Click event listener for all the todos
todoListElm.addEventListener("click", (event) => {
  const target = event.target;
  const parentElement = target.parentNode;

  if (parentElement.className !== "todo") return;
  // /todo Id
  const todo = parentElement;
  const todoId = Number(todo.id);
  // target action check, edit ,del
  const action = target.dataset.action;

  action === "check" && checkTodo(todoId);
  action === "edit" && editTodo(todoId);
  action === "delete" && deleteTodo(todoId);
  //console.log(todoId,action);
});

//checkTodo function
function checkTodo(todoId) {
  todos = todos.map((todo, index) => ({
    ...todo,
    checked: index === todoId ? !todo.checked : todo.checked,
  }));

  renderTodos();
  localStorage.setItem('todos' , JSON.stringify(todos));
}

//EDit A todo
function editTodo(todoId) {
  todoInput.value = todos[todoId].value;
  EditTodoId = todoId;
}


//Delete to do 
function deleteTodo(todoId){
  todos = todos.filter((todo, index) => index !== todoId);
  EditTodoId = -1;
  localStorage.setItem('todos' , JSON.stringify(todos));

  // re render todo 
  renderTodos();
  localStorage.setItem('todos' , JSON.stringify(todos));
}

//Show notification 
function showNotification(msg){
  notificationEl.innerHTML = msg;
 //notification enter
  notificationEl.classList.add('notif-enter');
  //notificaton remove
  setTimeout(() =>{
    notificationEl.classList.remove('notif-enter')
  }, 2000)
}


