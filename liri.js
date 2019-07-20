require("dotenv").config();

let fs = require('fs');

let keys = require("./keys.js");
let Spotify = require('node-spotify-api')
let spotify = new Spotify(keys.spotify);

let axios = require('axios');
let moment = require('moment')

let operation = process.argv[2];
let search = '';
for (let i = 3; i < process.argv.length; i++) {
    const element = process.argv[i];
    search += element + ' ';
}
search = search.trim();

function selectOperation (operation) {
    switch (operation.toLowerCase()) {
        case 'concert-this':
        case 'concert':
            console.log('One moment while I find concerts for ' + search);
            axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp").then(response => {
            let data = response.data;
            console.log('I found ' + data.length + ' upcoming concerts for ' + search)
            data.forEach(element => {
                console.log('============================================================');
                console.log('Where: ' + element.venue.name + ' \n' + element.venue.city + ', ' + element.venue.region + ', ' + element.venue.country)
                console.log(moment(element.datetime).format('MMMM Do, YYYY h:mm A'));
                console.log('============================================================\n');
            });
            }).catch(error => {
                console.log(error);
            });
            break;
        case 'spotify-this-song':
        case 'spotify':
                console.log('One moment while I search for ' + search)
                spotify.search({type: 'track', query: search, limit: 1}, function(err, data) {
                    if (err) {
                      return console.log(err);
                    }
                    console.log('Here is what I found for ' + search);
                    console.log('==================== \nSong: ' + data.tracks.items[0].name)
                    let album = data.tracks.items[0].album
                    console.log('Artists:')
                    album.artists.forEach(element => {
                        console.log('- ' + element.name);
                    });
                    console.log('Album: ' + album.name);
                    if (data.tracks.items[0].preview) {
                        console.log('Preview: ' + data.tracks.items[0].preview)
                    } else {
                        console.log('No preview available')
                    }
                    console.log('====================')
                });
                        break;
        case 'movie-this':
        case 'movie':
            if (!search) {
                search = 'mr nobody'
            }
            console.log('One moment while I look for ' + search);
            axios.get('http://www.omdbapi.com/?apikey=trilogy&t=' + search).then(response => {
            console.log('Here is what I found for ' + search)
            let data = response.data
            console.log('==================== \nTitle: ' + data.Title);
            console.log('Year: ' + data.Year);
            console.log('Country: ' + data.Country);
            console.log('Language: ' + data.Language);
            console.log('Actors: ' + data.Actors);
            console.log('Plot: ' + data.Plot);
            console.log('Ratings:');
            data.Ratings.forEach(element => {
                console.log(element.Source + ': ' + element.Value);
            });
            console.log('====================');
            });
            break;
        case 'do-what-it-says':
            fs.readFile('./random.txt', 'utf8', (err, data) => {
                if (err){
                    console.log(err);
                }
                let command = data.split(',');
                search = command[1];
                selectOperation(command[0]);
            })
            break;
        default:
            console.log('That is not a valid command. Please use "spotify-this-song," "spotify," "movie-this," "movie," "concert-this," or "concert." Use "do-what-it-says" for an unknown search')
    }
}

selectOperation(operation);