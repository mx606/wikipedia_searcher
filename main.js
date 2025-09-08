const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const resultsContainer = document.querySelector('.results-container');
const loader = document.querySelector('.loader');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value;
    if (searchTerm.trim() === "") {
        alert("Please enter a search term.");
        return;
    }
    console.log("Searching for:", searchTerm);
    fetchResults(searchTerm);
});

async function fetchResults(searchTerm) {
    loader.style.display = 'block';
    resultsContainer.innerHTML = '';
    const endpoint = `https://ar.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=30&srsearch=${searchTerm}`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const json = await response.json();
        console.log("json data : ", json);
        displayResults(json.query.search);
    }
    catch (error) {
        console.log("Fetch error:", error);
        resultsContainer.innerHTML = '<div class="result-item">An error occurred while fetching data. Please try again.</div>';
    } finally {
        loader.style.display = 'none';
    }
}

function displayResults(results) {
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="result-item">No results found.</div>';
        return;
    }
    results.forEach((result) => {
        const resultUrl = `https://ar.wikipedia.org/?curid=${result.pageid}`;
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `
            <a href="${resultUrl}" target="_blank" rel="noopener"
              ><h3 class="result-title">${result.title}</h3></a
            >
            <div class="result-snippet">${result.snippet}</div>
        `
        resultsContainer.appendChild(resultItem);
    })
}

