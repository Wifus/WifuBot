const requireDir = require('require-dir');
const dir = requireDir('./commandList', { recurse: true });
const CommandInterface = require("./CommandInterface");

const commands = {};

module.exports = class CommandHandler{
	constructor(main){
		this.main = main;
		this.registerCommands();
	}
	
	execute(command, msg){
        if(commands[command]){
			commands[command].execute(this.getParams(msg));
		}	
	}

	getParams(msg){
		let param = {
			"msg":msg,
			"args":msg.args,
			"main":msg.main,
			"bot":msg.main.bot,
			"prefix":msg.main.prefix,
			"user":msg.author
		}

		param.send = function(message){
			param.bot.createMessage(param.msg.channel.id, message);
		}

		param.syntax = function(){
			param.bot.createMessage(param.msg.channel.id, "Wrong syntax!");
		}

		return param;
	}
	
	registerCommands(){
		for(let file in dir){
			if(dir[file] instanceof CommandInterface){
				commands[file] = dir[file];
			} else{
				for(let file2 in dir[file]){
					if(dir[file][file2] instanceof CommandInterface){
						commands[file2] = dir[file][file2];
					}
				}
			}
		}
	}
}