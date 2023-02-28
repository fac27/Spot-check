const canvas = document.querySelector("#canvas");
const crimeOccurrences = document.querySelector("#crime-occurrences");
const gifFig = document.querySelector("#gif-load");

// fetch for Teleport stored in variable here
const fetchTeleport = async (city) => {
  let result = await (
    await fetch(`https://api.teleport.org/api/cities/?search=${city}`)
  ).json();
  let matches = await result._embedded["city:search-results"];
  return matches;
};

//fetch for Police API stored in variable here
const callPolice = async (lat, lon) => {
  let res = await fetch(
    `https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lon}&date=2022-01`
  );
  let resData = await res.json();
  // extract crime categories and put in resDataSort array
  try {
    let resDataSort = [];
    for (let key in resData) {
      resDataSort.push(resData[key].category);
    }

    // reduce the array to key value pairs of category and occurences
    const firstOccurrences = resDataSort.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
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
    console.error("Unable to find crime data at that location");
  }
};

// fetch City details from the url out of search results
const fetchCityDetails = async (link) => {
  let result = await (await fetch(link)).json();
  let lat = await result.location.latlon.latitude;
  let lon = await result.location.latlon.longitude;
  try {
    printCityDetails(result["_links"]["city:urban_area"].href);
  } catch {
    window.alert("No data available for that city");
    console.error("printiCityDetails did not find a reference for this city");
  }
  try {
    callPolice(lat, lon).then(printPoliceResults);
  } catch {
    console.error("callPolice did not find a reference for this city");
    window.alert('No data available for that city');
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

  printHTML(`
    <div class='canvas__logo-box'>
      <img
      src='https://github.com/fac27/Spot-check/blob/main/imgs/spotcheck__logo--transparent.png?raw=true'
      alt='spot check logo'
      class='canvas__logo'
      >
    </div>
  `).then(element => canvas.append(element));
}

//render search results from Teleport
const printSearchResults = async (key) => {

  printHTML(`
    <div class='canvas__result-box'>
      <p class='canvas__result-text'>${key.matching_full_name}</p>
      <button 
        type='button' 
        class='canvas__result-button'
      >
        See more
      </button>
    </div>
  `).then(element => {
    canvas.append(element);
    let button = element.querySelector('button');
    button.addEventListener("click", (e) => {
      fetchCityDetails(key["_links"]["city:item"]["href"]);
    });
  }); 
};

//render city's scores in a grid
const generateScores = async (url) => {
  const result = await (await fetch(url)).json();
  let scores = result.categories.filter(score => 
    score.name === 'Safety' || 
    score.name === 'Cost of Living' || 
    score.name === 'Education' || 
    score.name === 'Internet Access' || 
    score.name === 'Healthcare'
  );
  let scoreCard = document.getElementById("score-card");

  scores.forEach((score) => {
    if (score.name !== 'Safety'){
      printHTML(`
        <p class='city__entry'>${score.name}: <p>
      `).then(element => scoreCard.append(element));
      printHTML(`
        <p class='city__value'>${Math.floor(score.score_out_of_10)}/10<p>
      `).then(element => scoreCard.append(element));
    }
    else{
      printHTML(`
        <p class='canvas__city-safety'>
          ${score.name}: 
            <span class='canvas__city-safety-score'>${Math.floor(score.score_out_of_10)}</span>
          /10
        <p>
      `).then((element) => {
        let searchHeader = document.querySelector('.canvas__search-header');
        searchHeader.append(element)
        let safetySpan = document.querySelector('.canvas__city-safety-score');
        let safetySpanScore = Math.floor(score.score_out_of_10);
        
        if(safetySpanScore >= 0 && safetySpanScore <= 4){
          safetySpan.classList.add('canvas__city-safety-score--red');
        } else if(safetySpanScore >= 5 && safetySpanScore <= 7) {
          safetySpan.classList.add('canvas__city-safety-score--yellow');
        } else {
          safetySpan.classList.add('canvas__city-safety-score--green');
        }
      });
    }
  });

  canvas.append(scoreCard);
};

//callaback to print crime data on screen
const printPoliceResults = (occurrences) => {
  try {
    
    gifFig.style.display = 'flex';
    setTimeout(() => {
      gifFig.style.display = 'none';
      let crimeScoreCard = document.createElement("div");
      crimeScoreCard.classList.add("canvas__score-card", 'canvas__score-card--crime', 'stack-sm');
      canvas.appendChild(crimeScoreCard);
      for (const [key, value] of Object.entries(occurrences)) {
        if(key === 'Burglary' || 
          key === 'Bicycle-theft' || 
          key === 'Public-order' || 
          key === 'Other-crime'){
          
          printHTML(`
            <p class='city__entry'>${key}:<p>
          `).then(element => crimeScoreCard.append(element));
    
          printHTML(`
            <p class='city__value'>${value}<p>
          `).then(element => crimeScoreCard.append(element));
        }
      };
    }, 2001);
  } catch {
    console.error("Unable to retrieve data");
  }
};

//render city stats for selected match
const printCityDetails = async (url) => {
  let city = await (await fetch(url)).json();
  canvas.innerHTML = "";

  // show the loading gif image
  gifFig.style.display = "flex";
  // delay the printHTML & generateScores by at least 2 seconds
  setTimeout(() => {
    // hide loading gif before proceeding with the rest of the code
    gifFig.style.display = "none";
    printHTML(`
    <div class='canvas__search-header'>
    <h2 class='city__entry--title'>${city["full_name"]}</h2>
    <p class='city__entry--subtitle'>Mayor: ${city.mayor}</p>
    </div>
    `).then((element) => canvas.appendChild(element));
    printHTML(`
      <div id='score-card' class='canvas__score-card stack-sm'></div>
    `).then(element => canvas.append(element));
    generateScores(`${url}scores`);
  }, 2000);
};

//edit-form-behaviour
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
      let filteredMatches = Object.values(matches).filter(match => ukRegex.test(match.matching_full_name));

      filteredMatches.forEach(match => {
        if (ukRegex.test(match["matching_full_name"])) {
          // hide loading gif before printSearchResults(match) is called
          gifFig.style.display = "none";
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

  if (document.getElementById('city-input').value.length !== 0) {
    // show the loading gif image
    gifFig.style.display = "flex";
    while (canvas.firstChild) {
      canvas.removeChild(canvas.firstChild);
    }
    // delay the execution of startSearch() by at least 2 seconds
    setTimeout(() => {
      startSearch();
    }, 2000);
    
  } else {
    if (!submitBtn.classList.contains('form__button--inactive')) {
      window.alert("please enter a city");
    } else {
      startSearch();
    }
  }
});

//initiate page
cleanCanvas();