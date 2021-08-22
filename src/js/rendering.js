
  
const debounce = require('lodash.debounce');

import error from './pnotify';
import countriesMarkup from '../partials/markup';

 const refs = {
countryContainer: document.querySelector('.container'),
input: document.querySelector('#input'),
inputMessage: document.querySelector('.input-message'),
inputList: document.querySelector('.input-list')
}

function fetchCountries(searchQuery) {    
    const url = `https://restcountries.eu/rest/v2/name/${searchQuery}`; 

    return fetch(url)
    .then(response => {
        if (response.ok) {
          return response.json();
        }
      })     
};

refs.input.addEventListener(
  'input',
  debounce(queryAnswer, 1200),
);

function queryAnswer(event) {
  let inputValue = event.target.value.trim();

  if (!inputValue) {
    error();
    return;
  }

  CountriesList(inputValue)
}

function addCountryInfo(country) {
  const markup = countriesMarkup(country);

  refs.countryContainer.insertAdjacentHTML('beforeend', markup);
}

function deleteContent() {
  refs.input.value = '';
  refs.input.innerHTML = '';
  refs.inputMessage.innerHTML = '';
  refs.inputList.innerHTML = '';
  refs.countryContainer.innerHTML = '';
}

function selectResponseInfo(quantytyOfCountries) {
  console.log(quantytyOfCountries);

  if (quantytyOfCountries.length < 2) {
    deleteContent();
    addCountryInfo(quantytyOfCountries);
  }

  if (quantytyOfCountries.length >= 2 && quantytyOfCountries.length <= 10) {
    deleteContent();
    quantytyOfCountries.forEach(country => {
      refs.inputList.insertAdjacentHTML('beforeend', `<li>${country.name}</li>`)
    });

    refs.inputList.addEventListener('click', e => {
      e.preventDefault();
      deleteContent();
      const getInputValue = refs.input.value = e.target.textContent;
      const country = quantytyOfCountries.find(country => {
        return country.name === getInputValue
      })
      addCountryInfo({ country });
    })
  }

  if (quantytyOfCountries.length > 10) {
    deleteContent();
    const message = 'Too many matches found, Please enter a more cpecific query!'
    refs.inputMessage.insertAdjacentHTML('beforeend', message);
    error({
      title: 'Error',
      text: message,
      delay: 1000,
    });
  }
}

function CountriesList(value) {
  fetchCountries(value)
    .then(countries => selectResponseInfo(countries))
    .catch(error => errorMessage(error));
}

function errorMessage(err) {
  deleteContent();
  const message = 'Error request. Try again!'
  refs.inputMessage.insertAdjacentHTML('beforeend', message);
}
