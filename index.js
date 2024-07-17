document.addEventListener('DOMContentLoaded', function () {
    const formsContainer = document.getElementById('formsContainer');
    const movieListSection = document.getElementById('movieList');

    // Function to create the login form
    function createLoginForm() {
        const loginFormHTML = `
            <div id="loginForm" class="form-container">
                <h2>Login</h2>
                <form id="login" autocomplete="off">
                    <div class="form-group">
                        <label for="loginUsername">Username</label>
                        <input type="text" id="loginUsername" name="loginUsername" required>
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Password</label>
                        <input type="password" id="loginPassword" name="loginPassword" required>
                    </div>
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <a href="#" id="showRegisterForm">Register here</a></p>
            </div>
        `;
        return loginFormHTML;
    }

    // Function to create the registration form
    function createRegistrationForm() {
        const registerFormHTML = `
            <div id="registerForm" class="form-container">
                <h2>Register</h2>
                <form id="register" autocomplete="off">
                    <div class="form-group">
                        <label for="registerUsername">Username</label>
                        <input type="text" id="registerUsername" name="registerUsername" required>
                    </div>
                    <div class="form-group">
                        <label for="registerEmail">Email</label>
                        <input type="email" id="registerEmail" name="registerEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="registerPassword">Password</label>
                        <input type="password" id="registerPassword" name="registerPassword" required>
                    </div>
                    <button type="submit">Register</button>
                </form>
                <p>Already have an account? <a href="#" id="showLoginForm">Login here</a></p>
            </div>
        `;
        return registerFormHTML;
    }

    // Function to fetch existing movies from db.json
    function fetchMovies() {
        fetch('http://localhost:3000/movies')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Display movies dynamically
                const moviesHTML = data.map(movie => `
                    <article class="movie-item">
                        <h2><a href="movie-details.html">${movie.title}</a></h2>
                        <p>Genre: <span class="genre">${movie.genre}</span></p>
                    </article>
                `).join('');

                movieListSection.innerHTML = moviesHTML;
            })
            .catch(error => {
                console.error('Error fetching movies:', error);
                // Handle error, show user-friendly message, etc.
            });
    }

    // Display the login form by default
    formsContainer.innerHTML = createLoginForm();

    // Event listener for switching between forms
    formsContainer.addEventListener('click', function (event) {
        event.preventDefault();
        if (event.target.id === 'showLoginForm') {
            formsContainer.innerHTML = createLoginForm();
        } else if (event.target.id === 'showRegisterForm') {
            formsContainer.innerHTML = createRegistrationForm();
        }
    });

    // Event listener for login form submission
    formsContainer.addEventListener('submit', function (event) {
        event.preventDefault();
        if (event.target.id === 'login') {
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            // Implement login functionality here (fetch to validate credentials)
            fetch('http://localhost:3000/users')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(users => {
                    const user = users.find(user => user.username === username && user.password === password);
                    if (user) {
                        console.log(`User ${username} logged in successfully!`);
                        // Redirect to profile page or update UI as needed
                    } else {
                        console.error('Invalid username or password');
                        // Handle invalid login attempt
                    }
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                    // Handle error, show user-friendly message, etc.
                });
        }
    });

    // Event listener for registration form submission
    formsContainer.addEventListener('submit', function (event) {
        event.preventDefault();
        if (event.target.id === 'register') {
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            // Implement registration functionality here (fetch to post new user data)
            const registerData = {
                username: username,
                email: email,
                password: password
            };

            fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Registration successful:', data);
                // Optionally, redirect to a new page or update UI
            })
            .catch(error => {
                console.error('Error during registration:', error);
                // Handle error, show user-friendly message, etc.
            });
        }
    });

    // Fetch movies on page load
    fetchMovies();
});