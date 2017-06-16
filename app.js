var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyparser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');

var Student = require("./models/student");

var connection = mysql.createConnection({
	host: 'localhost',
	socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
	user: 'root',
	password: 'root',
	database: 'node_db'
});

//Mysql Connection
connection.connect(function(err){
	if(err){
		throw err;
	}
	console.log("Connected to mysql DB...");
})

//MongoDB Connection
mongoose.connect("mongodb://localhost:27017/studentDB");

app.set('views',path.join(__dirname, 'views'));
app.set('view engine','jade');
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyparser.urlencoded({extended: false}));

/************************************************
					My-SQL
*************************************************/

//Home Page 
app.get('/mysql',function(req,res){
	connection.query('select * from student',function(err,rows,fields){
		if(err){
			console.log("Error reterving data from database!")
		}
		res.render('mysql',{items: rows});
	});
});

app.post('/addMarks',function(req,res){
	var data = {
		name : req.body.name,
		age	 : req.body.age
	}
	connection.query('INSERT INTO student SET ?', data, function(error, results, fields){
		if (error){
			console.log(error);
		}
		res.redirect('/mysql')
	});
});

app.get('/deletestudent/:id', function(req,res){
	var tid = req.params.id;

	connection.query('DELETE FROM student WHERE id = ?',[tid],function(err,rows){
		if (err){
			console.log(err);
		}
		res.redirect('/mysql');
	});
});

/************************************************
					Mongo DB
*************************************************/

//Home Page 
app.get('/mongo',function(req,res){
	Student.getAllStudents(function(err,students){
		if (err){
			console.log(err);
		}

		res.render('mongo',{items: students});
	});
});

app.post('/addBook',function(req,res){
	var newStudent = new Student({
		name : req.body.name,
		age : req.body.age
	});

	Student.addNewStudent(newStudent,function (err,student) {
		if (err){
			console.log(err);
		}

		res.redirect('/mongo');
	});
});

app.get('/removeStudent/:id/:name', function(req,res){

	console.log("Student of ID "+req.params.id+" and name of "+req.params.name+" going to remove.....")

	Student.deleteStudent(req.params.id,function(err,student){
		if (err){
			console.log(err);
		}

		res.redirect('/mongo');
	});
});

app.get('/updateBook/:id/:name', function(req,res){
	Student.updateStudent(req.params.id,req.params.name,"21",function(err,student){
		if (err){
			console.log(err);
		}

		res.redirect('/mongo');
	});
});

app.listen(8989);
console.log("App is listing on port 8989");