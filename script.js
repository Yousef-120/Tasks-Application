let buttons = document.querySelectorAll(`.section-btn`);
let input = document.querySelector(`.task-input`);
let tasks = document.querySelector(`.content .bottom`);
let alert = document.querySelector(`.alert`);
let deleteTaskBtn = document.querySelectorAll(".main-delete-task");
let closeStatesBtn = document.querySelector(".close-states");
let addTaskBtn = document.querySelectorAll(".add-task");
let sectionBtn = document.querySelectorAll(".section-btn");
let editTaskBtn = document.querySelectorAll(".edit-task");
let alertIco = document.querySelector(`.alert i`);
let msg = document.createElement("div");
let confirmDelete = document.querySelector(`.confirm-delete`);
let deleteBtn;
let checkBoxs;
let tasksDB = JSON.parse(localStorage.getItem("tasksDB")) || [];
let taskState;
let alertTimeout;
alert.appendChild(msg);
buttons[0].classList.add(`active`);
let deleteState = false;
let editState = false;
let selectedSection;
const notyf = new Notyf({
  duration: 5000,
  position: { x: "center", y: "top" },
  dismissible: true,
  ripple: true,
});
Swal.fire({
  title: "Enter Your Name",
  input: "text",
  inputLabel: "User Name",
  inputPlaceholder: "Enter your name...",
  showCancelButton: false,
  confirmButtonText: "Next",
  allowOutsideClick: false,
  allowEscapeKey: false,
  allowEnterKey: true,
  inputValidator: (value) => {
    if (!value.trim()) {
      return "Name cannot be empty!";
    }
  },
}).then((result) => {
  if (result.isConfirmed) {
    let userName = result.value.trim();
    notyf.success(`Hello ${userName}`);
  }
});
if (tasksDB.length !== 0) {
  deleteBtn = document.querySelectorAll(".deleteBtn");
  editBtn = document.querySelectorAll(".editBtn");
  checkBoxs = document.querySelectorAll(".checkbox-wrapper");
}

function generateId() {
  let id;
  do {
    id = Math.floor(1000000000 + Math.random() * 9000000000);
  } while (tasksDB.some((el) => el.id === id));
  return id;
}

deleteTaskBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (tasksDB.length != 0) {
      if (deleteState === false) {
        sectionBtn.forEach((el) => el.classList.add("disabled"));
        deleteBtn.forEach((el) => el.classList.remove("d-none"));
        checkBoxs.forEach((el) => el.classList.add("d-none"));
        closeStatesBtn.classList.replace("d-none", "d-flex");
        addTaskBtn.forEach((el) => el.classList.add("disabled"));
        btn.classList.add("disabled");
        deleteState = true;
      } else {
        closeStates();
      }
    } else {
      Swal.fire({
        title: "No Tasks Found",
        text: "There are no tasks to delete.",
        icon: "info",
        confirmButtonText: "OK",
      });
    }
  });
});

editTaskBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (tasksDB.length != 0) {
      if (editState === false) {
        sectionBtn.forEach((el) => el.classList.add("disabled"));
        editBtn.forEach((el) => el.classList.remove("d-none"));
        checkBoxs.forEach((el) => el.classList.add("d-none"));
        closeStatesBtn.classList.replace("d-none", "d-flex");
        btn.classList.add("disabled");
        deleteTaskBtn.forEach((el) => el.classList.add("disabled"));
        editState = true;
      } else {
        closeStates();
      }
    } else {
      Swal.fire({
        title: "No Tasks Found",
        text: "There are no tasks to edit.",
        icon: "info",
        confirmButtonText: "OK",
      });
    }
  });
});

let showData = () => {
  let checkbox = document.querySelectorAll(`.checkbox`);
  checkbox.forEach((el) => {
    let taskId = el.dataset.id;
    let task = tasksDB.find((t) => t.id == taskId);
    if (task) {
      el.checked = task.TaskState === true;
    }
  });
};

let checkState = () => {
  let checkbox = document.querySelectorAll(`.checkbox`);
  checkbox.forEach((el) => {
    el.addEventListener("change", () => {
      let taskId = el.dataset.id;
      let taskIndex = tasksDB.findIndex((t) => t.id == taskId);
      if (taskIndex !== -1) {
        tasksDB[taskIndex].TaskState = el.checked;
        localStorage.setItem("tasksDB", JSON.stringify(tasksDB));
        setTimeout(() => {
          activeToggle(selectedSection);
        }, 500);
      }
    });
  });
};

let showAlert = (type, message) => {
  closeAlert();
  clearTimeout(alertTimeout);
  alert.classList.remove("bg-success", "bg-danger", "bg-primary");
  alertIco.classList.remove("fa-circle-check", "fa-circle-exclamation");
  if (type === "success") {
    alert.classList.add("bg-success");
    alertIco.classList.add("fa-circle-check");
  } else if (type === "warning") {
    alert.classList.add("bg-primary");
    alertIco.classList.add("fa-circle-exclamation");
  } else if (type === "error") {
    alert.classList.add("bg-danger");
    alertIco.classList.add("fa-circle-exclamation");
  }
  msg.textContent = message;
  alert.classList.remove("animate__fadeInDown", "animate__fadeOutUp");
  setTimeout(() => {
    alert.classList.remove("d-none");
    alert.classList.add("d-flex", "animate__fadeInDown");
  }, 10);
  alertTimeout = setTimeout(() => {
    alert.classList.remove("animate__fadeInDown");
    alert.classList.add("animate__fadeOutUp");
    setTimeout(() => {
      alert.classList.remove("animate__fadeOutUp", "d-flex");
      alert.classList.add("d-none");
    }, 1000);
  }, 6000);
};

let closeAlert = () => {
  alertTimeout = setTimeout(() => {
    alert.classList.remove("animate__fadeInDown");
    alert.classList.add("animate__fadeOutUp");
    setTimeout(() => {
      alert.classList.remove("animate__fadeOutUp", "d-flex");
      alert.classList.add("d-none");
    }, 1000);
  }, 100);
};

let activeToggle = (index) => {
  buttons.forEach((el) => el.classList.remove(`active`));
  buttons[index].classList.add(`active`);
  selectedSection = index;
  if (index == 0) {
    renderTasks(tasksDB);
  } else if (index === 1) {
    let completedTasks = tasksDB.filter((el) => el.TaskState === false);
    if (completedTasks != []) {
      renderTasks(completedTasks);
    } else {
      return false;
    }
  } else if (index === 2) {
    let notCompletedTasks = tasksDB.filter((el) => el.TaskState === true);
    if (notCompletedTasks != []) {
      renderTasks(notCompletedTasks);
    } else {
      return false;
    }
  }
};

let renderTasks = (tasksType) => {
  tasks.innerHTML = ``;
  tasksType.forEach((el) => {
    tasks.innerHTML += `
    <label class="task d-flex align-items-center justify-content-between">
      <div class="task-info">
        <h4 class="task-name fw-medium">${el.TaskName}</h4>
        <p class="task-time m-0">${el.TaskTime}</p>
      </div>
      <div class="checkbox-wrapper">
        <input data-id="${el.id}" type="checkbox" class="checkbox"/> 
        <i class="fa fa-check"></i>
      </div>
      <button data-id="${el.id}" class="deleteBtn btn text-danger border-2 rounded-3 d-none">
        <i class="fa-solid fa-trash"></i>
      </button>
      <button data-id="${el.id}" class="editBtn btn text-dark border-2 rounded-2 d-none">
        <i class="fa-solid fa-pen-to-square"></i>
      </button>
    </label>`;
  });
  deleteBtn = document.querySelectorAll(".deleteBtn");
  editBtn = document.querySelectorAll(".editBtn");
  checkBoxs = document.querySelectorAll(".checkbox-wrapper");
  checkState();
  showData();
  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteTask(btn.dataset.id);
    });
  });
  editBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      editTask(btn.dataset.id);
    });
  });
};

let addTask = () => {
  console.log("d");
  taskState = false;
  let taskName = input.value.trim();
  input.value = "";
  isExists = tasksDB.some((el) => el.TaskName.trim() === taskName);
  if (isExists) {
    Swal.fire({
      title: "Duplicate Task!",
      text: "A task with this name already exists. Please choose another name.",
      icon: "error",
      confirmButtonText: "OK",
    });
  } else if (!taskName) {
    Swal.fire({
      title: "Empty Task!",
      text: "You must enter a task name.",
      icon: "warning",
      confirmButtonText: "OK",
    });
  } else {
    let newTask = { id: generateId(), TaskName: taskName, TaskTime: "17/8", TaskState: taskState };
    tasksDB.push(newTask);
    localStorage.setItem("tasksDB", JSON.stringify(tasksDB));
    renderTasks(tasksDB);
    Swal.fire({
      title: "Task Added!",
      text: "Your task has been successfully added.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  }
};

let closeStates = () => {
  deleteBtn.forEach((el) => el.classList.add("d-none"));
  editBtn.forEach((el) => el.classList.add("d-none"));
  checkBoxs.forEach((el) => el.classList.remove("d-none"));
  sectionBtn.forEach((el) => el.classList.remove("disabled"));
  closeStatesBtn.classList.replace("d-flex", "d-none");
  addTaskBtn.forEach((el) => el.classList.remove("disabled"));
  editTaskBtn.forEach((el) => el.classList.remove("disabled"));
  deleteTaskBtn.forEach((el) => el.classList.remove("disabled"));
  deleteState = false;
  editState = false;
  renderTasks(tasksDB);
};

let deleteTask = (taskId) => {
  let selectedIndexToDel = tasksDB.findIndex((el) => el.id == taskId);
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      tasksDB.splice(selectedIndexToDel, 1);
      localStorage.setItem("tasksDB", JSON.stringify(tasksDB));
      closeStates();
      Swal.fire({
        title: "Deleted!",
        text: "The task has been deleted.",
        icon: "success",
      });
    }
  });
};

let editTask = (taskId) => {
  let selectedIndexToEdit = tasksDB.findIndex((el) => el.id == taskId);
  let currentTask = tasksDB[selectedIndexToEdit];
  Swal.fire({
    title: "Edit Task",
    input: "text",
    inputLabel: "Enter the new task name",
    inputPlaceholder: "New task name...",
    inputValue: currentTask.TaskName,
    showCancelButton: true,
    confirmButtonText: "Save",
    cancelButtonText: "Cancel",
    inputValidator: (value) => {
      let isExists = tasksDB.some((el) => value === el.TaskName);
      if (currentTask.TaskName === value) {
        return "You must change the task name!";
      } else if (isExists) {
        return "This task name already exists!";
      } else if (!value.trim()) {
        return "Task name cannot be empty!";
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      tasksDB[selectedIndexToEdit] = {
        ...currentTask,
        TaskName: result.value.trim(),
      };
      localStorage.setItem("tasksDB", JSON.stringify(tasksDB));
      activeToggle(selectedSection);
      Swal.fire("Updated!", "Task has been updated successfully.", "success");
      closeStates();
    }
  });
};

renderTasks(tasksDB);
