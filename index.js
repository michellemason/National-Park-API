'use strict';

const apiKey = 'HxcBfaI7az3nTKbfSq5VY4zRbiJyw77UDw9sTnuX';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

  function getParks(query, limit=10) {
    const params = {
      api_key: apiKey,
      stateCode: query,
      limit,
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;
  
    console.log(url);
  
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayResults(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
  }

  function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const searchTerm = $('#js-search-term').val();
      const maxResults = $('#js-max-results').val();
      getParks(searchTerm, maxResults);
    });
  }
  
  $(watchForm);
  




  function displayResults(responseJson) {
    // if there are previous results, remove them
    $('#results-list').empty();

    if (responseJson.data.length == 0) {
        alert('Sorry, no parks with that state abbreviation found.');
    }
    // iterate through the items array
    for (let i = 0; i < responseJson.data.length; i++){
      // for each park object in the items 
      //array, add a list item to the results 
      //list with the park full name, descriptionbrack,
      //and website URL, address 

      // get the physical address
      const addressesObj = responseJson.data[i].addresses;
      var physicalAddress = {};
      for (let j = 0; j < addressesObj.length; j++) {
        if (addressesObj[j].type == "Physical"){
            physicalAddress = addressesObj[j];
        }
      }

      //  put the parts of the address I want into a string array
      var addressArray = [];
      addressArray.push(physicalAddress.line1);
      addressArray.push(physicalAddress.line2);
      addressArray.push(physicalAddress.line3);
      addressArray.push(physicalAddress.city);
      addressArray.push(physicalAddress.stateCode);
      addressArray.push(physicalAddress.postalCode);

      // then format a string based on the array
      var addressString = "";
      for (let j = 0; j < addressArray.length; j++) {
          if (addressArray[j] != "") {
            addressString += addressArray[j];
            if (j != addressArray.length - 1) {
                addressString += ", ";
            }
          }
      }

      $('#results-list').append(
        `<li><h3>${responseJson.data[i].fullName}</h3>
        <p>${addressString}</p>
        <p>${responseJson.data[i].description}</p>
        <a href='${responseJson.data[i].url}'>${responseJson.data[i].url}</a>
        </li>`
      )};
    //display the results section  
    $('#results').removeClass('hidden');
  }; 