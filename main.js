const canvas = document.querySelector("#canvas");

// fetch for Teleport stored in variable here
const fetchTeleport = async (city) => {
  let result = await (
    await fetch(`https://api.teleport.org/api/cities/?search=${city}`)
  ).json();
  let matches = await result._embedded["city:search-results"];
  return matches;
};

//fetch for Police API stored in variable here
const callPolice = async () => {
  let res = await fetch(
    "https://data.police.uk/api/crimes-street/all-crime?lat=51.55&lng=-0.05&date=2022-01"
  );
  let resData = await res.json();
  // extract crime categories and put in resDataSort array
  let resDataSort = [];
  for (let key in resData) {
    resDataSort.push(resData[key].category);
  }
  // reduce the array to key value pairs of category and occurences
  const occurrences = resDataSort.reduce(function (acc, curr) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
  }, {});
  //return sorted response as object
  return occurrences;
};

// fetch City details from the url out of search results
const fetchCityDetails = async (link) => {
  let result = await (await fetch(link)).json();
  try {
    printCityDetails(result["_links"]["city:urban_area"].href);
    console.dir(result["_links"]["city:urban_area"].href);
    callPolice().then(printPoliceResults);
  } catch {
    window.alert("No data available for that city");
    console.error("printiCityDetails did not find a reference for this city");
  }
};

//functions to print data on screen

//node-type function to render HTML !!
const printHTML = async (data) => {
  const template = document.createElement("template");
  template.innerHTML = data.trim();
  return template.content.firstChild;
};

//render the landing page with Spot Check logo
function cleanCanvas() {
  canvas.innerHTML = "";

  let logoBox = document.createElement("div");
  logoBox.setAttribute("class", "canvas__logo-box");
  let logo = document.createElement("img");
  logo.setAttribute("alt", "Spot Check logo");
  logo.setAttribute(
    "src",
    "https://github.com/fac27/Spot-check/blob/main/imgs/spotcheck__logo--transparent.png?raw=true"
  );
  logo.setAttribute("class", "canvas__logo");

  canvas.append(logoBox);
  logoBox.append(logo);
}

//render search results from Teleport
const printSearchResults = async (key) => {
  let resultBox = document.createElement("div");
  let paragraph = document.createElement("p");
  let content = document.createTextNode(key["matching_full_name"]);
  let button = document.createElement("button");

  canvas.appendChild(resultBox);
  resultBox.setAttribute("class", "canvas__result-box");
  resultBox.appendChild(paragraph);
  paragraph.classList.add("canvas__result-text", "stack-md");
  paragraph.appendChild(content);
  resultBox.appendChild(button);

  button.setAttribute("class", "canvas__result-button");
  button.setAttribute("type", "button");

  button.innerText = "See more";
  button.addEventListener("click", (e) => {
    console.log(key);
    fetchCityDetails(key["_links"]["city:item"]["href"]);
  });
};

//render city's scores in a grid
const generateScores = async (url) => {
  let result = await (await fetch(url)).json();
  let scores = await result.categories;
  let scoreCard = document.createElement("div");
  scoreCard.classList.add("canvas__score-card", "stack-sm");

  scores.forEach((score) => {
    let key = document.createElement("p");
    let keyText = document.createTextNode(`${score.name}:`);
    key.setAttribute("class", "city__entry");
    key.append(keyText);

    let scoring = document.createElement("p");
    let scoringText = document.createTextNode(
      `${Math.floor(score["score_out_of_10"])}/10`
    );
    scoring.setAttribute("class", "city__value");
    scoring.append(scoringText);

    scoreCard.append(key, scoring);
  });

  canvas.append(scoreCard);
};

//callaback to print crime data on screen
const printPoliceResults = (occurences) => {
  let sortedCrimes = "";
  for (const [key, value] of Object.entries(occurences)) {
    sortedCrimes += `<p>Crime: ${key} Occurrences: ${value}</p>`;
  }
  document.getElementById("crime-occurrences").innerHTML = sortedCrimes;

  scores.forEach((score) => {
    let nameElement = document.createElement("p");
    let nameText = document.createTextNode(`${score.name}:`);
    nameElement.append(nameText);
    nameElement.setAttribute("class", "city__entry");

    let scoreParagraph = document.createElement("p");
    let scoreText = document.createTextNode(
      `${Math.floor(score["score_out_of_10"])}/10`
    );
    scoreParagraph.append(scoreText);
    scoreParagraph.setAttribute("class", "city__value");

    scoreCard.append(nameElement, scoreParagraph);
  });
};

//render city stats for selected match
const printCityDetails = async (url) => {
  let city = await (await fetch(url)).json();
  canvas.innerHTML = "";

  printHTML(`
  <div>
  <h2>${city["full_name"]}</h2>
  <p>Mayor: ${city.mayor}</p>
  </div>
  `).then((element) => canvas.appendChild(element));

  generateScores(`${url}scores`);
};

let canSearch =
  document.querySelector(".form__input").value.length != 0 &&
  !submitBtn.classList.contains("form__button--inactive")
;

function startSearch() {
  let searchBox = document.querySelector("#city-input");

  if (submitBtn.classList.contains("form__button--inactive")) {
    submitBtn.classList.remove("form__button--inactive");
    cleanCanvas();
    submitBtn.innerText = "Search";
    searchBox.disabled = false;
  } else {
    let ukRegex = new RegExp(/(United Kingdom)/);
    let searchInput = document.querySelector("#city-input").value;

    canvas.innerHTML = "";

    fetchTeleport(searchInput).then((matches) => {
      Object.values(matches).forEach((match) => {
        if (ukRegex.test(match["matching_full_name"])) {
          printSearchResults(match);
        }
      });
    });

    submitBtn.classList.add("form__button--inactive");
    submitBtn.innerText = "Back ";
    searchBox.disabled = true;
    searchBox.value = "";
  }
}

//form submit button behavior
const submitBtn = document.querySelector("#submit-button");
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  canSearch ? startSearch : window.alert("please enter a city");
  console.log(canSearch);
});

//initiate page
cleanCanvas();
