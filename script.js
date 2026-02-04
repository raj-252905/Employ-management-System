let selectedRow = null;

window.onload = loadData;

// Submit / Update
function onSubmit(e) {
  e.preventDefault();

  if (!validateForm()) return;

  let data = getFormData();

  if (selectedRow === null) {
    insertRecord(data);
  } else {
    updateRecord(data);
  }

  saveData();
  resetForm();
}

// Get Form Data
function getFormData() {
  let hobbies = [];
  document.querySelectorAll("input[type='checkbox']:checked")
    .forEach(cb => hobbies.push(cb.value));

  let gender = document.querySelector("input[name='gender']:checked").value;

  return {
    name: name.value,
    email: email.value,
    address: address.value,
    phone: phone.value,
    gender: gender,
    hobbies: hobbies.join(", "),
    designation: designation.value
  };
}

// Insert Record
function insertRecord(data) {
  let row = tableBody.insertRow();
  row.insertCell(0).innerText = data.name;
  row.insertCell(1).innerText = data.email;
  row.insertCell(2).innerText = data.address;
  row.insertCell(3).innerText = data.phone;
  row.insertCell(4).innerText = data.gender;
  row.insertCell(5).innerText = data.hobbies;
  row.insertCell(6).innerText = data.designation;
  row.insertCell(7).innerHTML = `
    <button class="action-btn edit-btn" onclick="editRecord(this)">Edit</button>
    <button class="action-btn delete-btn" onclick="deleteRecord(this)">Delete</button>
  `;
}

// Edit Record
function editRecord(btn) {
  selectedRow = btn.parentElement.parentElement;

  name.value = selectedRow.cells[0].innerText;
  email.value = selectedRow.cells[1].innerText;
  address.value = selectedRow.cells[2].innerText;
  phone.value = selectedRow.cells[3].innerText;

  document.querySelectorAll("input[name='gender']")
    .forEach(r => r.checked = r.value === selectedRow.cells[4].innerText);

  document.querySelectorAll("input[type='checkbox']")
    .forEach(cb => cb.checked = selectedRow.cells[5].innerText.includes(cb.value));

  designation.value = selectedRow.cells[6].innerText;

  submitBtn.innerText = "Update";
}

// Update Record
function updateRecord(data) {
  selectedRow.cells[0].innerText = data.name;
  selectedRow.cells[1].innerText = data.email;
  selectedRow.cells[2].innerText = data.address;
  selectedRow.cells[3].innerText = data.phone;
  selectedRow.cells[4].innerText = data.gender;
  selectedRow.cells[5].innerText = data.hobbies;
  selectedRow.cells[6].innerText = data.designation;
}

// Delete Record
function deleteRecord(btn) {
  if (confirm("Are you sure you want to delete this record?")) {
    btn.parentElement.parentElement.remove();
    saveData();
  }
}

// Reset Form
function resetForm() {
  selectedRow = null;
  submitBtn.innerText = "Submit";
}

// Validation
function validateForm() {
  let valid = true;

  nameError.innerText = emailError.innerText =
  phoneError.innerText = genderError.innerText =
  designationError.innerText = "";

  if (name.value === "") {
    nameError.innerText = "Name is required";
    valid = false;
  }

  if (!email.value.includes("@")) {
    emailError.innerText = "Invalid email";
    valid = false;
  }

  if (phone.value.length !== 10) {
    phoneError.innerText = "Phone must be 10 digits";
    valid = false;
  }

  if (!document.querySelector("input[name='gender']:checked")) {
    genderError.innerText = "Select gender";
    valid = false;
  }

  if (designation.value === "") {
    designationError.innerText = "Select designation";
    valid = false;
  }

  return valid;
}

// Local Storage
function saveData() {
  let data = [];
  for (let row of tableBody.rows) {
    data.push({
      name: row.cells[0].innerText,
      email: row.cells[1].innerText,
      address: row.cells[2].innerText,
      phone: row.cells[3].innerText,
      gender: row.cells[4].innerText,
      hobbies: row.cells[5].innerText,
      designation: row.cells[6].innerText
    });
  }
  localStorage.setItem("employees", JSON.stringify(data));
}

function loadData() {
  let data = JSON.parse(localStorage.getItem("employees")) || [];
  data.forEach(emp => insertRecord(emp));
}
