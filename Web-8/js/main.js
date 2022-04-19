let textField = document.getElementById("hakuteksti");
let searchButton = document.getElementById("hakunappi");
searchButton.addEventListener("click", performSearch);
textField.addEventListener('keypress', checkKey);
let consoleOutput = document.getElementById("console");

function checkKey(e) {
    if (e.keyCode == 13) {
        performSearch();
    }
}

async function performSearch() {
    try {
        let queryText = textField.value;
        if (queryText.trim() == "") {
            displayError('Something went wrong!');
            return;
        }
        let answer = await fetch("https://api.tvmaze.com/search/shows?q=" + queryText);
        if (!answer.ok) {
            displayError('Something went wrong!');
            return;
        }
        const body = await answer.json();
        if (body == ""){
            displayError('Could not find any tv shows!');
            return;
        }
        consoleOutput.value = printRecords(body);
        refreshIframe(body);
    } catch (error) {
        displayError('Something went wrong!');
    }
}

function displayError(errorMessage) {
    let iFrame = document.getElementById('mainpage');
    let sections = iFrame.contentWindow.document.getElementById("content");
    sections.innerHTML = '<div class="errorMsg">' + errorMessage + '</div>';
    let welcome = iFrame.contentWindow.document.getElementById("welcomeMsg");
    welcome.className = 'hidden';
}

function refreshIframe(records) {
    let iFrame = document.getElementById('mainpage');
    let section = iFrame.contentWindow.document.getElementById("content");
    let welcome = iFrame.contentWindow.document.getElementById("welcomeMsg");
    welcome.className = 'hidden';
    drawRecords(section, records);
}

function drawRecords(section, records) {
    section.innerHTML = "";
    for (const recordsKey in records) {
        let record = records[recordsKey];
        let name = record.show.name;
        let link = record.show.officialSite ? record.show.officialSite : "";
        let image = record.show.image ? record.show.image.medium : "";
        let summary = record.show.summary ? record.show.summary : "";
        let genre = record.show.genres ? record.show.genres : "";
        let article = document.createElement('article');
        let title = document.createElement('h1');
        title.innerText = name;
        article.appendChild(title);

        let genText = document.createElement('div');
        let genreText = "";
        for (let i = 0; i < genre.length; i++) {
            genreText += genre[i];
            if (i < genre.length -1){
                genreText += " - ";
            }
        }
        genText.innerHTML = genreText;
        article.appendChild(genText);

        let figure = document.createElement('figure');
        let img = document.createElement('img');
        if (image == "") {
            img.src = 'img/noimage.png';
        } else {
            img.src = image;
        }
        img.alt = name;
        figure.appendChild(img);
        article.appendChild(figure);
        let articleLink;
        if (link == "") {
            articleLink = document.createElement('div');
            articleLink.innerText = "No Home Page.";
        } else {
            articleLink = document.createElement('a');
            articleLink.href = link;
            articleLink.innerText = "Home Page";
            articleLink.target = "_blank";
        }

        article.appendChild(articleLink);
        let sum = document.createElement('div');
        sum.className = 'summary';
        if (summary == "") {
            sum.innerText = "No summary to display.";
        } else {
            sum.innerHTML = summary;
        }
        article.appendChild(sum);
        section.appendChild(article);
    }
}

function printRecords(records) {
    let result = "";
    for (const recordsKey in records) {
        let record = records[recordsKey];
        let name = record.show.name;
        let link = record.show.officialSite ? record.show.officialSite : "";
        let image = record.show.image ? record.show.image.medium : "";
        let summary = record.show.summary ? record.show.summary : "";
        let genre = record.show.genres  ? record.show.genres : "";
        summary = summary.replaceAll("<p>", "");
        summary = summary.replaceAll("</p>", "");
        summary = summary.replaceAll("<b>", "");
        summary = summary.replaceAll("</b>", "");
        summary = summary.replaceAll("<i>", "");
        summary = summary.replaceAll("</i>", "");
        result += `Name: ${name}\nHomepage: ${link}\nImage: ${image}\nSummary: ${summary}\nGenre: ${genre}\n**********************************\n`
    }
    return result;
}