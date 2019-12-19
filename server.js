//Features to add:
//intelligent checking if react has been sent (to make react text more reliable)
//intelligent replacing of chars (eg 11 -> 1I, II->I1)
//rewrite it in not javascript (Python)


//digit substitutes:
//1-I , 2-Z, 3-E, 4-(A),5-,6-G,7-(T),8-B,9-,0-O
//you could of course make multiple servers for this bot so it can have more emojis as replacement characters

//50 emojis / server
//5 sets of 10 digits
//1.9 sets of letters


//user server limit per user: 100
//bot created server limit:
//https://discordapp.com/developers/docs/resources/guild
//"Create Guild: This endpoint can be used only by bots in less than 10 guilds"
//1 solution is to manually create more guilds
//discord does not like bots using user accounts: https://support.discordapp.com/hc/en-us/articles/115002192352-Automated-user-accounts-self-bots-

//idea2: change the emojis on demand, for the number of letters needed


//react limit/message: 10 for users, 40 for bots





// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const http = require('http');


app.use(express.static('public'));

app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})


//ping self every 5 mins
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
})
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000); //4m40s

//Discord.js bot part

function wrapperSend(message,s){
	message.channel.send(s);
}

function wrapperReact(message,s){
	message.react(s);
}


function toFatText(s1){
  //missing: f k r
  var replacements = [["a","🅰","🔼","4⃣"],["b","🅱","8⃣"],["c","↪","©","🌜","☪"],["d","↩","🌛"],["e","3⃣"],["g","6⃣"],["h","♓"],
                      ["i","ℹ","1⃣"],["j","🎷"],["l","👢"],["m","Ⓜ","♏","♍","〽"],["n","♑"],["o","🅾","⭕","0⃣"],["p","🅿"],["q","🍳"],
                      ["s","💲","5⃣"],["t","✝","7⃣"],["u","⛎"],["v","♈","✅","🔽"],["w","🐍","➿"],["x","❎","❌"],["y","💹"],["z","💤","2⃣"],
                      ["!","❗","❕"],["?","❓","❔"]];
  //,["r","®"]];
  //,["",""]
	var s=s1.toLowerCase();
	s=sanitize(s);
	var fatText=[];
	for (var i = 0; i < s.length && fatText.length < 40; i++) { 
    var c = s.charAt(i);  
    var fatChar=toFatChar(c);
    if(!fatText.includes(fatChar)){
      fatText.push(fatChar);
    }else{
      var replacementFound = false;
      for (var k = 0; k < replacements.length; k++) {
        if(replacements[k][0]==c){
          for (var j = 1; j < replacements[k].length; j++) {
            if(!fatText.includes(replacements[k][j])){
              fatText.push(replacements[k][j]);
              replacementFound=true;
              break;
            }
          }
          break;
        }
      }
    }
  }
  console.log(fatText);
  return fatText;
}

function toFatChar(c1){//from ASCII code to Unicode
  var c = c1.charCodeAt(0); //"0".charCodeAt(0)=48
  if(48<=c && c<=57){
    var digits = ["0⃣","1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣"];
    return digits[c-48];
  }else if(c1=="!"){
    return "❗"
  }else if(c1=="?"){
    return "❓"
  }else{
    return String.fromCodePoint(c-97+0x1F1E6);
  }
}

//could be rewritten to confirm when the last emoji was recieved before sending the next one
function reactWithEmojiList(message,lst){
	for (var i = 0; i < lst.length; i++) {
		setTimeout(wrapperReact, i*500,message,lst[i]);
	}
}

function reactWithText(message,text){
  reactWithEmojiList(message,toFatText(text));
}

//replace this with regex
function sanitize(s){
	//sanitize string to plain ascii
	var cleanS="";
	for(var i=0;i<s.length;i++){
		var c=s.charAt(i);
		if("abcdefghijklmonpqrstuvwxyz1234567890!?".includes(c)){
			cleanS+=c;
		}
	}
	return cleanS;
}


const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log("I am ready!");
  client.user.setActivity('nice-discordjs-bot.glitch.me');
});



client.on("message", (message) => {
  console.log(message.content);
  if(message.content.match(reBigText)){
    let formattedStr = message.content.replace(reBigText, formatBigText);
    
    message.delete();
    message.channel.send(`${message.author.username}: ${formattedStr}`);
  }else if (message.content.match(/^d\d+$/)) {
    var range = parseInt(message.content.slice(1));
    var result = Math.floor(Math.random() * range) + 1;
    result = result.toString();
    if(result=="11"){result="1I";}
    else if(result=="22"){result="2Z";}
    else if(result=="33"){result="3E";}
    reactWithText(message,result);
  }else if (message.content.startsWith("^")) {
    var hatCount = ((message.content).match(/\^/g) || []).length;
		message.channel.fetchMessages({ limit: 1+hatCount })
		.then((messages) => {
			var lastmessage=messages.array()[hatCount];
			var command = message.content.slice(1);
			
      if(command!=""){
        var s = message.content.substring(1).toLowerCase();
        reactWithText(lastmessage,s);
        message.delete();
      }
		})
		.catch(console.error);
  }
});

client.login(process.env.TOKEN);