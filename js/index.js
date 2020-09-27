
const app = require('express')()
var express = require("express");
var request = require('request')
var fs = require('fs');
var async = require('async');
var fetch = require("node-fetch");
var util = require("util")
var path = require("path")
var ejs = require("ejs")

const frontmatter = require('frontmatter');
const marked = require('marked');

const Bearer = require('@bearer/node-agent')
Bearer.init({ secretKey: 'sk_production_XlAJqg_Jp0FdO0R9kZWp5B0LzwECnrfm' })

app.use(express.static(path.join(__dirname, '../')));
app.set('views', path.join(__dirname, '../'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine','ejs');


app.get('/', (req, res) => {

	const jsonFile = path.join(__dirname, '../resources/now.json')

	var raw = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

	res.render('views/index.ejs', {data: raw})
})

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}

function getFilesIn(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isFile();
  });
}


var getBlogFloderStructure = function(filePath, callback) {

	lista = {};
	current_year = -1;
	
	years = getDirectories(filePath)
	
	years.forEach(function(year) {
	
		months	= getDirectories(filePath + "/"  + year)

			lista[year] = {}
			
			months.forEach(function(month) {
				
				lista[year][month] = getFilesIn(filePath + "/" + year + "/" + month)
			})
	})		
	
	callback(lista)
}


app.get('/blog', (req, res) => {

	const testFolder = path.join(__dirname, '../_posts')
	
	getBlogFloderStructure(testFolder, function(stucture) {
	
		res.render('views/blog', {
		posts: stucture
		})
	})


});

app.get('/blog/*', (req, res) => {

	const testFolder = path.join(__dirname, '../_posts')
				
	var file = req.originalUrl.replace('/blog/', '')
	
	var fileUrl = testFolder + req.originalUrl.replace('/blog', '') + ".md"
		
	var raw = fs.readFileSync(fileUrl, 'utf8');
	
	const { data, content } = frontmatter(raw);
	
	data.date = data.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(" ")[0]
	
	var aux = frontmatter(raw);
	
	const markdown = ejs.render(content, data);
	const html = marked.parse(markdown);
	
	res.render('views/post', {data: data, content: html})
})

Date.prototype.getWeek = function () {
    var target  = new Date(this.valueOf());
    var dayNr   = (this.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    var firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() != 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
}

////////////////////////////

function daysIntoYear(date){
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

var toHHMMSS = (secs) => {
    var sec_num = parseInt(secs, 10)
    var hours   = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")
}

function filterRecordsBetween(records, startDate, endDate) {
		return records.filter(item => {
			let date = new Date(item.Date);
			return date >= startDate && date <= endDate;
		})
	}
	
var statistics = {
	'year': {'distance':0.0, 'duration': 0.0, 'calories': 0.0, 'vert': 0.0, 'avghr': 0.0, 'maxhr': 0.0, 'rhr': 0.0, 'vert': 0.0, 'vo2max':0.0},
	'month': {'distance':0.0, 'duration': 0.0, 'calories': 0.0, 'vert': 0.0, 'avghr': 0.0, 'maxhr': 0.0, 'rhr': 0.0, 'vert': 0.0, 'vo2max':0.0},
	'week': {'distance':0.0, 'duration': 0.0, 'calories': 0.0, 'vert': 0.0, 'avghr': 0.0, 'maxhr': 0.0, 'rhr': 0.0, 'vert': 0.0, 'vo2max':0.0}
};

// var Airtable = require('airtable');
// var base = new Airtable({apiKey: process.env.airtable_api_key}).base('appZ1mj1OPiwONMYU');

filteredRecs = []

var weekGraph = {}
var maxWeeklyDistance = -1.0

var Airtable = require('airtable');
var base = new Airtable({apiKey: "keyBiLKFwcjErb7if"}).base('appZ1mj1OPiwONMYU');

app.get('/runs', (req, res) => {

	var promises = [];
	
	/**
		Latest workouts
	*/
	promises.push(new Promise(function(resolve, reject) {

		var date = new Date(new Date().getFullYear(),0,1,1);
		var date = date.toISOString();
		
		base('Run').select({
 			maxRecords: 14,
			sort: [
        {field: 'Date', direction: 'desc'}
        ],
			fields: ['Date', 'distance', 'duration', 'calories', 'Type', 'avghr', 'maxhr', 'rhr', 'vert', 'vo2max']
			
			}).eachPage(function page(records, fetchNextPage) {

				fetchNextPage();

				records.forEach(function(rec) {
					rec.fields.duration = toHHMMSS(rec.fields.duration)
				})
			
				resolve(records)

		}, function done(err) {
			if (err) { console.error(err); return; }
		});

	}))

	/**
		Shoes
	*/
	promises.push(new Promise(function(resolve, reject) {

		base('Shoes').select({
			// Selecting the first 3 records in Monthly:
			maxRecords: 100,
						sort: [
        {field: 'Distance', direction: 'desc'}
        ],
			fields: ['Model', 'Distance', 'Start', 'Usage', 'End']
			}).eachPage(function page(records, fetchNextPage) {

				fetchNextPage();
			
				resolve(records)

		}, function done(err) {
			if (err) { console.error(err); return; }
		});

 	}))
 	
	/**
		Workout Types
	*/
	promises.push(new Promise(function(resolve, reject) {

		base('Workout Type').select({
			// Selecting the first 3 records in Monthly:
			maxRecords: 100,
			        sort: [{field: 'Distance', direction: 'desc'}],
			fields: ['Name', 'Pace', 'AvHR', 'MaxHR', 'Distance', 'AvgCal']
			

			}).eachPage(function page(records, fetchNextPage) {
			
				records.forEach(function(rec) {		
					
					if (typeof(rec.fields.Pace) === 'number') {
						rec.fields.Pace = new Date(1000 * rec.fields.Pace).toISOString().substr(14, 5)
					} else {
						rec.fields.Pace = "-:--"
					}
					
					if (typeof(rec.fields['AvHR']) !== 'number') {
						rec.fields['AvHR'] = "---"
					} else {
						rec.fields['AvHR'] = Math.floor(rec.fields['AvHR'])
					}
				})
			
				fetchNextPage();
			
				resolve(records)

		}, function done(err) {
			if (err) { console.error(err); return; }
		});

	}))
	
	promises.push(new Promise(function(resolve, reject) {	
	
			var date = new Date(new Date().getFullYear(),0,1,1);
	
		base('Run').select({
			maxRecords: 3000,
			sort: [
        {field: 'Date', direction: 'desc'}
        ],
			fields: ['Date', 'distance', 'duration', 'calories', 'Type', 'avghr', 'maxhr', 'rhr', 'vert', 'vo2max']
			}).eachPage(function page(records, fetchNextPage) {
			
				records.filter(function(obj) {

					filteredRecs.push(obj.fields)

					return obj.fields;
				});
				
				fetchNextPage();
			
		}, function done(err) {
		
			if (err) { console.error(err); return; }
			
			const maxWidth = 20;
			
			var startDate = new Date(new Date().getFullYear(),0,1,1);
			var thisYearsRecords = filterRecordsBetween(filteredRecs, startDate, new Date().getTime());

			thisYearsRecords.forEach(function(rec) {
			
				const currentWeekNumber = (new Date(rec.Date)).getWeek()
				
				if (currentWeekNumber in weekGraph) {

					weekGraph[currentWeekNumber]["distance"] += rec.distance
				} else {

					const toAdd = {"distance": rec.distance, "text":""}
					weekGraph[currentWeekNumber] = toAdd
				}
				
				if (maxWeeklyDistance < weekGraph[currentWeekNumber]["distance"]) {
					maxWeeklyDistance = weekGraph[currentWeekNumber]["distance"]
				}
			})
			

			// Add missing weeks
			for(i = 1; i < (new Date()).getWeek(); i++) {
				if (!(i in weekGraph)) {
					weekGraph[i] = {"distance": 0.0, "text":"░░░░░░░░░░░░░░░░░░░░"}
				}
			}
			
			Object.keys(weekGraph).forEach(function(key) {
			
				var goal_text = "";
			
				for(i = 0; i < maxWidth; i++) {
		
					if (((weekGraph[key].distance/maxWeeklyDistance) * maxWidth) > i) {
						goal_text += "▓"
					} else {
						goal_text += "░"
					}
				}	
				
				weekGraph[key].text = goal_text	
			})

			// ************************************************************************
			
			Object.keys(statistics).forEach(function(key) {
				
				var date = new Date(new Date().getFullYear(),0,1,1);
				var date = date.toISOString();		
				var firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1,2)

				var firstDayOfWeek = new Date();
				firstDayOfWeek.setDate(firstDayOfWeek.getDate() - (firstDayOfWeek.getDay() + 6) % 7);
				firstDayOfWeek.setHours(00,00,00);
				
				startDate = new Date().getTime()
				
				if (key === 'year') {
					var date = new Date(new Date().getFullYear(),0,1,1);
					startDate = date;
				} else if (key === 'month') {
					var date = new Date(new Date().getFullYear(),0,1,1);
					var date = date.toISOString();		
					var firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1,2)
					startDate = firstDayOfMonth
				} else if (key === 'week') {
					var firstDayOfWeek = new Date();
					firstDayOfWeek.setDate(firstDayOfWeek.getDate() - (firstDayOfWeek.getDay() + 6) % 7);
					firstDayOfWeek.setHours(00,00,00);
					startDate = firstDayOfWeek;
				}
				
				var thisYearsRecords = filterRecordsBetween(filteredRecs, startDate, new Date().getTime());

				Object.keys(statistics[key]).forEach(function(key2) {
					
					distance = thisYearsRecords.filter(function(obj) {
						return obj[key2]
					})
					.map(function(obj) {
						return obj[key2];
					});
					
					var yearSum = distance.reduce((a,b) => a+b,0);
					
					switch(key2) {
					case 'distance':
						statistics[key][key2] = yearSum
						break;
					case 'duration':
						statistics[key][key2] = toHHMMSS(yearSum)
						break;
					case 'vert':
						statistics[key][key2] = yearSum
						break;
					default:
					statistics[key][key2] = yearSum / distance.length;		
					}
				})
			})
			
			resolve(statistics)
		});

	}))

	// When both endpoints have finished their tasks start format the data for the new API &
	// calculate the statistics
	Promise.all(promises).then(data => {
	
		let shoes = data[1];
		
		var poy_text = "";
		var goal_text = "";
		
		const percentageOfYear = Math.floor(daysIntoYear(new Date()) / 365 * 100) 
		
		const maxWidth = 20;
		
		for(i = 0; i < maxWidth; i++) {
		
			if (((statistics['year'].distance/2020) * maxWidth) > i) {
				goal_text += "▓"
			} else {
				goal_text += "░"
			}
		}	
		
		for(i = 0; i < maxWidth; i++) {
				
			if (((percentageOfYear/100) * maxWidth) > i) {
				poy_text += "▓"
			} else {
				poy_text += "░"
			}
		}		
		
		const goal_percentage = Math.floor(statistics['year'].distance / 2020.0 * 100)
		
		var raw = {'runs': data[0], 'shoes': shoes, 'workout': data[2], 'statistics': statistics, 'poy': percentageOfYear, 'poy_text': poy_text, 'goal_percentage': goal_percentage, 'goal_distance_text': goal_text, "weekGraph": weekGraph}

		res.render('views/runs.ejs', {data: raw})
	})
})

module.exports = app

app.listen(3000)