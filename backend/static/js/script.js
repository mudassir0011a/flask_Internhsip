document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    // Initialize core functions
    checkLoginStatus();
    setupFAQToggle();
    setupDarkMode();
    setupLoginForm();
    setupLogout();
    setupApplicationForm();
    setupPageSpecificScripts();
    setupSearchFunctionality();

    // Updated Toggle Password Visibility
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSelector = this.getAttribute('data-target');
            let passwordInput;
            if (targetSelector) {
                passwordInput = document.querySelector(targetSelector);
            } else {
                // Look for an input of type password or text inside the parent element
                passwordInput = this.parentElement.querySelector('input[type="password"], input[type="text"]');
            }
            if (!passwordInput) {
                console.error("Password input not found");
                return;
            }
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            }
        });
    });

    // Apply Now Button Handler
    const applyNowButtons = document.querySelectorAll("#applyNowBtn");
    applyNowButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
            const role = localStorage.getItem("role");
            if (!isLoggedIn) {
                event.preventDefault();
                showLoginAlert();
            } else if (role === "recruiter") { // New condition for recruiter
                event.preventDefault();
                Swal.fire({
                    title: "<strong>Action Not Allowed</strong>",
                    html: "<p class='swal-text'>As a recruiter, you cannot apply for internships.</p>",
                    icon: "info",
                    confirmButtonText: "OK",
                    customClass: {
                        popup: 'swal-popup',
                        title: 'swal-title',
                        htmlContainer: 'swal-text'
                    }
                });
            }
        });
    });

    // Dark Mode Toggle Handler
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
        darkModeToggle.addEventListener("change", function () {
            document.body.classList.toggle("dark-mode", this.checked);
        });
    }
});

// ------------------------- Core Functions -------------------------

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("role");

    const dashboardLink = document.getElementById("dashboard-link");
    const logoutLink = document.getElementById("logout-link");
    const loginLink = document.getElementById("login-link");
    const signupLink = document.getElementById("signup-link");

    // Allowed roles only
    const validRoles = ["student", "recruiter"];
    
    if (!isLoggedIn || !validRoles.includes(role)) {
        // Invalid session, clear login data
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");
    }

    if (dashboardLink) {
        if (isLoggedIn && role === "student") {
            dashboardLink.href = "dashboard.html";
            dashboardLink.classList.remove("d-none");
        } else if (isLoggedIn && role === "recruiter") {
            dashboardLink.href = "recruiter.html";
            dashboardLink.classList.remove("d-none");
        } else {
            dashboardLink.classList.add("d-none");
        }
    }
    
    if (logoutLink) logoutLink.classList.toggle("d-none", !isLoggedIn);
    if (loginLink) loginLink.classList.toggle("d-none", isLoggedIn);
    if (signupLink) signupLink.classList.toggle("d-none", isLoggedIn);
}

// Logout function
function logoutUser() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    window.location.href = "index.html";
}

function showLoginAlert() {
    Swal.fire({
        title: "Access Denied!",
        text: "Please login first to continue.",
        icon: "warning",
        confirmButtonText: "Login Now",
        confirmButtonColor: "#ff4d4d"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "login.html";
        }
    });
}

function showModal(title, message, callback) {
    if (typeof bootstrap === "undefined") {
        console.error("Bootstrap is not defined. Ensure Bootstrap JS is loaded.");
        return;
    }
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    modalTitle.textContent = title;
    modalBody.textContent = message;
    modal.show();
    const modalElement = document.getElementById('confirmationModal');
    modalElement.addEventListener('hidden.bs.modal', function () {
        if (callback) callback();
    }, { once: true });
}

// ------------------------- Feature Setup Functions -------------------------

function setupLoginForm() {
    const loginForm = document.querySelector(".login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const emailElem = document.getElementById("email");
            const passwordElem = document.getElementById("password");
            const roleElem = document.getElementById("role");

            if (!emailElem || !passwordElem || !roleElem) {
                Swal.fire({
                    title: "Missing Fields",
                    text: "Please fill in all required fields.",
                    icon: "warning",
                    confirmButtonText: "OK"
                });
                return;
            }

            // Normalize inputs
            const email = emailElem.value.trim().toLowerCase();
            const password = passwordElem.value.trim();
            const role = roleElem.value.trim().toLowerCase();

            if (!email || !password || !role) {
                Swal.fire({
                    title: "Missing Fields",
                    text: "Please fill in all required fields.",
                    icon: "warning",
                    confirmButtonText: "OK"
                });
                return;
            }

            // Hardcoded valid credentials (case sensitive for password)
            const validCredentials = {
                student: { email: "huzaifa@gmail.com", password: "Student@123" },
                recruiter: { emails: ["infosys@tech.com"], password: "Recruiter@123" }
            };

            let isValid = false;
            if (role === "student" &&
                email === validCredentials.student.email &&
                password === validCredentials.student.password) {
                isValid = true;
            } else if (role === "recruiter" &&
                validCredentials.recruiter.emails.includes(email) &&
                password === validCredentials.recruiter.password) {
                isValid = true;
            }

            if (isValid) {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("role", role);
                checkLoginStatus(); // Update UI accordingly

                // Show a SweetAlert2 popup with "Continue to Dashboard" button
                Swal.fire({
                    title: "Login Successful!",
                    text: "Welcome back to your account.",
                    icon: "success",
                    confirmButtonText: "Continue to Dashboard",
                    confirmButtonColor: "#4CAF50"
                }).then(() => {
                    const dashboardURL = (role === "student") ? "dashboard.html" : "recruiter.html";
                    window.location.href = dashboardURL;
                });
            } else {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("role");
                Swal.fire({
                    title: "Invalid Credentials",
                    text: "The email or password you entered is incorrect.",
                    icon: "error",
                    confirmButtonText: "Try Again",
                    confirmButtonColor: "#FF4D4D"
                });
            }
        });
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById("logout-link");
    if (logoutBtn && !logoutBtn.dataset.listenerAttached) { // attach only once
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            Swal.fire({
                title: '<div class="float-icon"><i class="fas fa-sign-out-alt"></i></div>Logout Confirmation',
                html: '<div class="custom-swal-content">Are you sure you want to logout?</div>',
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: '#ff4d4d',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, Logout',
                cancelButtonText: 'Cancel',
                customClass: {
                    container: 'custom-swal-container',
                    popup: 'custom-swal-popup',
                    title: 'custom-swal-title'
                },
                showClass: {
                    popup: 'animate__animated animate__fadeInDown animate__faster'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp animate__faster'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Logging out...',
                        html: 'Please wait while we log you out.',
                        timer: 2000,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    }).then(() => {
                        Swal.fire({
                            title: 'Logged Out Successfully!',
                            text: 'Thank you for using our service. See you soon!',
                            icon: 'success',
                            confirmButtonText: 'Back to Home',
                            confirmButtonColor: '#4776E6',
                            timer: 3000,
                            timerProgressBar: true,
                            showClass: {
                                popup: 'animate__animated animate__fadeInDown animate__slow'
                            },
                            hideClass: {
                                popup: 'animate__animated animate__fadeOutUp animate__slow'
                            }
                        }).then(() => {
                            localStorage.removeItem("isLoggedIn");
                            localStorage.removeItem("role");
                            window.location.href = "index.html";
                        });
                    });
                }
            });
        });
        logoutBtn.dataset.listenerAttached = "true";
    }
}

function setupApplicationForm() {
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', function (event) {
            event.preventDefault();
            Swal.fire({
                title: "Form Submitted Successfully!",
                text: "We have received your information.",
                icon: "success",
                confirmButtonText: "Close",
                confirmButtonColor: "#4e72c4"
            }).then(() => {
                window.location.href = "internship.html";
            });
        });
    }
}

function setupFAQToggle() {
    const faqToggles = document.querySelectorAll('.faq-toggle');
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const isAlreadyOpen = this.classList.contains('active');
            faqToggles.forEach(btn => {
                btn.classList.remove('active');
                if (btn.nextElementSibling) btn.nextElementSibling.style.display = 'none';
            });
            if (!isAlreadyOpen) {
                this.classList.add('active');
                const faqContent = this.nextElementSibling;
                if (faqContent) faqContent.style.display = 'block';
            }
        });
    });
}

function setupDarkMode() {
    console.log("Setting up dark mode...");
    // Additional dark mode logic can be added here.
}

function setupPageSpecificScripts() {
    // Dark Mode Toggle within Dashboard or page-specific scripts.
    const toggleDarkModeButton = document.getElementById('toggleDarkMode');
    if (toggleDarkModeButton) {
        toggleDarkModeButton.addEventListener('click', function () {
            document.body.classList.toggle('dark-mode');
        });
    }
    // Mark Notification as Read
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => {
        notification.addEventListener('click', function () {
            notification.style.backgroundColor = '#e9ecef';
            notification.style.cursor = 'default';
            alert("Notification marked as read.");
        });
    });
    // Settings Form Validation
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function (e) {
            const passwordInput = document.getElementById('password');
            if (!passwordInput) {
                alert("Password input not found.");
                return;
            }
            const password = passwordInput.value;
            if (password.length < 6) {
                e.preventDefault();
                alert("Password must be at least 6 characters long.");
            } else {
                alert("Settings updated successfully!");
            }
        });
    }
    // Updated Sign-Up / Sign-In Toggle
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const mainContainer = document.querySelector(".container");
    if (signUpButton && signInButton && mainContainer) {
        signUpButton.addEventListener("click", () => {
            mainContainer.classList.add("right-panel-active");
        });
        signInButton.addEventListener("click", () => {
            mainContainer.classList.remove("right-panel-active");
        });
    }
    // Register User
    const registerForm = document.querySelector(".register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const fullNameInput = document.getElementById("fullName");
            const emailInput = document.getElementById("email");
            const passwordInput = document.getElementById("password");
            const confirmPasswordInput = document.getElementById("confirmPassword");
            const roleSelect = document.getElementById("role");
            if (!fullNameInput || !emailInput || !passwordInput || !confirmPasswordInput || !roleSelect) {
                alert("Please fill all the fields.");
                return;
            }
            const fullName = fullNameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();
            const role = roleSelect.value;
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
            const userData = { fullName, email, password, role };
            localStorage.setItem("userData", JSON.stringify(userData));
            alert("Registration successful! You can now login.");
            window.location.href = "login.html";
        });
    }
}

function setupSearchFunctionality() {
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    if (!searchInput || !searchResults) {
        console.info("Search functionality not initialized on this page.");
        return;
    }
    const internships = [
        "Software Engineer Intern",
        "Data Analyst Intern",
        "Marketing Intern",
        "Graphic Designer Intern",
        "UI/UX Designer Intern",
        "Web Developer Intern",
        "Product Manager Intern",
        "Content Writer Intern"
    ];
    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        searchResults.innerHTML = "";
        if (query) {
            const filteredInternships = internships.filter(intern => intern.toLowerCase().includes(query));
            filteredInternships.forEach(intern => {
                const div = document.createElement("div");
                div.textContent = intern;
                div.addEventListener("click", function () {
                    window.location.href = `internships.html?search=${encodeURIComponent(intern)}`;
                });
                searchResults.appendChild(div);
            });
        }
    });
}
