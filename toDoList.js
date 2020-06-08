const form = document.querySelector(".js-toDoForm"),
  input = form.querySelector("input"),
  pendingList = document.querySelector(".js-Pending"),
  finishedList = document.querySelector(".js-Finished");

const PENDING_LS = "pending",
  FINISHED_LS = "finished";

const PENDING_STATUS = "pending",
  FINISHED_STATUS = "finished";

let pendingTodos = [];
let finishedTodos = [];

function undoTodo(e) {
  const btn = e.target;
  const li = btn.parentNode;
  const text = li.firstChild.innerHTML;
  deleteTodo(e, FINISHED_STATUS);
  paintTodo(text, PENDING_STATUS);
}

function finishTodo(e) {
  const btn = e.target;
  const li = btn.parentNode;
  const text = li.firstChild.innerHTML;
  deleteTodo(e, PENDING_STATUS);
  paintTodo(text, FINISHED_STATUS);
}

function saveTodo(status) {
  if (status === PENDING_STATUS) {
    localStorage.setItem(PENDING_LS, JSON.stringify(pendingTodos));
  } else if (status === FINISHED_STATUS) {
    localStorage.setItem(FINISHED_LS, JSON.stringify(finishedTodos));
  }
}

function deleteTodo(e, status) {
  const btn = e.target;
  const li = btn.parentNode;
  if (status === PENDING_STATUS) {
    pendingList.removeChild(li);
    const cleanToDos = pendingTodos.filter((todo) => {
      return todo.id !== parseInt(li.id, 10);
    });
    pendingTodos = cleanToDos;
    saveTodo(PENDING_LS);
  } else if (status === FINISHED_STATUS) {
    finishedList.removeChild(li);
    const cleanToDos = finishedTodos.filter((todo) => {
      return todo.id !== parseInt(li.id, 10);
    });
    finishedTodos = cleanToDos;
    saveTodo(FINISHED_LS);
  }
}

function paintTodo(text, status) {
  const li = document.createElement("li"),
    span = document.createElement("span"),
    delBtn = document.createElement("button"),
    finBtn = document.createElement("button"),
    undoBtn = document.createElement("button");

  span.innerText = text;
  li.appendChild(span);

  li.appendChild(delBtn);
  if (status === PENDING_STATUS) {
    const newID = pendingTodos.length + 1;
    delBtn.innerHTML = "❌";
    delBtn.addEventListener("click", (event) => {
      deleteTodo(event, PENDING_STATUS);
    });
    li.appendChild(delBtn);
    finBtn.innerHTML = "✅";
    finBtn.addEventListener("click", finishTodo);
    li.appendChild(finBtn);
    pendingList.appendChild(li);
    const todoObj = {
      text: text,
      id: newID,
      class: PENDING_STATUS,
    };
    li.id = newID;
    pendingTodos.push(todoObj);
    saveTodo(PENDING_LS);
  } else if (status === FINISHED_STATUS) {
    const newID = finishedTodos.length + 1;
    delBtn.innerHTML = "❌";
    delBtn.addEventListener("click", (event) => {
      deleteTodo(event, FINISHED_STATUS);
    });
    li.appendChild(delBtn);
    undoBtn.innerHTML = "⏪";
    undoBtn.addEventListener("click", undoTodo);
    li.appendChild(undoBtn);
    finishedList.appendChild(li);
    const todoObj = {
      text: text,
      id: newID,
      class: FINISHED_STATUS,
    };
    li.id = newID;
    finishedTodos.push(todoObj);
    saveTodo(FINISHED_LS);
  }
}

function handleSubmit(e) {
  e.preventDefault();
  const currentValue = input.value;
  paintTodo(currentValue, PENDING_STATUS);
  input.value = "";
}

function loadTodos() {
  const currentPending = localStorage.getItem(PENDING_LS);
  const currentFinished = localStorage.getItem(FINISHED_LS);
  if (currentPending !== null || currentFinished !== null) {
    const parsePendingTodos = JSON.parse(currentPending);
    const parseFinishedTodos = JSON.parse(currentFinished);
    parsePendingTodos.forEach((todo) => {
      const text = todo.text;
      paintTodo(text, PENDING_STATUS);
    });
    parseFinishedTodos.forEach((todo) => {
      const text = todo.text;
      paintTodo(text, FINISHED_STATUS);
    });
  }
}

function init() {
  loadTodos();
  form.addEventListener("submit", handleSubmit);
}
init();
