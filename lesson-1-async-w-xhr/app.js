(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        const unsplashRequest = new XMLHttpRequest();
        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.onload = addImage;
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID 4b73d21f72f75dfca51f011b46030b685f0444816f4c96fef8b166554069c8a3');
        unsplashRequest.send();

        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.open('GET', `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=4e7e237952f04b7eb05c9842ae4259b8`);
        articleRequest.send();

        function addImage() {
            let htmlContent = '';
            const data = JSON.parse(this.responseText);
            if (data && data.results && data.results[0]) {
                const firstImage = data.results[0];
                htmlContent = `<figure>
                <img src='${firstImage.urls.regular}' alt='Image searched for'>
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
            } else {
                console.log('No photo');
            }

            responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        }

        function addArticles() {

            let htmlContent = '';
            const data = JSON.parse(this.responseText);
            if (data.response.docs.length > 1) {
                htmlContent = '<ul>' + data.response.docs.map(article => `<a target="_blank" href="${article.web_url}"><li class="article"><h2>${article.headline.main}</h2>
            <p>${article.snippet}</p></li></a>
            `).join('')
            + '</ul>';
            } else {
                console.log('No articles');
            }

            responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }
    });
})();
