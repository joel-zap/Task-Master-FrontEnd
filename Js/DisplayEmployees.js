var page = 0;
var size = 10; //items per page
var totalPages = 0;
var empNameToast;

const liveToast = document.getElementById("liveToast");
var errorToast = new bootstrap.Toast(liveToast);
var modal = new bootstrap.Modal(document.getElementById('exampleModal1'));
var modal2 = new bootstrap.Modal(document.getElementById('exampleModal2'));

document.addEventListener("DOMContentLoaded", function () {
  getEmployees(page);
});

const contentIterate = document.getElementById("dataIteration");
const nextPage = document.getElementById("nextPage");
const previousPage = document.getElementById("previousPage");
const submitUpdated = document.querySelector(".submitUpdated");
const submitDeleted = document.querySelector(".submitDeleted");

nextPage.addEventListener("click", function (e) {
  page++;
  if (page > 0) {
    previousPage.classList.remove("disabled");
  }
  if (page >= totalPages - 1) {
    nextPage.classList.add("disabled");
  }
  contentIterate.innerHTML = "";
  getEmployees(page);
});

previousPage.addEventListener("click", function (e) {
  if (page <= 1) {
    previousPage.classList.add("disabled");
    nextPage.classList.remove("disabled");
  } else {
    previousPage.classList.remove("disabled");
  }
  if (page > 0) {
    page--;
  }
  contentIterate.innerHTML = "";
  getEmployees(page);
});

// Function to show the Success toast
function showEmployeeUpdatedToast() {
  liveToast.innerHTML = `
  <div class="toast-header text-bg-success">
          <img style="width: 30px; height: auto;" src="/Images/TM_Logo_png.png" class="rounded me-2" alt="">
          <strong class="me-auto">Employee Updated</strong>
          
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          <p>Updated <strong class="me-auto">${empNameToast} </strong>Succesfully👍</p>
        </div>
  `;
  errorToast.show();
}

// Function to show the Success toast
function showEmployeeDeletedToast() {
  liveToast.innerHTML = `
  <div class="toast-header text-bg-danger">
          <img style="width: 30px; height: auto;" src="/Images/TM_Logo_png.png" class="rounded me-2" alt="">
          <strong class="me-auto">Employee Deleted</strong>
          
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          <p>Deleted EmpID: <strong class="me-auto">${empNameToast} </strong>Succesfully😢</p>
        </div>
  `;
  errorToast.show();
}

// GET ALL EMPLOYEES FUNCTION
const getEmployees = async (page) => {
  nextPage.classList.add("disabled");

  // Show loading spinner
  document.getElementById("loadingSpinner1").style.display = "block";
  document.getElementById("loadingSpinner2").style.display = "block";

  let response_full = await fetch("https://task-master-backend-x8cz.onrender.com/task-master/api/employee?pageNumber=0&pageSize=999999999");
  nextPage.classList.remove("disabled");
  let data_full = await response_full.json();

  totalPages = Math.ceil(data_full.length / size);

  if (page + 1 == totalPages) {
    nextPage.classList.add("disabled");
  }

  let response = await fetch(`https://task-master-backend-x8cz.onrender.com/task-master/api/employee?pageNumber=${page}&pageSize=${size}`);
  let data = await response.json();
  
  document.getElementById("loadingSpinner1").style.display = "none";
  document.getElementById("loadingSpinner2").style.display = "none";

  data.forEach((element) => {
    contentIterate.innerHTML += `
            <tr>
            <td >${element.empId}</td>
            <td>${element.empName}</td>
            <td>${element.empEmail}</td>
            <td>${element.empDesignation}</td>
            <!-- <td>${element.mobile}</td> --->
            <td>
            
            <button class="btn btn-primary update-btn" data-bs-toggle="modal" data-bs-target="#exampleModal1" data-id="${element.empId}">Update</button>
            
            <button class="btn btn-danger delete-btn" data-bs-toggle="modal" data-bs-target="#exampleModal2" data-id="${element.empId}">Delete</button>
            </td>
            </tr>
            `;
    document.querySelectorAll(".update-btn").forEach((button) => {
      button.addEventListener("click", openUpdateForm);
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", openDeleteWarning);
    });
  });
};

// OPEN EMPLOYEE UPDATE FORM
const openUpdateForm = async (event) => {
  const employeeId = event.target.dataset.id;

  let response = await fetch(`https://task-master-backend-x8cz.onrender.com/task-master/api/employee/${employeeId}`);
  let data = await response.json();
  console.log(data.empId);
  const { empId, empName, empEmail, empDesignation } = data;
  modalFirstName1.innerHTML = `
        
        <!-- Employee ID -->
        <fieldset disabled>
        <div class="mb-3" >
            <label for="employee_id" class="form-label">Employee ID</label>
            <input type="text" class="form-control" id="employee_id" aria-describedby="emailHelp" value="${empId}">
        </div>
        </fieldset>
        
        <!-- Employee name -->
        <div class="mb-3" >
            <label for="emp_name" class="form-label">Edit Name</label>
            <input type="text" class="form-control" id="emp_name" aria-describedby="emailHelp" value="${empName}">
        </div>

        <!-- email -->
        <div class="mb-3">
            <label for="email" class="form-label">Edit Email</label>
            <input type="email" class="form-control" id="email" aria-describedby="emailHelp" value="${empEmail}">            
        </div>

        <!-- mobile no -->
        <div class="mb-3">
            <label for="designation" class="form-label">Edit Designation</label>
            <input type="text" class="form-control" id="designation" aria-describedby="emailHelp" value="${empDesignation}">
        </div>
        `;
};

// OPEN EMPLOYEE DELETE WARNING
const openDeleteWarning = async (event) => {
  const employeeId = event.target.dataset.id;

  let response = await fetch(
    `https://task-master-backend-x8cz.onrender.com/task-master/api/employee/${employeeId}`
  );
  let data = await response.json();
  const { empId, empName, empDesignation} = data;
  modalFirstName2.innerHTML = `
    <div class="alert alert-danger" role="alert">
    <input type="text" class="form-control visually-hidden" id="employee_id" aria-describedby="emailHelp" value="${empId}">
        <h5>Are you sure you want to delete this employee?</h5> 
        <hr>
        <h7>ID: ${empId}</h7> <br>
        <h7>Name: <strong>${empName}</strong></h7> <br>
        <h7>Designation: ${empDesignation}</h7>
        <hr>
        <h5>This will also delete the tasks assigned to this employee!!</h5> 
    </div>
 `;
};

// UPDATE EMPLOYEE FUNCTION
const updateEmployee = async () => {
  let employeeId = document.getElementById("employee_id").value;
  let EmployeeName = document.getElementById("emp_name").value;
  let employeeEmail = document.getElementById("email").value;
  let employeeDesignation = document.getElementById("designation").value;

  let response = await fetch(
    `https://task-master-backend-x8cz.onrender.com/task-master/api/employee/${employeeId}`,
    {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        empName: EmployeeName,
        empEmail: employeeEmail,
        empDesignation: employeeDesignation,
      }),
    }
  );

  if(response.status == 200){
    let data = await response.json();
    empNameToast = data.empName;
  }
};

// DELETE EMPLOYEE FUNCTION
const deleteEmployee = async () => {
  const empId = document.getElementById("employee_id").value;

  let response = await fetch(
    `https://task-master-backend-x8cz.onrender.com/task-master/api/employee/${empId}`,
    {
      method: "delete",
    }
  );


  if(response.status == 204){
    empNameToast = empId;
  }
};

submitUpdated.addEventListener("click", async function () {
  await updateEmployee();
  modal.hide();
  contentIterate.innerHTML = "";
  await getEmployees(page);
  showEmployeeUpdatedToast();
});

submitDeleted.addEventListener("click", async function () {
  await deleteEmployee();
  modal2.hide();
  contentIterate.innerHTML = "";
  await getEmployees(page);
  showEmployeeDeletedToast();
});
