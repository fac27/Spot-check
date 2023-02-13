const canvas = document.querySelector("#canvas");
//functions to print data on screen
const printSearchResults = async (key) => {
  let paragraph = document.createElement("p");
  let content = document.createTextNode(key);

  canvas.appendChild(paragraph);
  paragraph.appendChild(content);
  paragraph.setAttribute("class", "canvas__paragraph");
};

// fetch for Teleport stored in variable here
const callTeleport = async (city) => {
  let result = await (
    await fetch(`https://api.teleport.org/api/cities/?search=${city}`)
  ).json();
  let matches = await result._embedded["city:search-results"];

  console.dir(matches);
  return matches;
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

  callTeleport(searchInput).then((matches) => {
    Object.values(matches).forEach((match) => {
      if (ukRegex.test(match["matching_full_name"])) {
        printSearchResults(match["matching_full_name"]);
      }
    });
  });

  //callPolice here
  //callPolice();
});
