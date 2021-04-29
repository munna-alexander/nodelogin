var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var username;
var udata;
var uudata;

var connection = mysql.createConnection({
	host     : 'dtsmartaccess-sqlserver.database.windows.net',
	user     : 'sqladmin',
	//port      : '1433',
	password : '3p@hPWSGxStXvn4R!',
	database : 'DTSmartAccess-DB'
});
//images
var publicDir = require('path').join(__dirname,'/public');



var app = express();

app.use(express.static(publicDir))//images
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/loginorg.html'));
});

app.get('/home', function (request, response) {
	response.sendFile(path.join(__dirname + '/home1.html'));
});

app.get('/checklist', function (request, response) {
	response.sendFile(path.join(__dirname + '/checklist.html'));
});

app.get('/machines', function (request, response) {
	response.sendFile(path.join(__dirname + '/machines.html'));
});

app.get('/reports', function (request, response) {
	response.sendFile(path.join(__dirname + '/reports.html'));
});

app.get('/alerts', function (request, response) {
	response.sendFile(path.join(__dirname + '/alerts.html'));
});

// app.get('/sessions', function (request, response) {
// 	response.sendFile(path.join(__dirname + '/sessions.html'));
// });

// app.get('/users', function (request, response) {
// 	response.sendFile(path.join(__dirname + '/users.html'));
// });

app.get('/PreuseChecklist', function (request, response) {
	response.sendFile(path.join(__dirname + '/public/checkbox.html'));
});

app.get('/MaintenanceElec', function(request, response) {
	response.sendFile(path.join(__dirname + '/public/User/Melec.html'));
});

app.get('/MaintenanceMech', function (request, response) {
	response.sendFile(path.join(__dirname + '/public/User/MaintenanceMech.html'));
});


app.get('/authorised', function (request, response) {
	response.sendFile(path.join(__dirname + '/public/authorised.html'));
});

// app.get('/logout', function(req, res){
	
// 	connection.query('update accounts set Session="0" WHERE UserRole = ?',[username], function (error, results, fields) {
//  });
 
//  req.session.loggedin = false;
//  res.redirect('/');
//   });
  

app.post('/auth', function(request, response) {
    username = request.body.username;
	var password = request.body.password;
	// console.log(request)
	

	var role

	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE UserRole = ? AND UserPassword = ?', [username, password], function (error, results, fields) {
			console.log(results[0].UserId);

			connection.query('UPDATE accounts set Session ="1" where UserRole = ? AND UserPassword = ? ', [username, password], function (err, rts, fs) {
			});			

			if (results.length > 0) {
				role = results[0].UserRole;
				if (role == 'loader') {
					//if (role == 'loader') {
					request.session.loggedin = true;
					request.session.username = username;
					response.redirect('/PreuseChecklist');
				}
				else if (role == 'admin') {
					//if (role == 'loader') {
					request.session.loggedin = true;
					request.session.username = username;
					response.redirect('/home');
				}
				else if (role == 'mechanic') {
					//if (role == 'loader') {
					request.session.loggedin = true;
					request.session.username = username;
					response.redirect('/MaintenanceMech');
				}
				else if (role == 'electrician') {
					//if (role == 'loader') {
					request.session.loggedin = true;
					request.session.username = username;
					response.redirect('/MaintenanceElec');
				}

			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/checkbox', function(request, response) {
	var username = request.body.check;
	console.log(username)
	response.redirect('/authorised');

});

app.get('/checkboxfile', function (request, response) {
	response.sendFile(path.join(__dirname + '/public/user/checkbox.html'));
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		console.log('Welcome back, ' + request.session.username + '!');
		
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});
//var express = require('express');
var router = express.Router();
var name = 'hello';
//var db=require('../database');
// another routes also appear here
// this script to fetch data from MySQL databse table
// app.get('/sessions', function(req, res, next) {
//     var sql='SELECT * FROM accounts where Session="1"';
//     connection.query(sql, function (err, data, fields) {
//     if (err) throw err;
// 	res.sendFile(path.join(__dirname + '/sessions.html',{title: 'User List', userData: data}))
//     res.render('sessions', { title: 'User List', userData: data});
//   });
// });
// module.exports = router;

app.get('/sessions', function(req, res) {

	connection.query('SELECT * FROM accounts WHERE Session="1"', [username], function (error, results, fields) {

		console.log(results)
		udata=results

 });
		
	res.render(__dirname + "/sessions.html", {udata:udata});
  
  });

  app.get('/users', function(req, res) {

	

	connection.query('SELECT * FROM accounts', function (error, results, fields) {

		console.log(results[0].UserId)
		uudata=results
		console.log(uudata);

 });
		
	res.render(__dirname + "/users.html", {uudata:uudata});
  
  });

app.listen(8080);