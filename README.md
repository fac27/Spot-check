# Spot-check
Neighbourhood safety search engine app

## The purpose of this project
Spot-check is the outcome of a project from Founders and Coders. The project calls for a page that allows the user to interact with data from two separate APIs. We've selected [Teleport API](https://developers.teleport.org/) and [Police Data API](http://data.police.uk/docs/) for this.

## User journey
Spot Check is designed to help users review any area within the UK before visitting or moving there.
The usage of the page is simple:
- Enter the city you wish to review
- Select the correct match from the search results
- View data on cost-of-living, quality-of-living and crime rates in the area

## Planning
### Wireframe

![alt wireframe](/imgs/wireframe__1.svg)

## Collaborating
You can clone this repository with the following command:
```terminal
git clone https://github.com/fac27/Spot-check
```
The page can also be viewed directly from your browser in this link: https://fac27.github.io/Spot-check/

## Debugging
**Logging elements to the console** can help spot the changes that happen in our code base as it runs and identify a bug.
- ```console.log()``` will print out any value passed to it
- ```console.error()``` will print the value passed to it but styled so as to be more noticeable
- ```console.time()``` and ```console.timeEnd()``` will print out the time elapsed while the code between the two timers ran
- ```console.dir()``` will print an interactive list of the object passed to it

**Introducing Breaks through the development tools** allows us to see a timestamped version of the code as it runs.
This can greatly simplify the task of understanding where along the code base an error has occurred.
i.e.: we can see the value attributed to a variable at the time of the breaker.

## Learning Outcomes

### JavaScript
- [x] Write code that executes asynchronously
- [ ] Use callbacks to access values that aren't available synchronously
- [x] Use promises to access values that aren't available synchronously
- [x] Use fetch method to make HTTP requests and receive responses
- [ ] Configure the options argument of the fetch method to make GET and POST requests
- [ ] Use the map array method to create a new array containing new values
- [x] Use the filter method to create a new array with certain values removed

### DOM
- [x] Access DOM nodes using a variety of selectors
- [x] Add and remove DOM nodes to change the content on the page
- [ ] Toggle the classes applied to DOM nodes to change their CSS properties

### Design
- [ ] Use consistent layout and spacing
- [ ] Follow a spacing guideline to give our app a consistent feel

### Developer Toolkit
- [x] Debug client side JS in our web browser
- [x] Use console.log() to help us debug our code
