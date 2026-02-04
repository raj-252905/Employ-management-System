
let selectedRow = null;
const STORAGE_KEY = 'employees';

window.onload = function () {
  loadData();
};

function onFormSubmit() {
  event.preventDefault();

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

function getFormData() {
  let hobbies = [];

  if (document.getElementById('cricket').checked) hobbies.push('Cricket');
  if (document.getElementById('swimming').checked) hobbies.push('Swimming');
  if (document.getElementById('reading').checked) hobbies.push('Reading');

  let gender = '';
  if (document.getElementById('male').checked) gender = 'Male';
  if (document.getElementById('female').checked) gender = 'Female';

  let designation = document.querySelector('select').value;

  return {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value,
    phone: document.getElementById('phone').value,
    gender: gender,
    hobbies: hobbies.join(', '),
    designation: designation,
  };
}

function insertRecord(data) {
  let table = document.getElementById('storeList');
  let row = table.insertRow();

  row.insertCell(0).innerHTML = data.name;
  row.insertCell(1).innerHTML = data.email;
  row.insertCell(2).innerHTML = data.address;
  row.insertCell(3).innerHTML = data.phone;
  row.insertCell(4).innerHTML = data.gender;
  row.insertCell(5).innerHTML = data.hobbies;
  row.insertCell(6).innerHTML = data.designation;
  row.insertCell(7).innerHTML =
    '<button class="btn btn-sm btn-warning me-1" onclick="onEdit(this)">Edit</button>' +
    '<button class="btn btn-sm btn-danger" onclick="onDelete(this)">Delete</button>';
}

function onEdit(btn) {
  selectedRow = btn.parentElement.parentElement;

  document.getElementById('name').value = selectedRow.cells[0].innerHTML;
  document.getElementById('email').value = selectedRow.cells[1].innerHTML;
  document.getElementById('address').value = selectedRow.cells[2].innerHTML;
  document.getElementById('phone').value = selectedRow.cells[3].innerHTML;

  document.getElementById('male').checked = false;
  document.getElementById('female').checked = false;
  document.getElementById(
    selectedRow.cells[4].innerHTML.toLowerCase(),
  ).checked = true;

  let hobbies = selectedRow.cells[5].innerHTML;

  document.getElementById('cricket').checked =
    hobbies.indexOf('Cricket') !== -1;
  document.getElementById('swimming').checked =
    hobbies.indexOf('Swimming') !== -1;
  document.getElementById('reading').checked =
    hobbies.indexOf('Reading') !== -1;

  document.querySelector('select').value = selectedRow.cells[6].innerHTML;

  document.querySelector("button[type='submit']").innerText = 'Update';
}

function updateRecord(data) {
  selectedRow.cells[0].innerHTML = data.name;
  selectedRow.cells[1].innerHTML = data.email;
  selectedRow.cells[2].innerHTML = data.address;
  selectedRow.cells[3].innerHTML = data.phone;
  selectedRow.cells[4].innerHTML = data.gender;
  selectedRow.cells[5].innerHTML = data.hobbies;
  selectedRow.cells[6].innerHTML = data.designation;
}

function onDelete(btn) {
  if (confirm('Are you sure you want to delete this employee?')) {
    let row = btn.parentElement.parentElement;
    document.getElementById('storeList').deleteRow(row.rowIndex - 1);
    saveData();
    resetForm();
  }
}

function resetForm() {
  document.querySelector('form').reset();
  selectedRow = null;
  document.querySelector("button[type='submit']").innerText = 'Submit';
}

function validateForm() {
  let name = document.getElementById('name').value;
  let email = document.getElementById('email').value;
  let phone = document.getElementById('phone').value;
  let designation = document.querySelector('select').value;

  if (name === '') {
    alert('Name is required');
    return false;
  }

  if (email === '' || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
    alert('Enter valid email');
    return false;
  }

  if (phone === '' || phone.length !== 10) {
    alert('Phone number must be 10 digits');
    return false;
  }

  if (
    !document.getElementById('male').checked &&
    !document.getElementById('female').checked
  ) {
    alert('Please select gender');
    return false;
  }

  if (designation === 'Select designation') {
    alert('Please select designation');
    return false;
  }

  return true;
}

function saveData() {
  let table = document.getElementById('storeList');
  let data = [];

  for (let i = 0; i < table.rows.length; i++) {
    let row = table.rows[i];
    data.push({
      name: row.cells[0].innerHTML,
      email: row.cells[1].innerHTML,
      address: row.cells[2].innerHTML,
      phone: row.cells[3].innerHTML,
      gender: row.cells[4].innerHTML,
      hobbies: row.cells[5].innerHTML,
      designation: row.cells[6].innerHTML,
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadData() {
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  for (let i = 0; i < data.length; i++) {
    insertRecord(data[i]);
  }
}
