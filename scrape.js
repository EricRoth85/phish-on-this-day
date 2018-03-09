let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs')
let axios = require('axios');


async function scrapeAllShows(url) {

  let showArr = [];
  // console.log('STEP 1: getting HTML')
  let html = await axios.get(url)
  let $ = cheerio.load(html.data)

// console.log('STEP 2: parsing HTML')
  $('a').each(function(i, element) {
    let show = $(element).attr('href');
    showArr.push(show)
  })
// console.log('STEP 3: filtering all links')
  let filteredArr = showArr.filter(address => typeof address === 'string').filter(address => address.startsWith('/tour'))

  return filteredArr;
}

scrapeAllShows('https://phish.net/tour')
.then(function(storage){loopStorage(storage)})


async function loopStorage(storageArr) {
  let wstream = await fs.createWriteStream('shows.txt')
  // console.log('STEP 4 + 5: looping and open write string stream')
  for(let i = 0; i < storageArr.length; i++) {
    //gives us string with all show information
    // console.log('STEP 6: calling scrapeShows and concatonating the url')
    let url = ('https://phish.net').concat(storageArr[i])
    let dates = await scrapeShows(url)

    dates = dates + '\n'
  // console.log('STEP 9: writing to file.txt')
    wstream.write(dates)
  }

  // console.log('STEP 10: closed write stream box')
  wstream.end();
}

let todaysShows = [];

async function scrapeShows(url) {

  //makes a request to given URL, then performs callback function
  //response gives a lot of info, socet info, headers, etc. Body is the HTML body of the page
// console.log('STEP 7: request to urls beginning with /tours')
  let findTours = await axios.get(url)
  let body = findTours.data;
    //'$' takes on same function as the jQuery '$', and cheerio.load(body) tells the program that when we use '$' we want it to be searching through the body
    let $ = await cheerio.load(body)
    let showArr = [];
    //selects all elements with tage 'a' under a parent class 'browseInfo' and performs the callback function on each one
    await $('a').each(function(i, element) {

      //grabs the text of the eleme nt, which in this case is the show venue name and stores it in a variable
      let show = $(element).text();
      show = show.trim()
      if(show.charAt(4) === '-' && show.charAt(7) === '-') { //1984-10-23
        showArr.push(show)
      }

    });


// function matchDate() {

    let months = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12'
    }

    let d = new Date();
    let n = d.toDateString();
    n = n.split(' ')


    // let today = d.slice()
    let date = `${months[n[1]]}-${n[2]}`;

    let today = '03-04'

  //  console.log('STEP 8: finding the date')
    for (let i = 0; i < showArr.length; i++) {

      if(showArr[i].includes(date)) {
        console.log('TODAYS SHOW', showArr[i])
        todaysShows = showArr[i]
        //should this be an array to hold multiple dates?
      }

      // else {
      //   console.log("No Shows on This Day in History")
      // }
    }
    if(todaysShows.length >= 1){
      // console.log(todaysShows)
    }

//NEED TO WRITE A FILTER FUNCTION TO GET RID OF DOUBLES*******
//WHERE ARE THE DOUBLES COMING FROM IE NESTED LOOP
//JSON FILE BECOMES OBJECT ON IMPORT

    // fs.writeFile('shows.txt', showArr.join('\n'));
    return todaysShows.join('\n')

  // }
}

// scrapeShows('https://phish.net/tour/7-1989-tour.html');

module.exports = todaysShows
