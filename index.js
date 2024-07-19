document.addEventListener('DOMContentLoaded', function () {
    const formsContainer = document.getElementById('formsContainer');
    const createMovieForm = document.getElementById('createMovieForm');
    const editMovieForm = document.getElementById('editMovieForm');
    const movieListSection = document.getElementById('movieList');
    const searchInput = document.getElementById('searchInput');
    let movies = [];

    // Fetch existing movies from db.json
    function fetchMovies() {
        fetch('http://localhost:3000/movies')
            .then(response => response.json())
            .then(data => {
                movies = data;
                displayMovies(movies);
            })
            .catch(error => console.error('Error fetching movies:', error));
    }

    // Display movies
    function displayMovies(filteredMovies) {
        const moviesHTML = filteredMovies.map((movie) => `
            <article class="movie-item">
                <h2><a href="#" data-id="${movie.id}" class="movie-title">${movie.title}</a></h2>
                <img src="${movie.image}" alt="${movie.title} Poster" onerror="this.onerror=null;this.src='placeholder.jpg';"/>
                <p>Genre: <span class="genre">${movie.genre}</span></p>
                <p>${movie.description || 'No description available'}</p>
                <button class="edit-btn" data-id="${movie.id}">Edit</button>
                <button class="delete-btn" data-id="${movie.id}">Delete</button>
            </article>
        `).join('');
        movieListSection.innerHTML = moviesHTML;
    }

    // Create movie
    createMovieForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const newMovie = {
            title: document.getElementById('movieTitle').value,
            image: document.getElementById('moviePoster').value,
            description: document.getElementById('movieDescription').value,
            showtime: document.getElementById('movieShowtime').value,
            runtime: document.getElementById('movieRuntime').value,
            capacity: document.getElementById('movieCapacity').value,
            ticketsSold: document.getElementById('movieTicketsSold').value
        };

        fetch('http://localhost:3000/movies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMovie)
        })
        .then(response => response.json())
        .then(data => {
            movies.push(data);
            displayMovies(movies);
            createMovieForm.reset();
        })
        .catch(error => console.error('Error adding movie:', error));
    });

    // Show edit form with movie details
    movieListSection.addEventListener('click', function (event) {
        if (event.target.classList.contains('edit-btn')) {
            const movieId = event.target.getAttribute('data-id');
            const movie = movies.find(m => m.id === parseInt(movieId));

            document.getElementById('editMovieId').value = movie.id;
            document.getElementById('editMovieTitle').value = movie.title;
            document.getElementById('editMoviePoster').value = movie.image;
            document.getElementById('editMovieDescription').value = movie.description;
            document.getElementById('editMovieShowtime').value = movie.showtime;
            document.getElementById('editMovieRuntime').value = movie.runtime;
            document.getElementById('editMovieCapacity').value = movie.capacity;
            document.getElementById('editMovieTicketsSold').value = movie.ticketsSold;

            createMovieForm.style.display = 'none';
            editMovieForm.style.display = 'block';
        }
    });

    // Update movie
    editMovieForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const movieId = document.getElementById('editMovieId').value;
        const updatedMovie = {
            title: document.getElementById('editMovieTitle').value,
            image: document.getElementById('editMoviePoster').value,
            description: document.getElementById('editMovieDescription').value,
            showtime: document.getElementById('editMovieShowtime').value,
            runtime: document.getElementById('editMovieRuntime').value,
            capacity: document.getElementById('editMovieCapacity').value,
            ticketsSold: document.getElementById('editMovieTicketsSold').value
        };

        fetch(`http://localhost:3000/movies/${movieId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedMovie)
        })
        .then(response => response.json())
        .then(data => {
            movies = movies.map(m => m.id === parseInt(movieId) ? data : m);
            displayMovies(movies);
            createMovieForm.style.display = 'block';
            editMovieForm.style.display = 'none';
            editMovieForm.reset();
        })
        .catch(error => console.error('Error updating movie:', error));
    });

    // Delete movie
    movieListSection.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-btn')) {
            const movieId = event.target.getAttribute('data-id');

            fetch(`http://localhost:3000/movies/${movieId}`, {
                method: 'DELETE'
            })
            .then(() => {
                movies = movies.filter(m => m.id !== parseInt(movieId));
                displayMovies(movies);
            })
            .catch(error => console.error('Error deleting movie:', error));
        }
    });

    // Fetch and display movies initially
    fetchMovies();

    // Event listener for search input
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(searchTerm));
        displayMovies(filteredMovies);
    });
});
