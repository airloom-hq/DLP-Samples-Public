///////////////////////////
//Setup
//////////////////////////

//////////////////////////////////////////////////////////////////////////////////
// Import modules
//////////////////////////////////////////////////////////////////////////////////
const fs = require('fs');
const readline = require('readline-sync');
const colors = require('colors');
const crypto = require("crypto")
const uuid = require("machine-uuid")(function(uuid) {
})

//////////////////////////////////////////////////////////////////////////////////
// Variable Initialisation
//////////////////////////////////////////////////////////////////////////////////
var backupPrefix = 'Backup';
var auth = null;
var token = null;
var clientid = null;
var client_secret = null;
var customerid = null;
var cloudConfig = null;
const algorithm = 'aes-256-cbc';
var key = null
const iv = crypto.randomBytes(16);


// Start
main();

//////////////////////////////////////////////////////////////////////////////////
// Functions
//////////////////////////////////////////////////////////////////////////////////

 
function main() {
clientid = readline.question("Please enter Client ID" +"\n");
client_secret = readline.question("Please enter Client Secret" +"\n");
customerid = readline.question("Please enter Customer ID" +"\n");
console.log ("CloudConfig for ZPA Prod = 'config.private.zscaler.com'" +"\n" + "CloudConfig for ZPA Beta = 'config.zpabeta.net'")
cloudConfig = readline.question("Please enter Cloud config" +"\n");
createKey();
}

//Create Key
async function createKey() {
	require("machine-uuid")(function(uuid) {
		var keytmp = uuid.toString();
		key = keytmp.substr(0,32)
	})
	setTimeout(encryptConfig, 1000);
}

function encryptConfig() {
	const config = {
	    "clientId": clientid,
	    "clientSecret": client_secret,
	    "customerId": customerid,
		"cloudConfig": cloudConfig
	};

	const data = JSON.stringify(config);
	var encryptedConfig = encrypt(data);
	var encryptedConfigstr = JSON.stringify(encryptedConfig)
	fs.writeFileSync('./config.json', encryptedConfigstr);
}

//Encrypt
function encrypt(text) {
 let cipher = 
    crypto.createCipheriv(algorithm, Buffer.from(key), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return { iv: iv.toString('hex'),
     encryptedData: encrypted.toString('hex') };
}