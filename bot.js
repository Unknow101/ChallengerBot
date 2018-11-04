const Discord = require('discord.js');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  port: "8889",
  user: "root",
  password: "root",
  database: "Challenger"
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
const client =  new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'Challenger Help') {
    msg.channel.send('Challenger list -  lister tout les challengers');
    msg.channel.send('Challenger top  -  lister les 10 premiers challengers');
  }
  if (msg.content === 'Challenger list') {
  	msg.channel.send('Voici la list des challengers enregistrés :')
  	con.query('SELECT * FROM challengers', function(err,result,field){
    if(err) {
      console.log(err);
      return;
    }
    if(result.length > 0){
      for (var i = 0; i < result.length; i++) {
        msg.channel.send(result[i].pseudo);
      }
    }
    });
  }
  if (msg.content === 'Challenger top') {
    msg.channel.send('Voici le top 10 des challengers :')
    con.query('SELECT * FROM challengers ORDER BY point DESC', function(err,result,field){
    if(err) {
      console.log(err);
      return;
    }
    if(result.length > 0){
      for (var i = 0; i < result.length; i++) {
        msg.channel.send(i+1 + " - " + result[i].pseudo + " - " + result[i].point + " points");
      }
    }
    });

  }
});
client.on("guildMemberAdd", (member) => {
  member.guild.channels.get('508318307229630468').send('Bienvenue au nouveau Challenger : ' + member.user);
  var sql = "INSERT INTO challengers (pseudo, point) VALUES ('" + member.user.username + "', '0')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
client.on("guildMemberRemove", (member) => {
  member.guild.channels.get('508318307229630468').send('Suppression du Challenger : ' + member.user);
  var sql = "DELETE FROM challengers WHERE pseudo = '"+ member.user.username +"'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });
});

client.login('token');
