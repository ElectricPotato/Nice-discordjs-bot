//Glitch.com nice discord.js bot
//https://nice-discordjs-bot.glitch.me/
//https://uptimerobot.com/dashboard

// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const http = require('http');


const deepai = require('deepai'); // OR include deepai.min.js as a script tag in your HTML

deepai.setApiKey(process.env.DEEPAIAPIKEY);


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
    var fatChar=toFatChar(c)
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

//get n random elements from array
function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len){
        n = len;
    }
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function thonk(lastmessage,nThonks){
	//get list of custom emojis
	const emojiList = client.emojis.array();
	var thonkList=["🤔"];
	for(var i=0;i<emojiList.length;i++){
		var nm=emojiList[i].name.toLowerCase();
		if(nm.includes("thonk") || nm.includes("think")){
			thonkList.push(emojiList[i]);
		}
	}
	//react with list containing think
	reactWithEmojiList(lastmessage,getRandom(thonkList,nThonks));
	//reactWithEmojiList(lastmessage,thonkList); //react with all thonks
}

const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log("I am ready!");
  client.user.setActivity('nice-discordjs-bot.glitch.me');
  //client.user.setActivity('nice-discordjs-bot.glitch.me', { type: 'WATCHING' });
});

var reBigText = /\+\+[^\+]+\+\+/g;

function formatBigText(sIn) {
  var s = sIn.substring(2,sIn.length-2).toLowerCase();
  var returnStr="";
	for(var i=0;i<s.length;i++){
		var c=s.charAt(i);
		if("abcdefghijklmonpqrstuvwxyz0123456789!?".includes(c)){
      
      
      if("apob".includes(c)){
        returnStr+=toFatText(c+c)[1];
      }else{
        returnStr+=toFatText(c);
      }
			
      returnStr+=" ";//add sspace after each emoji to stop combining into flags
		}else if(c==" "){
      returnStr+="      ";
    }else{
      returnStr+=c;
    }
	}
	return returnStr;
}




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
        if(command.startsWith("thonk")){
          var nThonks = 5;
          if(command.length>"thonk".length){ //specify number of emojis
            nThonks = parseInt(command.slice("thonk".length+1));
          }
          thonk(lastmessage,nThonks);
        }else{
          var s = message.content.substring(1).toLowerCase();
          reactWithText(lastmessage,s);
        }
        message.delete();
      }
		})
		.catch(console.error);
  }else if (message.content.startsWith("<@"+client.user.id)) {
    console.log(message.content);
    if(message.content.includes("?")){
      //var replies =  ["It is certain","It is decidedly so","Without a doubt","Yes definitely","You may rely on it","Most likely","Yes","Signs point to yes","Ask again later","My reply is no","My sources say no","Very doubtful"];
      var replies =  ["yes","no","maybe"];
      var result = Math.floor(Math.random() * replies.length);
      //,"As I see it, yes.", "Outlook good.","Reply hazy, try again.","Better not tell you now.","Concentrate and ask again.","Cannot predict now.""Don't count on it.","Outlook not so good.",
      reactWithText(message,replies[result]);
    }else{
      reactWithText(message,"nice");
    }
	}else if (message.content.toLowerCase().includes("<dreamify")) {
    /*var resp = await deepai.callStandardApi("deepdream", {
        content: "YOUR_IMAGE_URL",
    });
    console.log(resp);*/
  }else if (message.content.toLowerCase().includes("thanos car")) {
		reactWithText(message,"thanos car");
	}else if (message.content.toLowerCase().includes("nice")) {
		reactWithText(message,"nice");
	}else if(Math.random()<1/100){
		wrapperReact(message,"🤔");
	}
});

client.login(process.env.TOKEN);

/*
client.on('messageReactionAdd', (reaction, user) => {
  console.log(reaction.emoji.name);
});
//*/


//0x1F1E6 A

//send list of custom emojis
//const emojiList = message.guild.emojis.map(e=>e.toString()).join(" ");
//message.channel.send(emojiList);

//https://discordapp.com/oauth2/authorize?client_id=465959927119085569&scope=bot

//BLOCKHEAD
//DEMONICAL