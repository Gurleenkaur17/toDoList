// JavaScript code to interact with the Spring Boot backend
document.addEventListener("DOMContentLoaded", () => {
    let body = document.querySelector('body')
    const taskList = document.getElementById("task-list");
    const taskNameInput = document.getElementById("task-name");
    const addTaskButton = document.getElementById("add-task");

    async function fetchTasks(){
        let response = await fetch("http://localhost:8080/api/tasks/get");
        let res = await response.json();
        
        taskList.innerHTML = ""
        res.forEach((task)=>{
            taskName = document.createElement('div');
            taskName.classList.add(`tasks`)
            taskName.style.display = 'flex'
            taskName.style.justifyContent = 'space-between'
            taskName.style.margin = '10px'
            taskName.innerHTML = `
                <div class="name">${task.name}</div>
                <button class="${task.id}" id = "status">${task.completed ? "Completed" : "Incomplete" }</button>
                <button class="${task.id}" id = "del">Delete</button>
            `;
            if (task.completed) {
                taskName.style.textDecoration = "line-through"; // Apply line-through for completed tasks
            }
            
            taskList.appendChild(taskName);
            
        })
        attachEventListeners();
    }
    
    // Add a new Task
    addTaskButton.addEventListener('click', ()=>{
        let message = document.createElement('div');
            task = taskNameInput.value;
            (async () => {
                if(task.trim() === "") return;
                let res = await fetch("http://localhost:8080/api/tasks/post", {
                method: "POST",
                headers: {
                            "Content-Type": "application/json",
                        },
                body: JSON.stringify({ name: task, completed: false })
            })
            if(res.status == 409){
                
                message.innerText = "Cannot add this task as it already exists!!"
                body.appendChild(message);
            }
            taskNameInput.value = ""
            taskNameInput.addEventListener('focus', ()=>{
                body.removeChild(message);
            })
            fetchTasks();
            })();
        
        
        

    })

    // Toggle task completion status
    function attachEventListeners() {
        // Toggle completion status
        const statusButtons = document.querySelectorAll("#status");
        statusButtons.forEach((button) => {
            button.addEventListener("click", async () => {
                let taskElement = button.closest(`.tasks`)
                
                buttonText = button.innerText;
                if(buttonText === 'Incomplete'){
                   taskElement.style.textDecoration = 'line-through'
                   button.innerText = 'Completed'
                }
                await fetch(`http://localhost:8080/api/tasks/update/${button.getAttribute('class')}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ completed: !buttonText}),
                });
            });
        });

        // Delete task
        const deleteButtons = document.querySelectorAll("#del");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", async () => {
                await fetch(`http://localhost:8080/api/tasks/delete/${button.getAttribute('class')}`, {
                    method: "DELETE",
                });
                fetchTasks();
            });
        });
    }

    // Fetch tasks on page load
    fetchTasks();
    
});
