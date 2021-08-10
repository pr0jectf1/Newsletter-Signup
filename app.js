const express = require("express");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.urlencoded());

//allows us to serve static files
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;
    
    //data object containg subscribers first name, last name & email.
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
            
        ]
    };

    //converts the data object into a JSON string
    var jsonData = JSON.stringify(data);

    const url = "https://us5.api.mailchimp.com/3.0/lists/0b28af3739";

    const options =  {
        method: "POST",
        auth: "luis:0f2c784540e8b60db78bd454ac69b4b5-us5"
    }

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

//dynapic port for heroku to define or locally on port 3000
app.listen(process.env.PORT || 3000, function(){
    console.log("Serving listening on port 3000");
});

//api key
//0f2c784540e8b60db78bd454ac69b4b5-us5

//list id
//0b28af3739