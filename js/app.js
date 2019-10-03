/*
Funktionen HTMLElement.prototype.clear kan bruges til at cleare et element
Funktionen "personLoader" er en standard-skabelon til star-wars "personer" med data som parametre.tilsvarende: starship- og planet-loader
Funktionen "hent" fetcher SW API'et, og her hentes person/starship/planetloader ind, med data som parametre, så de kan hentes igennem API'et
switch funktionen finder ud af hvilken Loader der er trykket på og viser de rigtige informationer
Funktionen "hentListe" fetcher lister fra SW API'et, og bruger "buildList" til HTML'en
*/

HTMLElement.prototype.clear = function () {
    while(this.firstChild) {
        this.removeChild(this.firstChild);
    }
    return this;
};

const personLoader = function (data) {
    const main = document.querySelector('main');
    const article = document.createElement('article');
    article.setAttribute('class', 'personLoad');
    const h1 = document.createElement('h1');
    const pHojde = document.createElement('p');
    const pMass = document.createElement('p');
    const pGender = document.createElement('p');
    const navn = document.createTextNode(data.name);
    const hojde = document.createTextNode('Højde: ' + data.height);
    const mass = document.createTextNode('Vægt: ' + data.mass);
    const gender = document.createTextNode('Køn: ' + data.gender);

    main.appendChild(article);
    article.appendChild(h1);
    article.appendChild(pHojde);
    article.appendChild(pMass);
    article.appendChild(pGender);
    h1.appendChild(navn);
    pHojde.appendChild(hojde);
    pMass.appendChild(mass);
    pGender.appendChild(gender);

    return article;
};

const starshipLoader = function (data) {
    const main = document.querySelector('main');
    const article = document.createElement('article');
    article.setAttribute('class', 'starshipLoad');
    const h1 = document.createElement('h1');
    const pLangde = document.createElement('p');
    const pPassenger = document.createElement('p');
    const pKlasse = document.createElement('p');
    const navn = document.createTextNode(data.name);
    const langde = document.createTextNode('Længde: ' + data.length);
    const passengers = document.createTextNode('Passagere: ' + data.passengers);
    const klasse = document.createTextNode('Klasse: ' + data.starship_class);

    main.appendChild(article);
    article.appendChild(h1);
    article.appendChild(pLangde);
    article.appendChild(pPassenger);
    article.appendChild(pKlasse);
    h1.appendChild(navn);
    pLangde.appendChild(langde);
    pPassenger.appendChild(passengers);
    pKlasse.appendChild(klasse);

    return article;
};

const planetLoader = function (data) {
    const main = document.querySelector('main');
    const article = document.createElement('article');
    article.setAttribute('class', 'planetLoad');
    const h1 = document.createElement('h1');
    const pPopulation = document.createElement('p');
    const pTerrain = document.createElement('p');
    const pDiameter = document.createElement('p');
    const navn = document.createTextNode(data.name);
    const population = document.createTextNode('Befolkningstal: ' + data.population);
    const terrain = document.createTextNode('Terræn: ' + data.terrain);
    const size = document.createTextNode('Diameter: ' + data.diameter);

    main.appendChild(article);
    article.appendChild(h1);
    article.appendChild(pPopulation);
    article.appendChild(pTerrain);
    article.appendChild(pDiameter);
    h1.appendChild(navn);
    pPopulation.appendChild(population);
    pTerrain.appendChild(terrain);
    pDiameter.appendChild(size);

    return article;
};

const buildList = function (data) {
    const article = document.createElement('article');
    const ul = document.createElement('ul');
    ul.setAttribute('class', 'buildList');
    const pagination = document.createElement('div');
    pagination.setAttribute('class', 'pagination');

    if (data.previous) {
        const prev = document.createElement('a');
        prev.setAttribute('class', 'paginationButton');
        const prevText = document.createTextNode('Previous');
        prev.appendChild(prevText);
        pagination.appendChild(prev);
        article.appendChild(pagination);
        const urlString = data.previous.replace('https://swapi.co/api/', '');
        const type = urlString.split('/')[0];
        const page = urlString.split('/')[1].replace('?page=', '');

        prev.setAttribute('href', `?type=${type}&page=${page}`);
    }

    if (data.next) {
        const next = document.createElement('a');
        next.setAttribute('class', 'paginationButton');
        const nextText = document.createTextNode('Next');
        next.appendChild(nextText);
        pagination.appendChild(next);
        article.appendChild(pagination);

        const urlString = data.next.replace('https://swapi.co/api/', '');

        const type = urlString.split('/')[0];
        const page = urlString.split('/')[1].replace('?page=', '');

        next.setAttribute('href', `?type=${type}&page=${page}`);
    }

    

    article.appendChild(ul);

    for (let i = 0; i < data.results.length; i++) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.setAttribute('class', 'listItem');
        const text = document.createTextNode(data.results[i].name);
        li.appendChild(a);
        a.appendChild(text);
        ul.appendChild(li);

        const urlString = data.results[i].url.replace('https://swapi.co/api/', '');

        const type = urlString.split('/')[0];
        const id = urlString.split('/')[1];

        a.setAttribute('href', `?type=${type}&id=${id}`);
    }

    return article; 
};

const hent = function (type, id) {
    const main = document.querySelector('main');
    const spinner = document.createElement('i');
    spinner.setAttribute('class', 'fa fa-spinner fa-spin');
    main.appendChild(spinner);
    
    fetch(`https://swapi.co/api/${type}/${id}/`)
      .then(response => response.json())
      .then(data => { 
        let sheet;
        switch (type) {
            case 'people':
                sheet = personLoader(data);
                break;
            case 'starships':
                sheet = starshipLoader(data);
                break;
            case 'planets':
                sheet = planetLoader(data);
                break;
            default:
                sheet = personLoader(data);
        }
        document
            .querySelector('main')
            .clear()
            .appendChild(sheet);
    });

};

const hentListe = function (type, page) {
    const main = document.querySelector('main');
    const spinner = document.createElement('i');
    spinner.setAttribute('class', 'fa fa-spinner fa-spin');
    main.appendChild(spinner);
    
    fetch(`https://swapi.co/api/${type}/?page=${page}`)
      .then(response => response.json())
      .then(data => { 
        
        document
            .querySelector('main')
            .clear()
            .appendChild(buildList(data));
    });

};

document.addEventListener('DOMContentLoaded', () => {
    
    const pageLoad = document.querySelectorAll('nav a');

    pageLoad.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();

            const urlString = new URL(link.href);
            let type = urlString.searchParams.get('type');
            let page = urlString.searchParams.get('page');
            let id = urlString.searchParams.get('id');

            if (page) {
                hentListe(type, page);
                history.pushState({}, '', `index.html?type=${type}?page=${page}`);
            } else if (id) {
                hent(type, id);
                history.pushState({}, '', `index.html?type=${type}?id=${id}`);
            } else {
                type = 'people';
                page = 1;
                hentListe(type, page);
                history.pushState({}, '', `index.html?type=${type}?page=${page}`);
            }

        });
    });   

    const urlString = new URL(window.location.href);
    let type = urlString.searchParams.get('type');
    let page = urlString.searchParams.get('page');
    if (page) {
        hentListe(type, page);
        history.pushState({}, '', `index.html?type=${type}?page=${page}`);
    } else if (id) {
        hent(type, id);
        history.pushState({}, '', `index.html?type=${type}?id=${id}`);
    } else {
        type = 'people';
        page = 1;
        hentListe(type, page);
        history.pushState({}, '', `index.html?type=${type}?page=${page}`);
    }
    
});

