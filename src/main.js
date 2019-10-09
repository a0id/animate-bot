const Discord = require("discord.js");
const path = require("path");
var fs = require('fs');
const auth = require("./auth.json");
const prefix = "-";

/* ----- BEGIN GET THE KEY ----- */

var log_dir;
var key = "";
var size = Object.keys(auth).length;
var i;

for (i = 0; i < size; i++) {
    key = key + auth[i];
}


/* ----- END GET THE KEY ----- */

/* ----- BEGIN LOG CODE ----- */

function setup_logs() {
    log_dir = "./src/logs";
    if (!fs.existsSync(log_dir)) {
        fs.mkdirSync(log_dir);
    }
}

function log(message) {
    var d = new Date();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    var month = d.getMonth();
    var day = d.getDate();
    var year = d.getFullYear();
    var time = hour + ":" + minute + ":" + second + " @ " + month + "/" + day + "/" + year;

    var log = "user wrote '" + message.content + "' to channel general at " + time;
    var file = log_dir + "/" + epoch + ".log";
    fs.writeFile(file, log, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(log + " logged in " + file);
    });
}


function remove_log(log_path) {
    fs.unlink(log_path, (err) => {
        if (err) throw err;
        console.log(log_path + " deleted.");
    });
}

function clean_logs() {
    fs.readdirSync(log_dir).forEach(file => {
        remove_log(log_dir + "/" + file);
    });
    console.log("Logs cleaned");
}

// setup_logs();

/* ----- END LOG CODE ----- */

function sleep(ms) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > ms) {
            break;
        }
    }
}

/* ----- BEGIN CLIENT ----- */

const client = new Discord.Client();
var epoch = Math.round((new Date).getTime() / 100);
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(key);

client.on('message', message => {
    // log(message);

    // var msg = message.content.toLowerCase();
    var msg = message.content;
    
    if (msg.substring(0, prefix.length) == prefix) {
        var command_no_prefix = msg.substring(prefix.length, msg.length);

        var stripped_command = command_no_prefix.replace(/\s+/g, " ").replace(/^\s|\s$/g, "");
        handle(message, stripped_command);
    }
});

/* ----- END CLIENT ----- */

/* ----- BEGIN COMMAND API ----- */

function handle(message, command) {
    var args = command.split(" ");
    
    switch (args[0]) {
    case "animate":
        if (args.length == 2)
            animate(message, args[1]);
        else
            message.channel.send("Invalid number of arguments to call animate.");
    }
}

function animate(message, name) {
    var member_id = message.member.user.id;
    for (var i = 0; i < name.length; i++) {
        message.guild.members.get(member_id).setNickname(name).then((error) => {
            console.log(error);
        }).then((error) => {
            console.log(error);
        });
    }
    
}

/* ----- END COMMAND API ----- */
