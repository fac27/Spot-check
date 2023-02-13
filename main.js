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
  resultBox.appendChild(button);
  button.setAttribute('class', 'canvas__result-button');
  paragraph.appendChild(content);
};  

//fetch for Police API stored in variable here

//form submit button behavior
const submitBtn = document.querySelector("#submit-button");
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let searchInput = document.querySelector("#city-input").value;
  let ukRegex = new RegExp(/(United Kingdom)/);

  fetchTeleport(searchInput).then((matches) => {
    Object.values(matches).forEach((match) => {
      if (ukRegex.test(match["matching_full_name"])) {
        printSearchResults(match);
      }
    });
  });

  //callPolice here
});
