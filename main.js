const canvas = document.querySelector("#canvas");
const crimeOccurrences = document.querySelector("#crime-occurrences");

// fetch for Teleport stored in variable here
const fetchTeleport = async (city) => {
  let result = await (
    await fetch(`https://api.teleport.org/api/cities/?search=${city}`)
  ).json();
  let matches = await result._embedded["city:search-results"];
  return matches;
};

// fetch City details from the url out of search results
const fetchCityDetails = async (link) => {
  let result = await (await fetch(link)).json();
  try {
    printCityDetails(result["_links"]["city:urban_area"].href);
  } catch {
    console.error("printCityDetails did not find a reference to that city");
  }
  try {
    let lat = result.location.latlon.latitude;
    let lon = result.location.latlon.longitude;
    callPolice(lat, lon).then(printPoliceResults);
  } catch {
    console.error("Unable to find that city");
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
  paragraph.setAttribute("class", "canvas__result-text");
  paragraph.appendChild(content);
  resultBox.appendChild(button);

  button.setAttribute("class", "canvas__result-button");
  button.setAttribute("type", "button");

  button.innerText = "See more";
  button.addEventListener("click", (e) => {
    // e.preventDefault();
    fetchCityDetails(key["_links"]["city:item"]["href"]);
  });
};

//render city's scores in a grid
const generateScores = async (url) => {
  let result = await (await fetch(url)).json();
  let scores = await result.categories;
  let scoreCard = document.createElement("div");
  scoreCard.setAttribute("class", "canvas__score-card");

  scores.forEach(score => {
    let key = document.createElement('p');
    let keyText = document.createTextNode(`${score.name}:`);
    key.setAttribute('class', 'city__entry')
    key.append(keyText);

    let scoring = document.createElement('p');
    let scoringText = document.createTextNode(`${Math.floor(score['score_out_of_10'])}/10`);
    scoring.setAttribute('class', 'city__value');
    scoring.append(scoringText);

    scoreCard.append(key, scoring);
  })

  canvas.append(scoreCard);
  console.dir(result.categories);
};

//callaback to print crime data on screen
const printPoliceResults = (occurrences) => {
  try {
    let crimeLabel = document.createElement("div");
    let crimeLabelpara = document.createElement("p");
    crimeLabelpara.innerHTML = "Crime occurrences in this area:";
    crimeOccurrences.appendChild(crimeLabel);
    crimeLabel.appendChild(crimeLabelpara);

    let crimeScoreCard = document.createElement("div");
    crimeScoreCard.setAttribute("class", "canvas__score-card");
    crimeOccurrences.appendChild(crimeScoreCard);

    for (const [key, value] of Object.entries(occurrences)) {
      let crimeEntry = document.createElement("p");
      crimeEntry.setAttribute("class", "city__entry");
      crimeEntry.innerHTML = key;
      crimeScoreCard.appendChild(crimeEntry);

      let crimeValue = document.createElement("p");
      crimeValue.setAttribute("class", "city__value");
      crimeValue.innerHTML = value;
      crimeScoreCard.appendChild(crimeValue);
    }
  } catch {
    console.error("Unable to retrieve data")
  }
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
//fetch for Police API stored in variable here

const callPolice = async (lat, lon) => {
  let res = await fetch(
    `https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lon}&date=2022-01`
  );
  let resData = await res.json();
  // extract crime categories and put in resDataSort array
  try {
    let resDataSort = []
    for (let key in resData) {
      resDataSort.push(resData[key].category)
    }

    // reduce the array to key value pairs of category and occurences
    const firstOccurrences = resDataSort.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});

    //capitalise first letter in keys only
    let occurrences = {};
    for (let key in firstOccurrences) {
      let capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      occurrences[capitalizedKey] = firstOccurrences[key];
    }

    //return sorted response as object
    return occurrences;
  } catch {
    console.error("Unable to find crime data at that location")
  }

};

//form submit button behavior
const submitBtn = document.querySelector("#submit-button");
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let searchInput = document.querySelector("#city-input").value;
  let ukRegex = new RegExp(/(United Kingdom)/);

  canvas.innerHTML = "";

  fetchTeleport(searchInput).then((matches) => {
    Object.values(matches).forEach((match) => {
      if (ukRegex.test(match["matching_full_name"])) {
        printSearchResults(match);
      }
    });
  });

});

//initiate page
cleanCanvas();

