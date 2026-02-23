const input = document.querySelector("#input");
const addBtn =document.querySelector("#addBtn");
const taskList = document.querySelector("#taskList");

let task = JSON.parse(localStorage.getItem("task")) || [];
renderTasks();

function addTask(){
    const taskText = input.value.trim();
    if(taskText === "") return;

    task.push(taskText);
    localStorage.setItem("tasks",JSON.stringify(task));
    renderTasks();
    input.value="";
}
function renderTasks(){
    taskList.innerHTML ="";

    task.forEach((task,index) => {
        const li =document.createElement("li");

        const span= document.createElement("span");
        span.textContent =task;

        const deletebutton =document.createElement("button");
        deletebutton.textContent="Delete";
        deletebutton.classList.add("delete-btn");

        deletebutton.addEventListener("click",function(){
            deleteTask(index);
        });
        li.appendChild(span);
        li.appendChild(deletebutton);
        taskList.appendChild(li);
    });
}
function deleteTask(index){
    task.splice(index,1);
    localStorage.setItem("task",JSON.stringify(task));
    renderTasks();
    }
    addBtn.addEventListener("click",addTask);

    input.addEventListener("keypress",function(e){
        if(e.key ==="Enter"){
            addTask();
        }
    });


