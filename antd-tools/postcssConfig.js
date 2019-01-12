const rucksack = require('rucksack-css');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    rucksack(),
    autoprefixer({
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 9', 'iOS >= 8', 'Android >= 4'],
    }),
  ],
};
