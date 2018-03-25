//We're using the express framework and the mailgun-js wrapper
var express = require('express');
var Mailgun = require('mailgun-js');
//init express
var app = express();


//Your api key, from Mailgun’s Control Panel
var api_key = 'MAILGUN-API-KEY';

//Your domain, from the Mailgun Control Panel
var domain = 'YOUR-DOMAIN.com';

//Your sending email address
var from_who = 'your@email.com';

// Send a message to the specified email address when you navigate to /submit/someaddr@email.com
// The index redirects here
app.get('/submit/:mail', function(req,res) {

    //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var data = {
        //Specify email data
        from: from_who,
        //The email to contact
        to: req.params.mail,
        //Subject and text data
        subject: 'Hello from Mailgun',
        html: 'Hello, This is not a plain-text email, I wanted to test some spicy Mailgun sauce in NodeJS! <a href="http://0.0.0.0:3030/validate?' + req.params.mail + '">Click here to add your email address to a mailing list</a>'
    }

    //Invokes the method to send emails given the above data with the helper library
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
            res.render('error', { error : err});
            console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else {
            //Here "submitted.jade" is the view file for this landing page
            //We pass the variable "email" from the url parameter in an object rendered by Jade
            res.render('submitted', { email : req.params.mail });
            console.log(body);
        }
    });

});

app.get('/validate/:mail', function(req,res) {
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var members = [
        {
            address: req.params.mail
        }
    ];
//For the sake of this tutorial you need to create a mailing list on Mailgun.com/cp/lists and put its address below
    mailgun.lists('NAME@MAILINGLIST.COM').members().add({ members: members, subscribed: true }, function (err, body) {
        console.log(body);
        if (err) {
            res.send("Error - check console");
        }
        else {
            res.send("Added to mailing list");
        }
    });

})


app.listen(3030);