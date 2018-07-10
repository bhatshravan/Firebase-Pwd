const functions = require('firebase-functions');
var express = require('express');
var bcrypt = require('bcrypt');

const app = express();


// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();


exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/tests/messages').push({original: original}).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.redirect(303, snapshot.ref.toString());
  });
});


exports.bc = functions.https.onRequest((req,res) =>{
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(req.query.pwd, salt);
	

  return admin.database().ref('/tests/messages/te1').set({pwd: hash}).then((snapshot) => {
  	// return res.redirect(303, snapshot.ref.toString());

  	 var o = {} // empty Object
	var key = 'Password';
	o[key] = hash;
    res.send(JSON.stringify(o));
  });
	

});

exports.bcval = functions.https.onRequest((req,res) =>{
	return admin.database().ref('/tests/messages/te1').then(function(snapshot){
		var te1 = snapshot.val().pwd;
		var testi = bcrypt.compareSync(req.query.pwd, te1);
		res.send(testi);
	});
});
app.get('/bcval', function(req,res){
	var testi = bcrypt.compareSync(req.query.pwd, test);
	res.send(testi);

});


// Send to firebase : firebase deploy --only functions


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/*
In firebase.json

Now you can use the more friendly Firebase Hosting domain which is https://your-project-id.firebaseapp.com/api or simply https://yourcustomdomain.com/api if you have setup a custom domain.

"hosting":{
    // ...,

    "rewrites":[
    	//Refirect myprohect.firebase.com/api ti main functions
        {"source":"/api/*", "function":"main"}
    ]
}
*/