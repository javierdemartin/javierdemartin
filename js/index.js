
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

app.use(express.static(path.join(__dirname, '../')));
app.set('views', path.join(__dirname, '../'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine','ejs');


app.get('/', (req, res) => {

	const testFolder = path.join(__dirname, '../resources/now.md')
						
	var raw = fs.readFileSync(testFolder, 'utf8');
	
	const { data, content } = frontmatter(raw);

	console.log(content)
		
	var aux = frontmatter(raw);
	
	const markdown = ejs.render(content, data);
	const html = marked.parse(markdown);
	
	res.render('views/index.ejs', { content: html })
})

app.get('/singlet', (req, res) => {

	// const jsonFile = path.join(__dirname, '../resources/now.json')

	// var raw = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

	// res.render('views/index.ejs', {data: raw})

	const testFolder = path.join(__dirname, '../resources/singlet.md')
						
	var raw = fs.readFileSync(testFolder, 'utf8');
	
	const { data, content } = frontmatter(raw);

	console.log(content)
		
	var aux = frontmatter(raw);
	
	const markdown = ejs.render(content, data);
	const html = marked.parse(markdown);
	
	res.render('views/singlet.ejs', { content: html })
})

app.get('/coffee', (req, res) => {

	// const jsonFile = path.join(__dirname, '../resources/now.json')

	// var raw = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

	// res.render('views/index.ejs', {data: raw})

	const testFolder = path.join(__dirname, '../resources/coffee.md')
						
	var raw = fs.readFileSync(testFolder, 'utf8');
	
	const { data, content } = frontmatter(raw);

	console.log(content)
		
	var aux = frontmatter(raw);
	
	const markdown = ejs.render(content, data);
	const html = marked.parse(markdown);
	
	res.render('views/index.ejs', { content: html })
})

app.get('/swift', (req, res) => {

	const testFolder = path.join(__dirname, '../resources/swift.md')
						
	var raw = fs.readFileSync(testFolder, 'utf8');
	
	const { data, content } = frontmatter(raw);

	console.log(content)
		
	var aux = frontmatter(raw);
	
	const markdown = ejs.render(content, data);
	const html = marked.parse(markdown);
	
	res.render('views/index.ejs', { content: html })
})

app.get('/running', (req, res) => {

	const testFolder = path.join(__dirname, '../resources/running.md')
						
	var raw = fs.readFileSync(testFolder, 'utf8');
	
	const { data, content } = frontmatter(raw);

	console.log(content)
		
	var aux = frontmatter(raw);
	
	const markdown = ejs.render(content, data);
	const html = marked.parse(markdown);
	
	res.render('views/index.ejs', { content: html })
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

module.exports = app

app.listen(3000)