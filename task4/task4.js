document.addEventListener('DOMContentLoaded', function() {
    const api = "06dd3d1f9bb5f1bb3d2ab22ab6ca99e0";
    const baseURL = "https://api.themoviedb.org/3";
    const imgURL = "https://image.tmdb.org/t/p/w500";
    const bannerURL = "https://image.tmdb.org/t/p/original";

    const apiPaths = {
        fetchTrending: `${baseURL}/trending/all/week?api_key=${api}&language=en-US`,
        fetchNetflixOriginals: `${baseURL}/discover/tv?api_key=${api}&with_networks=213`,
        fetchActionMovies: `${baseURL}/discover/movie?api_key=${api}&with_genres=28`,
        fetchComedyMovies: `${baseURL}/discover/movie?api_key=${api}&with_genres=35`,
        fetchRomanceMovies: `${baseURL}/discover/movie?api_key=${api}&with_genres=10749`,
        fetchHorrorMovies: `${baseURL}/discover/movie?api_key=${api}&with_genres=27`,
        fetchDocumentaries: `${baseURL}/discover/movie?api_key=${api}&with_genres=99`
    };

    function setBanner() {
        fetch(apiPaths.fetchNetflixOriginals)
            .then(response => response.json())
            .then(data => {
                const movie = data.results[Math.floor(Math.random() * data.results.length)];
                const banner = document.getElementById('banner');
                banner.style.backgroundImage = `url(${bannerURL}${movie.backdrop_path})`;
                banner.innerHTML = `
                    <h1 class="banner__title">${movie.name || movie.title}</h1>
                    <div class="banner__buttons">
                        <span class="ltr-1vh9doa"><button class="banner__button">Play</button></span>
                        <span class="ltr-1vh9doa"><button class="banner__button">More Info</button></span>
                    </div>
                    <p class="banner__description">${truncate(movie.overview, 150)}</p>`;
            })
            .catch(error => console.error("Failed to set banner:", error));
    }

    function loadMovies(endpoint, title) {
        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                const contentArea = document.getElementById('content-area');
                const row = document.createElement('div');
                row.className = 'row';
                const rowTitle = document.createElement('h2');
                rowTitle.className = 'row__title';
                rowTitle.textContent = title;
                row.appendChild(rowTitle);

                const rowPosters = document.createElement('div');
                rowPosters.className = 'row__posters';
                data.results.forEach(movie => {
                    const poster = document.createElement('img');
                    poster.src = imgURL + movie.poster_path;
                    poster.alt = movie.title || movie.name;
                    poster.className = 'row__posterLarge';
                    rowPosters.appendChild(poster);
                });
                row.appendChild(rowPosters);
                contentArea.appendChild(row);
            })
            .catch(error => console.error(`Failed to load movies for ${title}:`, error));
    }

    function truncate(str, n) {
        return str.length > n ? str.substr(0, n - 1) + '...' : str;
    }

    setBanner();
    loadMovies(apiPaths.fetchTrending, 'Trending Now');
    loadMovies(apiPaths.fetchActionMovies, 'Action Movies');
    loadMovies(apiPaths.fetchComedyMovies, 'Comedy Movies');
    loadMovies(apiPaths.fetchRomanceMovies, 'Romance Movies');
    loadMovies(apiPaths.fetchHorrorMovies, 'Horror Movies');
    loadMovies(apiPaths.fetchDocumentaries, 'Documentaries');
});
