document.addEventListener("DOMContentLoaded", loadTasks); // Carregar tarefas ao iniciar

function loadTasks() {
    const categories = ["Saúde", "Trabalho", "Estudos", "Lazer", "Finanças", "Pessoal"];
    categories.forEach(category => {
        const tasks = JSON.parse(localStorage.getItem(category)) || [];
        const taskList = document.getElementById(`${category}Tasks`);
        tasks.forEach(task => {
            addTaskToDOM(task.text, category, task.completed);
        });
    });
}

document.getElementById("addButton").addEventListener("click", addTask);

function addTask() {
    const taskInput = document.getElementById("taskInput").value.trim();
    const categorySelect = document.getElementById("categorySelect").value;

    if (!taskInput || !categorySelect) {
        alert("Digite uma tarefa e selecione uma categoria!");
        return;
    }

    // Adiciona a nova tarefa ao DOM
    addTaskToDOM(taskInput, categorySelect, false);

    // Salvar tarefa no localStorage
    saveTaskToLocalStorage(taskInput, categorySelect, false);

    document.getElementById("taskInput").value = ""; // Limpar o campo de entrada
    document.getElementById("categorySelect").selectedIndex = 0; // Resetar seleção
}

function addTaskToDOM(taskInput, category, completed) {
    const taskList = document.getElementById(`${category}Tasks`);
    
    // Mostra a lista se estiver vazia
    taskList.style.display = "block"; 

    // Cria um novo item de tarefa
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    const taskText = document.createElement("span");
    taskText.classList.add("task-text");
    taskText.textContent = taskInput;

    if (completed) {
        taskItem.classList.add("completed");
        taskText.style.textDecoration = "line-through"; // Riscar a tarefa
    }

    const buttons = document.createElement("div");
    buttons.classList.add("buttons");

    const completeBtn = document.createElement("button");
    completeBtn.classList.add("complete-btn");
    completeBtn.textContent = "Concluir";
    completeBtn.addEventListener("click", () => {
        taskItem.classList.toggle("completed");
        if (taskItem.classList.contains("completed")) {
            taskText.style.textDecoration = "line-through"; // Risca a tarefa
            updateTaskInLocalStorage(taskInput, category, true);
        } else {
            taskText.style.textDecoration = "none"; // Remove o risco
            updateTaskInLocalStorage(taskInput, category, false);
        }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Excluir";
    deleteBtn.addEventListener("click", () => {
        taskList.removeChild(taskItem);
        deleteTaskFromLocalStorage(taskInput, category);
        if (taskList.children.length === 0) {
            taskList.style.display = "none"; // Esconder a lista se não houver tarefas
        }
    });

    buttons.appendChild(completeBtn);
    buttons.appendChild(deleteBtn);

    taskItem.appendChild(taskText);
    taskItem.appendChild(buttons);

    // Adiciona a nova tarefa ao final da lista de tarefas
    taskList.appendChild(taskItem);
}

function saveTaskToLocalStorage(taskText, category, completed) {
    const tasks = JSON.parse(localStorage.getItem(category)) || [];
    tasks.push({ text: taskText, completed });
    localStorage.setItem(category, JSON.stringify(tasks));
}

function updateTaskInLocalStorage(taskText, category, completed) {
    const tasks = JSON.parse(localStorage.getItem(category)) || [];
    const taskIndex = tasks.findIndex(task => task.text === taskText);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = completed;
        localStorage.setItem(category, JSON.stringify(tasks));
    }
}

function deleteTaskFromLocalStorage(taskText, category) {
    const tasks = JSON.parse(localStorage.getItem(category)) || [];
    const updatedTasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem(category, JSON.stringify(updatedTasks));
}

// Função para alternar a visibilidade das listas de tarefas
document.querySelectorAll('.category h2').forEach(header => {
    header.addEventListener('click', () => {
        const taskList = header.nextElementSibling;
        taskList.style.display = taskList.style.display === 'block' ? 'none' : 'block';
    });
});
