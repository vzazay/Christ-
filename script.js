const storageKey = "churchMembers";
const memberForm = document.getElementById("memberForm");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const ageInput = document.getElementById("age");
const genderSelect = document.getElementById("gender");
const roleSelect = document.getElementById("role");
const baptizedSelect = document.getElementById("baptized");
const membershipStatusSelect = document.getElementById("membershipStatus");
const addressInput = document.getElementById("address");
const photoUploadInput = document.getElementById("photoUpload");
const photoPreviewImage = document.getElementById("memberPhotoPreview");
const photoPlaceholder = document.getElementById("photoPlaceholder");
const memberIdInput = document.getElementById("memberId");
const memberTableBody = document.querySelector("#memberTable tbody");
const searchTextInput = document.getElementById("searchText");
const filterRoleSelect = document.getElementById("filterRole");
const clearButton = document.getElementById("clearButton");
const loginPanel = document.getElementById("loginPanel");
const loginForm = document.getElementById("loginForm");
const loginUsernameInput = document.getElementById("loginUsername");
const loginPasswordInput = document.getElementById("loginPassword");
const showPasswordCheckbox = document.getElementById("showPasswordCheckbox");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const forgotMessage = document.getElementById("forgotMessage");
const registerForm = document.getElementById("registerForm");
const registerUsernameInput = document.getElementById("registerUsername");
const registerPasswordInput = document.getElementById("registerPassword");
const registerConfirmInput = document.getElementById("registerConfirmPassword");
const registerStatus = document.getElementById("registerStatus");
const showRegisterButton = document.getElementById("showRegisterButton");
const showLoginButton = document.getElementById("showLoginButton");
const loginFormContainer = document.getElementById("loginFormContainer");
const registerFormContainer = document.getElementById("registerFormContainer");
const usernameInfo = document.getElementById("usernameInfo");
const loginStatus = document.getElementById("loginStatus");

// Interface elements
const interface1Login = document.getElementById("interface1Login");
const interface2Form = document.getElementById("interface2Form");
const interface3Dashboard = document.getElementById("interface3Dashboard");
const goToDashboardBtn = document.getElementById("goToDashboardBtn");
const goToFormBtn = document.getElementById("goToFormBtn");
const logoutFromFormBtn = document.getElementById("logoutFromFormBtn");
const logoutFromDashboardBtn = document.getElementById("logoutFromDashboardBtn");

const credentialsStoreKey = "churchDashboardAccess";
const lastLoginKey = "churchLastLogin";
let members = [];
let allowedAccounts = [];
let currentUser = null;

// Interface switching functions
function showInterface(interfaceId) {
  interface1Login.classList.add("hidden");
  interface2Form.classList.add("hidden");
  interface3Dashboard.classList.add("hidden");
  
  if (interfaceId === 1) {
    interface1Login.classList.remove("hidden");
  } else if (interfaceId === 2) {
    interface2Form.classList.remove("hidden");
  } else if (interfaceId === 3) {
    interface3Dashboard.classList.remove("hidden");
    renderMembers();
  }
}

function goToLoginInterface() {
  currentUser = null;
  showInterface(1);
  loginForm.reset();
  registerForm.reset();
  toggleAuthPanel(false);
  loginStatus.textContent = "You have been logged out.";
}

function goToFormInterface() {
  showInterface(2);
  resetForm();
}

function goToDashboardInterface() {
  showInterface(3);
}

function loadMembers() {
  const saved = localStorage.getItem(storageKey);
  members = saved ? JSON.parse(saved) : [];
}

function saveMembers() {
  localStorage.setItem(storageKey, JSON.stringify(members));
}

function loadAccessAccounts() {
  const saved = localStorage.getItem(credentialsStoreKey);
  if (saved) {
    allowedAccounts = JSON.parse(saved);
  } else {
    allowedAccounts = [{ username: "feeluser", password: "gold123" }];
    localStorage.setItem(credentialsStoreKey, JSON.stringify(allowedAccounts));
  }
}

function loadLastLogin() {
  const saved = localStorage.getItem(lastLoginKey);
  if (saved) {
    const last = JSON.parse(saved);
    loginUsernameInput.value = last.username || "";
    loginPasswordInput.value = last.password || "";
  }
}

function saveLastLogin(username, password) {
  localStorage.setItem(lastLoginKey, JSON.stringify({ username, password }));
}

function showUsernameInfo() {
  const username = loginUsernameInput.value.trim();
  const password = loginPasswordInput.value;
  if (!username && !password) {
    usernameInfo.classList.add("hidden");
    return;
  }
  usernameInfo.textContent = `Username: ${username || "—"} · Password: ${password || "—"}`;
  usernameInfo.classList.remove("hidden");
}
function toggleAuthPanel(showRegister) {
  loginFormContainer.classList.toggle("hidden", showRegister);
  registerFormContainer.classList.toggle("hidden", !showRegister);
  showRegisterButton.classList.toggle("hidden", showRegister);
  showLoginButton.classList.toggle("hidden", !showRegister);
  usernameInfo.classList.add("hidden");
  forgotMessage.classList.add("hidden");
  loginStatus.textContent = "";
  registerStatus.textContent = "";
  if (!showRegister) {
    registerForm.reset();
  }
}

function handleShowRegister() {
  toggleAuthPanel(true);
}

function handleShowLogin() {
  toggleAuthPanel(false);
}

function handleRegister(event) {
  event.preventDefault();
  const username = registerUsernameInput.value.trim();
  const password = registerPasswordInput.value;
  const confirmPassword = registerConfirmInput.value;

  if (!username || !password || !confirmPassword) {
    registerStatus.textContent = "Please complete all registration fields.";
    return;
  }
  if (password !== confirmPassword) {
    registerStatus.textContent = "Passwords do not match.";
    return;
  }
  if (allowedAccounts.some((record) => record.username === username)) {
    registerStatus.textContent = "That username is already taken.";
    return;
  }

  const newAccount = { username, password };
  allowedAccounts.push(newAccount);
  localStorage.setItem(credentialsStoreKey, JSON.stringify(allowedAccounts));
  saveLastLogin(username, password);
  currentUser = newAccount;
  registerStatus.textContent = "Account created successfully. Signing you in...";
  showApp();
}
function handleShowPasswordToggle() {
  loginPasswordInput.type = showPasswordCheckbox.checked ? "text" : "password";
  showUsernameInfo();
}

function handleForgotPassword(event) {
  event.preventDefault();
  const account = allowedAccounts[0];
  forgotMessage.textContent = account
    ? `Need help? Your saved username is "${account.username}". If you don’t remember the password, contact your administrator or reset the credentials after login.`
    : "No saved account is available. Contact your administrator to reset your login details.";
  forgotMessage.classList.remove("hidden");
}

function showApp() {
  goToFormInterface();
}

function populateCredentialForm() {
  // Function kept for compatibility but not used in new interface
}

function handleCredentialSave(event) {
  // Function kept for compatibility but not used in new interface
}

function handleLogin(event) {
  event.preventDefault();
  const username = loginUsernameInput.value.trim();
  const password = loginPasswordInput.value;

  const account = allowedAccounts.find((record) => record.username === username && record.password === password);
  if (!account) {
    loginStatus.textContent = "Invalid username or password.";
    return;
  }

  currentUser = account;
  loginStatus.textContent = "";
  saveLastLogin(username, password);
  showApp();
}

function handleLogout() {
  goToLoginInterface();
}

function resetForm() {
  memberForm.reset();
  memberIdInput.value = "";
  photoUploadInput.value = "";
  setPhotoPreview(null);
  document.getElementById("saveButton").textContent = "Save Member";
}

function setPhotoPreview(src) {
  if (src) {
    photoPreviewImage.src = src;
    photoPreviewImage.style.display = "block";
    photoPlaceholder.style.display = "none";
  } else {
    photoPreviewImage.removeAttribute("src");
    photoPreviewImage.style.display = "none";
    photoPlaceholder.style.display = "flex";
  }
}

function getMemberFromForm() {
  const photo = photoPreviewImage.style.display !== "none" ? photoPreviewImage.src : null;
  return {
    id: memberIdInput.value || crypto.randomUUID(),
    fullName: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    age: ageInput.value ? Number(ageInput.value) : null,
    gender: genderSelect.value,
    role: roleSelect.value,
    baptized: baptizedSelect.value,
    membershipStatus: membershipStatusSelect.value,
    address: addressInput.value.trim(),
    photo,
    createdAt: new Date().toISOString(),
  };
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    setPhotoPreview(null);
    return;
  }

  const reader = new FileReader();
  reader.onload = () => setPhotoPreview(reader.result);
  reader.readAsDataURL(file);
}

function validateMember(member) {
  if (!member.fullName) {
    alert("Please enter the member's full name.");
    return false;
  }
  if (!member.role) {
    alert("Please choose a role for the member.");
    return false;
  }
  return true;
}

function renderMembers() {
  const searchTerm = searchTextInput.value.trim().toLowerCase();
  const selectedRole = filterRoleSelect.value;
  memberTableBody.innerHTML = "";

  const filteredMembers = members.filter((member) => {
    const matchesSearch = [member.fullName, member.email, member.phone, member.role, member.membershipStatus]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(searchTerm));
    const matchesRole = selectedRole ? member.role === selectedRole : true;
    return matchesSearch && matchesRole;
  });

  if (filteredMembers.length === 0) {
    const row = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.setAttribute("colspan", "8");
    emptyCell.textContent = "No records found. Add a new member to begin.";
    emptyCell.style.textAlign = "center";
    row.appendChild(emptyCell);
    memberTableBody.appendChild(row);
    return;
  }

  filteredMembers.forEach((member) => {
    const row = document.createElement("tr");
    const photoCell = member.photo
      ? `<td class="photo-cell"><img class="member-table-photo" src="${member.photo}" alt="${member.fullName} photo"></td>`
      : `<td class="photo-cell"><span class="photo-empty">—</span></td>`;

    row.innerHTML = `
      ${photoCell}
      <td>${member.fullName}</td>
      <td>${member.role}</td>
      <td>${member.email || "—"}</td>
      <td>${member.phone || "—"}</td>
      <td>${member.baptized}</td>
      <td>${member.membershipStatus}</td>
      <td>
        <div class="action-group">
          <button class="action-button edit" data-action="edit" data-id="${member.id}">Edit</button>
          <button class="action-button delete" data-action="delete" data-id="${member.id}">Delete</button>
        </div>
      </td>
    `;

    memberTableBody.appendChild(row);
  });
}

function populateForm(member) {
  fullNameInput.value = member.fullName;
  emailInput.value = member.email;
  phoneInput.value = member.phone;
  ageInput.value = member.age || "";
  genderSelect.value = member.gender || "";
  roleSelect.value = member.role;
  baptizedSelect.value = member.baptized;
  membershipStatusSelect.value = member.membershipStatus;
  addressInput.value = member.address;
  memberIdInput.value = member.id;
  photoUploadInput.value = "";
  setPhotoPreview(member.photo);
  document.getElementById("saveButton").textContent = "Update Member";
}

function handleSave(event) {
  event.preventDefault();
  const member = getMemberFromForm();

  if (!validateMember(member)) {
    return;
  }

  const existingIndex = members.findIndex((record) => record.id === member.id);

  if (existingIndex >= 0) {
    members[existingIndex] = { ...members[existingIndex], ...member };
    alert("Member updated successfully.");
  } else {
    members.push(member);
    alert("Member added successfully.");
  }

  saveMembers();
  renderMembers();
  resetForm();
}

function handleTableClick(event) {
  const target = event.target;
  const action = target.dataset.action;
  const id = target.dataset.id;

  if (!action || !id) {
    return;
  }

  const member = members.find((record) => record.id === id);
  if (!member) {
    return;
  }

  if (action === "edit") {
    populateForm(member);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (action === "delete") {
    const confirmed = confirm(`Delete ${member.fullName} from the database?`);
    if (!confirmed) return;
    members = members.filter((record) => record.id !== id);
    saveMembers();
    renderMembers();
  }
}

function handleSearch() {
  renderMembers();
}

function handleClear() {
  resetForm();
}

function init() {
  loadAccessAccounts();
  loadLastLogin();
  loadMembers();
  setPhotoPreview(null);
  renderMembers();
  
  // Form and member management listeners
  memberForm.addEventListener("submit", handleSave);
  clearButton.addEventListener("click", handleClear);
  photoUploadInput.addEventListener("change", handlePhotoUpload);
  memberTableBody.addEventListener("click", handleTableClick);
  searchTextInput.addEventListener("input", handleSearch);
  filterRoleSelect.addEventListener("change", handleSearch);
  
  // Login and registration listeners
  loginForm.addEventListener("submit", handleLogin);
  registerForm.addEventListener("submit", handleRegister);
  loginUsernameInput.addEventListener("click", showUsernameInfo);
  loginUsernameInput.addEventListener("input", showUsernameInfo);
  loginPasswordInput.addEventListener("input", showUsernameInfo);
  showPasswordCheckbox.addEventListener("change", handleShowPasswordToggle);
  forgotPasswordLink.addEventListener("click", handleForgotPassword);
  showRegisterButton.addEventListener("click", handleShowRegister);
  showLoginButton.addEventListener("click", handleShowLogin);
  
  // Interface navigation listeners
  goToDashboardBtn.addEventListener("click", goToDashboardInterface);
  goToFormBtn.addEventListener("click", goToFormInterface);
  logoutFromFormBtn.addEventListener("click", goToLoginInterface);
  logoutFromDashboardBtn.addEventListener("click", goToLoginInterface);
  
  // Show login interface initially
  showInterface(1);
}

init();