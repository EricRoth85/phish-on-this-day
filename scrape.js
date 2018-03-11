let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');
let axios = require('axios');
let _ = require('underscore');
let fetchUrl = require('fetch').fetchUrl;


async function getTours(url) {

  let showArr = [];
  // console.log('STEP 1: getting HTML')
  let html = await axios.get(url)
  let $ = cheerio.load(html.data)

  // console.log('STEP 2: parsing HTML')
  $('a').each(function (i, element) {
    let show = $(element).attr('href');
    showArr.push(show)
  })
  // console.log('STEP 3: filtering all links')
  let filteredArr = showArr.filter(address => typeof address === 'string').filter(address => address.startsWith('/tour'))
  // console.log('filteredArr', filteredArr)
  return filteredArr;
}

getTours('https://phish.net/tour/')
  .then(function (storage) {
    getTodaysShows(storage)
  }).then(function (result) {
    console.log('result', result)
  })
  .catch(err => console.error(err))

// scrapeAllShows('https://phish.net');

let todaysShows = [];

async function getTodaysShows(storageArr) {
  // let wstream = await fs.createWriteStream('shows.txt')
  // console.log('STEP 4 + 5: looping and open write string stream')
  let dates = [];


  for (let i = 0; i < storageArr.length; i++) {
    let url = ('https://phish.net').concat(storageArr[i])
    //console.log("url", url)
    //waits to get all the shows
    let shows = await getShows(url);

    if (i === storageArr.length-1) {
      console.log("shows", shows)
      todaysShows = shows
      let htmlStr = ''
      if(shows.length === 0) {
        htmlStr = "No shows on this date";
      } else {
        for(let j = 0; j < shows.length; j++) {
          if(j !== 0) {
            htmlStr = '\n' + shows[j]
          } else {
            htmlStr = shows[j]
          }
        }
      }
      //THIS IS WHERE I NEED TO PASS THE RESULT - htmlStr to popup.js
      //HOW DO I EXPORT???
      //HOW DO I AT THAT TIME TO GET POPUP.JS TO UPDATE THE POPUP.HTML
      //SOMEHOW GET A LOADING INDICATOR IN THE SCREEN WHILE IT LOADS

      // document.getElementById('placeHere').append(htmlStr)

    }
  }
  //console.log("todays shows", todaysShows)

}


//   let requestAsync = function (url) {
//     return new Promise((resolve, reject) => {
//       let req = request(url, (err, response, body) => {
//         if (err) return reject(err, response, body);
//         //resolve(cheerio.load(body))
//         let loadedBody = cheerio.load(body)
//         loadedBody('a').each(function (i, element) {
//           //grabs the text of the eleme nt, which in this case is the show venue name and stores it in a variable
//           let show = loadedBody(element).text();
//           show = show.trim()
//           if (show.charAt(4) === '-' && show.charAt(7) === '-') { //1984-10-23
//             // shows.push(show)
//             console.log('URL', url)
//             console.log('SHOW', show)
//           }
//         });
//       });
//     });
//   };

//   /* Works as of Node 7.6 */
//   let getParallel = async function () {
//     //transform requests into Promises, await all
//     let updatedArr = [];
//     for (let i = 0; i < storageArr.length; i++) {

//       //gives us string with all show information
//       // console.log('STEP 6: calling getShows and concatonating the url')
//       let url = ('https://phish.net').concat(storageArr[i])
//       updatedArr.push(url);
//     }

//     try {
//       let data = await Promise.all(updatedArr.map(requestAsync));
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   getParallel();
// }


//   _.each(storageArr, function(url){
//     Promise.resolve(url).then(function() {
//       console.log('url', url)
//       return getShows(url)
//     }).then(function(shows){
//       console.log('SHOWS', shows)
//     }).catch(err => console.error(err))
//   })
// }

//   storageArr.forEach(function(url) {

//     let getShowPromise = new Promise((result, err) => {
//       //return getShows(url)

//       if (err) {
//         console.log("errro", err)
//       }
//     })
//     promises.push(getShowPromise)
//   })
//   Promise.all(promises).then(values => {
//     console.log('values', values)
//   }).catch(err => console.error(err))
// }




// Promise.all(promises).then(function(values) {
//   for (let i = 0; i < values.length; i++) {
//     // console.log("VALUES", values[i])
//     for(let j = 0; j < values[i].length; j++) {
//       //console.log(values[i][j])
//       if(values[i][j].includes(date)) {
//         // console.log('TODAYS SHOW', values[i][j])
//         // dates.push(values)
//         //should this be an array to hold multiple dates?
//       } else {
//         // console.log('NOT TODAYS SHOW', values[i][j])
//       }
//     }
//   }
// })

// console.log('STEP 9: writing to file.txt')
// wstream.write(dates)
// }
// console.log('DATES', dates)

// console.log('STEP 10: closed write stream box')
// wstream.end();


async function getShows(url) {

  let findTours = await axios.get(url)

  let body = findTours.data

  let $ = cheerio.load(body);

  let showArr = [];

  $('a').each(function(i, element){
    let show = $(element).text()
    show = show.trim()
    if(show.charAt(4) === '-' && show.charAt(7) === '-') {
      // console.log("show", show)
      showArr.push(show)
    }
  })

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
  let date = `-${months[n[1]]}-${n[2]}`;

  // let today = '03-04'

  //  console.log('STEP 8: finding the date')
  for (let i = 0; i < showArr.length; i++) {

    if ((showArr[i].includes(date)) && (!todaysShows.includes(showArr[i]))) {
      console.log('TODAYS SHOW', showArr[i])

      todaysShows.push(showArr[i])
      //should this be an array to hold multiple dates?
    }

    // else {
    //   console.log("No Shows on This Day in History")
    // }
  }
  if (todaysShows.length >= 1) {
    // console.log(todaysShows)
  }
  //NEED TO WRITE A FILTER FUNCTION TO GET RID OF DOUBLES*******
  //WHERE ARE THE DOUBLES COMING FROM IE NESTED LOOP
  //JSON FILE BECOMES OBJECT ON IMPORT

  // fs.writeFile('shows.txt', showArr.join('\n'));
  return todaysShows
}

  // function getDataFromURL(url) {

  //   return axios.get(url)
  // }

  // //makes a request to given URL, then performs callback function
  // //response gives a lot of info, socet info, headers, etc. Body is the HTML body of the page
  // // console.log('STEP 7: request to urls beginning with /tours')
  // // let findTours = await axios.get(url)

  // getDataFromURL(url)
  //   .then(function (result) {
  //     let body = result.data;
  //     //'$' takes on same function as the jQuery '$', and cheerio.load(body) tells the program that when we use '$' we want it to be searching through the body
  //     return cheerio.load(body)


  //   })
  //   .then(function (loadedBody) {
  //     let shows = [];
  //     //selects all elements with tag 'a' under a parent class 'browseInfo' and performs the callback function on each one
  //     loadedBody('a').each(function (i, element) {
  //       //grabs the text of the eleme nt, which in this case is the show venue name and stores it in a variable
  //       let show = loadedBody(element).text();
  //       show = show.trim()
  //       if (show.charAt(4) === '-' && show.charAt(7) === '-') { //1984-10-23
  //         shows.push(show)
  //         // console.log('URL', url)
  //         // console.log('SHOW', show)
  //       }
  //     });
  //     //console.log("SHOWS", shows)
  //     Promise.resolve(shows)
  //     return shows;

  //   })
  //   .catch(err => { return err })

  // console.log('SHOWARR', showArr)


function filterTodaysShows() {
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
  let date = `-${months[n[1]]}-${n[2]}`;

  // let today = '03-04'

  //  console.log('STEP 8: finding the date')
  for (let i = 0; i < showArr.length; i++) {

    if (showArr[i].includes(date)) {
      console.log('TODAYS SHOW', showArr[i])
      todaysShows.push(showArr[i])
      //should this be an array to hold multiple dates?
    }

    // else {
    //   console.log("No Shows on This Day in History")
    // }
  }
  if (todaysShows.length >= 1) {
    // console.log(todaysShows)
  }

  //NEED TO WRITE A FILTER FUNCTION TO GET RID OF DOUBLES*******
  //WHERE ARE THE DOUBLES COMING FROM IE NESTED LOOP
  //JSON FILE BECOMES OBJECT ON IMPORT

  // fs.writeFile('shows.txt', showArr.join('\n'));
}


module.exports = todaysShows
//
