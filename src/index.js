'use strict';

const words = {
  greekLetters: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Phi', 'Chi', 'Psi', 'Omega'],
  numbersWords: ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'],
  numbersDigits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  phoneticAlphabet: ['Bravo', 'Charlie', 'Echo', 'Kilo', 'Sierra', 'Tango', 'Victor'],
  colors: ['Red', 'Green', 'Blue', 'White', 'Black', 'Yellow', 'Orange'],
}

const names = {
  'TNG': ['Picard', 'Riker', 'Troi', 'Crusher', 'La Forge', 'Yar', 'Data']
}

const randFromArray = function(array) {
  return array[Math.floor(Math.random() * array.length)];
}

const randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const shuffleArray = function(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

const pickFromArray = function (array, min, max) {
  var n;
  let picks = [];

  if (typeof max === 'undefined') {
    n = min;
  } else {
    n = min + Math.round(Math.random() * (max - min));
  }

  for (var i = 0; i < n; i++) {
    picks.push(randFromArray(array));
  }

  return picks;
}

const createCode = function(options) {

  let defaults = {
    count: 1,
    min: 2,
    max: 10,
    uriSafe: false,
    separator: '-',
    excludeName: false,
    numberWords: true
  };

  options = Object.assign({}, defaults, options);

  if (!options.length) {
    options.length = randomInt(defaults.min, defaults.max);
  }

  if (!options.excludeName) {
    if (!options.name) {
      let namesArray = Object.values(names).reduce(function(a, b) {
        return a.concat(b);
      }, []);
      options.name = randFromArray(namesArray);
    }

    if (options.uriSafe) {
      options.name = options.name.replace(/(\s|\')+/g, '-');
    }
  } else {
  	delete options.name;
  }

  let numbersArray = words.numbersDigits;

  if (options.numberWords) {
    numbersArray = words.numbersWords;
  }

  let code = [];

  const baseCategories = [{
    'name': 'numbers',
    'array': numbersArray,
    'min': 1,
    'max': 1
  }, {
    'name': 'greek',
    'array': words.greekLetters,
    'min': Math.ceil(25 * options.length / 100),
    'max': Math.ceil(40 * options.length / 100)
  }, {
    'name': 'colors',
    'array': words.colors,
    'min': 0,
    'max': 1
  }];

  let remainder = options.length;

  baseCategories.forEach(function(cat) {

    console.log('Pick loop')
    let picks;
    if (remainder >= cat.max) {
      picks = pickFromArray(cat.array, cat.min, cat.max);
      code = code.concat(picks);
      remainder = remainder - picks.length;
    }
  });

  console.log('Code after base')
  console.log(code);

  if (remainder > 0) {
    console.log('Remainder above zero')
    console.log(remainder);
    let phoneticPicks = pickFromArray(words.phoneticAlphabet, 0, Math.min(remainder, 3));
    console.log(phoneticPicks);
    console.log(phoneticPicks.length);
    remainder = remainder - phoneticPicks.length;
    let remainderPicks = pickFromArray(numbersArray, remainder, remainder);
    code = code.concat(phoneticPicks, remainderPicks)
  }

  console.log('Final code')
  code = shuffleArray(code);

  code = options.name ? options.name + '-' + code.join(options.separator) : code.join(options.separator);

  return code;
};

// module.js
export default function(options) {
  return createCode(options);
}
