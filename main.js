// fetch for Teleport stored in variable here
const callTeleport = async (city) => {
  let result = await (
    await fetch(`https://api.teleport.org/api/cities/?search=${city}`)
  ).json();
  console.log(result);
  return result;
};

//fetch for Police API stored in variable here

//form submit button behavior
const submitBtn = document.querySelector("#submit-button");
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let searchInput = document.querySelector("#city-input").value;

  callTeleport(searchInput);
  //callPolice here
});
