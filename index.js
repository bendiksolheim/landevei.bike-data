const togeojson = require('@mapbox/togeojson');
const simplify = require('simplify-geojson');
const path = require('path');
const fs = require('fs');
const { DOMParser } = require('xmldom');

const gpxDir = path.resolve(__dirname, 'gpx');
const geojsonDir = path.resolve(__dirname, 'docs');
const routesFile = path.resolve(__dirname, 'docs', 'routes.json');

const replace = (pattern, replacement) => file =>
  file.replace(pattern, replacement);

const unwantedFiles = f => !f.startsWith('.');

const gpxFiles = fs
  .readdirSync(gpxDir)
  .filter(unwantedFiles)
  .map(replace('.gpx', ''));
const geojsonFiles = fs
  .readdirSync(geojsonDir)
  .filter(unwantedFiles)
  .map(replace('.json', ''));

const newFiles = gpxFiles.filter(a => !geojsonFiles.includes(a));

if (newFiles.length === 0) {
  console.log('No new files');
  process.exit(0);
}

function generateName(file) {
  return file[0].toUpperCase() + file.slice(1).replace(/-/g, ' ');
}

const routes = JSON.parse(fs.readFileSync(routesFile));

function convert(file) {
  console.log(`Converting '${file}.gpx'`);
  const input = path.resolve(__dirname, 'gpx', `${file}.gpx`);
  const output = path.resolve(__dirname, 'docs', `${file}.json`);
  const gpx = new DOMParser().parseFromString(fs.readFileSync(input, 'utf8'));
  const geojson = togeojson.gpx(gpx);
  const simplified = simplify(geojson, 0.001);
  const name = generateName(file);
  fs.writeFileSync(output, JSON.stringify(simplified, null, 2));
  routes.routes.push({ name: name, link: `${file}.json` });
  console.log(`Done converting '${file}.gpx'`);
}

newFiles.forEach(convert);

fs.writeFileSync(routesFile, JSON.stringify(routes, null, 2));
