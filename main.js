const canvas = document.querySelector("#canvas");

// fetch for Teleport stored in variable here
const fetchTeleport = async (city) => {
  let result = await (
    await fetch(`https://api.teleport.org/api/cities/?search=${city}`)
  ).json();
  let matches = await result._embedded["city:search-results"];
  return matches;
};

//fetch City details
const fetchCityDetails = async (link) => {
  let result = await ( await fetch(link)).json();
  console.dir(result);
  return result;
}

//functions to print data on screen
function cleanCanvas() {
  canvas.innerHTML = '';

  let logoBox = document.createElement('div');
  logoBox.setAttribute('class', 'canvas__logo-box');
  let logo = document.createElement('img');
  logo.setAttribute('alt', 'Spot Check logo');
  logo.setAttribute(
    "src",
    "https://github.com/fac27/Spot-check/blob/main/imgs/spotcheck__logo--transparent.png?raw=true"
  );
  logo.setAttribute('class', 'canvas__logo');
  
  canvas.append(logoBox);
  logoBox.append(logo);
}

const printSearchResults = async (key) => {
  let resultBox = document.createElement('div');
  let paragraph = document.createElement("p");
  let content = document.createTextNode(key['matching_full_name']);
  let button = document.createElement('button');
  
  button.innerText = 'See more';
  button.addEventListener('click', fetchCityDetails(key['_links']['city:item'].href));

  canvas.appendChild(resultBox);
  resultBox.setAttribute("class", "canvas__result-box");
  resultBox.appendChild(paragraph);
  paragraph.setAttribute('class', 'canvas__result-text');
  paragraph.appendChild(content);
  resultBox.appendChild(button);
  button.setAttribute('class', 'canvas__result-button');
};  

//fetch for Police API stored in variable here

const callPolice = async () => {
  let res = await fetch("https://data.police.uk/api/crimes-street/all-crime?lat=51.55&lng=-0.05&date=2022-01");
  let resData = await res.json();
  console.log(resData);
  return resData;
};

//form submit button behavior
const submitBtn = document.querySelector("#submit-button");
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let searchInput = document.querySelector("#city-input").value;
  let ukRegex = new RegExp(/(United Kingdom)/);

  canvas.innerHTML = '';

  fetchTeleport(searchInput).then((matches) => {
    Object.values(matches).forEach((match) => {
      if (ukRegex.test(match["matching_full_name"])) {
        printSearchResults(match);
      }
    });
  });

  //callPolice here
  //callPolice();
});

//initiate page
cleanCanvas();
