

let allFilters = document.querySelectorAll(".box div");
let grid = document.querySelector(".grid");
let addModal = document.querySelector(".box-7");
let body = document.querySelector("body");
let modalVisible = false;


let colors = {
    pink: "#df8996",
    blue: "#9aa4be",
    lgreen: "#20c09d",
    grey: "#413e3e"
};
let colorClasses = ["pink","blue","lgreen","grey"];


let deleteState = false;
let deleteBtn = document.querySelector(".box-8");

//Initialization
if(!localStorage.getItem("tasks")){
    localStorage.setItem("tasks",JSON.stringify([]));
}
let lockState = false;
let lock = document.querySelector(".lock");
lock.addEventListener("click",function(e){
    lockState = !lockState;
    if(lockState == true) 
    alert("Welcome to JIRA TICKET APP🔑");
})



deleteBtn.addEventListener("click",function(e){
    if(lockState == true){
    if(deleteState){
        deleteState = false;
        e.currentTarget.classList.remove("delete-state");
    }
    else{
        deleteState = true;
        e.currentTarget.classList.add("delete-state");
    }
}
else{
    alert("No modifications allowed in the document.Click on 🔐 to make furthur changes");
}
})



addModal.addEventListener("click",function(){
    if(lockState == true){
    if(modalVisible) return;
    if(deleteBtn.classList.contains("delete-state")){
        deleteState = false;
        deleteBtn.classList.remove("delete-state");
    }
    let modal = document.createElement("div");

    modal.classList.add("modal-container");
    modal.setAttribute("click-first",true);
    modal.innerHTML =` <div class = "writing-area" contenteditable>ENTER YOUR TASK!!</div>
    <div class = "filter-area">
        <div class = "modal-filter pink" style="background-color:pink"></div>
        <div class = "modal-filter blue" style="background-color:#9aa4be;"></div>
        <div class = "modal-filter lgreen" style="background-color:#20c09d;"></div>
        <div class = "modal-filter grey active-modal-filter" style="background-color:#807a7a;"></div> 
</div>`

let allModalFilters = modal.querySelectorAll(".modal-filter")

for(let i=0;i<allModalFilters.length;i++)
{
    allModalFilters[i].addEventListener("click",function(e){
        for(let j=0;j<allModalFilters.length;j++){
            allModalFilters[j].classList.remove("active-modal-filter");
        }
        e.currentTarget.classList.add("active-modal-filter");
    })
}


    let wr = modal.querySelector(".writing-area");
    wr.addEventListener("click",function(e){
        if(modal.getAttribute("click-first") == "true"){
            wr.innerHTML = "";
            modal.setAttribute("click-first",false)
        }
    });
    wr.addEventListener("keypress",function(e){
       if(e.key == "Enter"){
           let task = e.currentTarget.innerText;
           let selectedModal = document.querySelector(".active-modal-filter");
           let color = selectedModal.classList[1];
           let id = Math.random().toString(36).substr(2, 5);
          
           let ticket = document.createElement("div");
           ticket.classList.add("ticket");
           ticket.innerHTML = `
           <div class="ticket-color ${color}"></div>
           <div class="ticket-id">#${id}</div>
           <div class="ticket-box" contenteditable>
           ${task}
           </div>`;

            saveTicketInLocalStorage(id,color,task);

             let ticketeWr = ticket.querySelector(".ticket-box");
             ticketeWr.addEventListener("input",tickerWrHandler);
             ticket.addEventListener("click",function(e){
                if(deleteState){
                    let id = e.currentTarget.querySelector(".ticket-id").innerText.split("#")[1];

                    let tasksArr = JSON.parse(localStorage.getItem("tasks"));
                    tasksArr = tasksArr.filter(function(e1){
                        return e1.id != id;
                    });

                    localStorage.setItem("tasks",JSON.stringify(tasksArr));
                    e.currentTarget.remove();
                }
             });
       
           let ticketColorDiv = ticket.querySelector(".ticket-color");
           ticketColorDiv.addEventListener("click",ticketColorHandler);

          grid.appendChild(ticket);
          modal.remove();
          modalVisible = false;
       }
    })


    body.appendChild(modal);
    modalVisible=true;
}
else{
    alert("No modifications allowed in the document.Click on 🔐 to make furthur changes");
 
}
});



for(let i=0;i<allFilters.length;i++){
    allFilters[i].addEventListener("click",function(e){
        if(lockState == true){
        if(e.currentTarget.parentElement.classList.contains("selected-filter")){
        e.currentTarget.parentElement.classList.remove("selected-filter");
        loadTasks();
        }
        else{
            let color = e.currentTarget.classList[0].split("-")[0];
            e.currentTarget.parentElement.classList.add("selected-filter");
            loadTasks(color)
        }
    }
    else     alert("No modifications allowed in the document.Click on 🔐 to make furthur changes");

    })
}

function saveTicketInLocalStorage(id,color,task){
    let reqObj = { id, color, task };
    let tasksArray = JSON.parse(localStorage.getItem("tasks"));
    tasksArray.push(reqObj);
    localStorage.setItem("tasks",JSON.stringify(tasksArray));
}

function tickerWrHandler(e){
    let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
    let tasksArr = JSON.parse(localStorage.getItem("tasks"));
    let reqIndex = -1;
    for(let i=0;i<tasksArr.length;i++){
        if(tasksArr[i].id == id){
            reqIndex = i;
            break;
        }
    }
    tasksArr[reqIndex].task = e.currentTarget.innerText;
    localStorage.setItem("tasks",JSON.stringify(tasksArr));
}

function ticketColorHandler(e){
    let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];

    let tasksArr = JSON.parse(localStorage.getItem("tasks"));
    let reqIndex = -1;
    for(let i=0;i<tasksArr.length;i++){
        if(tasksArr[i].id==id){
            reqIndex=i;
            break;
        }
    }
    let currColor = e.currentTarget.classList[1];
    let index = colorClasses.indexOf(currColor);
    index++;
    index=index%4;
    e.currentTarget.classList.remove(currColor);
    e.currentTarget.classList.add(colorClasses[index]);
    tasksArr[reqIndex].color = colorClasses[index];
    localStorage.setItem("tasks",JSON.stringify(tasksArr));
    
}

function loadTasks(passedColor){
    let allTickets=document.querySelectorAll(".ticket");
    for(let i=0;i<allTickets.length;i++){
        allTickets[i].remove();
    }
    let tasks = JSON.parse(localStorage.getItem("tasks"));

    for(let i=0;i<tasks.length;i++){
        let id=tasks[i].id;
        let color=tasks[i].color;
        let taskValue=tasks[i].task;

        if(passedColor){
            if(passedColor!=color)  continue;
        }
        let ticket=document.createElement("div");
        ticket.classList.add("ticket");
        ticket.innerHTML = `
        <div class="ticket-color ${color}"></div>
        <div class="ticket-id">#${id}</div>
        <div class="ticket-box" contenteditable>
        ${taskValue}
        </div>`;

        let ticketColorDiv = ticket.querySelector(".ticket-color");
        ticketColorDiv.addEventListener("click",ticketColorHandler);

        let ticketeWr = ticket.querySelector(".ticket-box");
        ticketeWr.addEventListener("input",tickerWrHandler);
        ticket.addEventListener("click",function(e){
           if(deleteState){
               let id = e.currentTarget.querySelector(".ticket-id").innerText.split("#")[1];

               let tasksArr = JSON.parse(localStorage.getItem("tasks"));
               tasksArr = tasksArr.filter(function(e1){
                   return e1.id != id;
               });

               localStorage.setItem("tasks",JSON.stringify(tasksArr));
               e.currentTarget.remove();
           }
        });
        grid.appendChild(ticket);
    }
}

let del = document.querySelector(".material-icons");
del.addEventListener("click",function(e){
    if(lockState == true){
        
    if(deleteBtn.classList.contains("delete-state")){
        deleteState = false;
        deleteBtn.classList.remove("delete-state");
    }
   
    let ans = confirm("Are you sure you want to delete all?👆✔") 
    let allTickets=document.querySelectorAll(".ticket");
    if(ans){
        for(let i=0;i<allTickets.length;i++){
            allTickets[i].remove();
        }
        
        localStorage.setItem("tasks",JSON.stringify([]));
    }
}  
else{
    alert("No modifications allowed in the document.Click on 🔐 to make furthur changes");

}
})
loadTasks();

