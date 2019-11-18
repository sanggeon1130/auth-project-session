var express = require('express');
var app = express();
var template = require('./lib/template.js');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var fs = require('fs');

app.use(session({
    secret:'abcdefg',
    resave:false,
    saveUninitialized:true,
    store: new FileStore
}))


function isUser(request, response){
    if(request.session.is_logined){
        return true;
    }
    else{
        return false;
    }
}

function authStatusUI(request, response){
    var authStatusUI = '<a href = "/login">login</a>'
    if(isUser(request, response)){
        authStatusUI = `${request.session.nickname} | <a href = "/logout">logout</a>`
    }
    return authStatusUI;

}

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(request, response){
    var title = "Welcome";
    var _template = template.html(title,'','Welcome to our page.In this page you can experience the very basic form of an authentication.Hope you enjoy.......'
    ,'',authStatusUI(request, response))
    response.send(_template);
})

app.get('/login', function(request, response){
 var title = "login";
 var _template = template.html(title,'',`
    <form action = "/login" method = "post">
    <p><input type = "text" name = "email" placeholder = "type your email!"</p>
    <p><input type = "password" name = "password" placeholder = "type your password!"</p>
    <input type = "submit" value = "login">
    </form>

 `,'',authStatusUI(request, response));
 response.send(_template);
})

app.post('/login', function(request, response){
    var post = request.body;
    var password = post.password;
    var email = post.email;
    fs.readFile(`auth/${email}`, 'utf-8', function(err, realpassword){
        if(password === realpassword){
            request.session.is_logined = true;
            request.session.nickname = email;
            request.session.save(function(){
                response.redirect('/');
            })
            
        }
        else{
            response.send('sorry... something is wrong.....');
        }
    })
})

app.get('/logout', function(request, response){
    request.session.destroy(function(){
        response.redirect('/');
    })
})


app.listen(5000, function(){
    console.log('port 5000!')
})