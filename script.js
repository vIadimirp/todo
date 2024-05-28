// const { tr } = require("date-fns/locale");

addButton = document.querySelector('button#add-button');
addInput = document.querySelector('input#what');
todoItemsElem = document.querySelector('div#todo__items');
todoFiltersElem = document.querySelector('div#todo__filters');

todoItemsObjs = [];
maxId = 0;
filter = 0;
inputFocused = false;


function updateLocalStorage() {
    localStorage.setItem('data', JSON.stringify(todoItemsObjs));
    localStorage.setItem('mxid', maxId);
    localStorage.setItem('fltr', filter);
}

function countItems() {
    // ...
}

function getFilteredTodoItemsObjs() {
    if (filter == 0) {
        return todoItemsObjs;
    } else if (filter == 1) {
        result = [];
        todoItemsObjs.map(todoItem => {
            if (todoItem['done']) {
                result.push(todoItem);
            }
        });
        return result;
    } else if (filter == 2) {
        result = [];
        todoItemsObjs.map(todoItem => {
            if (!todoItem['done']) {
                result.push(todoItem);
            }
        });
        return result;
    }
}

function setFilter(f) {
    filter = f;
    if (filter === 0) {
        document.querySelectorAll('button.todo__filter')[0].classList.add('active');
        document.querySelectorAll('button.todo__filter')[1].classList.remove('active');
        document.querySelectorAll('button.todo__filter')[2].classList.remove('active');
    } else if (filter === 1) {
        document.querySelectorAll('button.todo__filter')[0].classList.remove('active');
        document.querySelectorAll('button.todo__filter')[1].classList.add('active');
        document.querySelectorAll('button.todo__filter')[2].classList.remove('active');
    } else if (filter === 2) {
        document.querySelectorAll('button.todo__filter')[0].classList.remove('active');
        document.querySelectorAll('button.todo__filter')[1].classList.remove('active');
        document.querySelectorAll('button.todo__filter')[2].classList.add('active');
    }
    drawTodoItems();
    updateLocalStorage();
}

function drawTodoItem(itemObj) {
    let itemElem = document.createElement('div');
    itemElem.classList.add('todo__item');

    let doneCheckbox = document.createElement('button');
    doneCheckbox.classList.add('done-checkbox');
    if (itemObj['done']) {doneCheckbox.classList.add('active')}
    doneCheckbox.addEventListener('click', () => {
        todoItemsObjs.map(todoItem => {
            if (todoItem['id'] === itemObj['id']) {
                todoItem['done'] = !todoItem['done'];
            }
        });
        drawTodoItems();
        updateLocalStorage();
    });

    let tick = document.createElement('span');
    tick.textContent = 'done';
    tick.classList.add('material-symbols-outlined');

    let textElem = document.createElement('div');
    textElem.textContent = itemObj['text'];
    textElem.classList.add('text');

    let removeButton = document.createElement('button');
    removeButton.classList.add('remove-btn');
    removeButton.addEventListener('click', () => {
        removeTodoItem(itemObj['id']);
    });

    let removeIcon = document.createElement('span');
    removeIcon.textContent = 'delete';
    removeIcon.classList.add('material-symbols-outlined');

    doneCheckbox.appendChild(tick);
    removeButton.appendChild(removeIcon);
    itemElem.appendChild(doneCheckbox);
    itemElem.appendChild(textElem);
    itemElem.appendChild(removeButton);
    todoItemsElem.appendChild(itemElem);
}

function drawTodoItems() {
    todoItemsElem.textContent = '';
    if (todoItemsObjs.length > 0) {
        getFilteredTodoItemsObjs().map(todoItem => drawTodoItem(todoItem));
        todoItemsElem.classList.remove('empty');
        todoFiltersElem.classList.remove('hidden');
    } else {
        todoItemsElem.classList.add('empty');
        todoFiltersElem.classList.add('hidden');
    }
}

function addTodoItem(text) {
    if (text == '') {text = 'Unnamed';}
    itemObj = {
        'id': maxId,
        'text': text,
        'done': false
    }; maxId++;
    todoItemsObjs.push(itemObj);
    drawTodoItems();
    updateLocalStorage();
}

function removeTodoItem(id) {
    todoItemsObjs.map((todoItem, index) => {
        if (todoItem['id'] === id) {
            todoItemsObjs.splice(index, 1);
        }
    });
    drawTodoItems();
    updateLocalStorage();
}

function focusAddInput() {
    addButton.classList.add('active');
    addInput.classList.add('active');
    addInput.value = '';
    addInput.focus();
    inputFocused = true;
}

function unfocusAddInput() {
    addButton.classList.remove('active');
    addInput.classList.remove('active');
    inputFocused = false;
}


function setup() {
    if (localStorage.getItem('data')) {
        todoItemsObjs = JSON.parse(localStorage.getItem('data'));
    } if (localStorage.getItem('mxid')) {
        maxId = +localStorage.getItem('mxid');
    } if (localStorage.getItem('fltr')) {
        filter = +localStorage.getItem('fltr');
    } drawTodoItems(); setFilter(filter);
    addInput.addEventListener('focusout', e => {
        if (e.relatedTarget == null) {
            unfocusAddInput();
        }
    });
    addInput.addEventListener('input', () => {
        if (addInput.value.length > 40) {
            addInput.value = addInput.value.slice(0, addInput.value.length - 1);
        }
    });
    addButton.addEventListener('click', () => {
        if (addButton.classList.contains('active')) {
            addTodoItem(addInput.value);
            addInput.value = '';
            unfocusAddInput();
        } else {
            focusAddInput();
        }
    });
    document.addEventListener('keypress', e => {
        if (inputFocused && e.key == 'Enter') {
            addTodoItem(addInput.value);
            addInput.value = '';
            unfocusAddInput();
        } else if (e.key == '+') {
            focusAddInput();
            setTimeout(() => addInput.value = '', 0);
        }
    });
} setup();
