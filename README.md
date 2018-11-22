# landevei.bike-data

Data repository for landevei.bike

# New routes

Export GPX file from «somewhere» (Strava, perhaps?), place it in the `gpx` folder, and run `node
index.js`. Converted file will be placed in `docs` folder, and a new entry will be added in the
`routes.json` file. Edit the `routes.json` file to manually add `distance` and `elevation`
