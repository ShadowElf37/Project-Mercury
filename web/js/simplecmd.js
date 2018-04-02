function SimpleCmd() {
    this.output = null;
    this.helpstr = "Type help for help.";
    this.functions = {
        "help": function(args) {
            this.output.println("Commands:");
            this.output.println("help - this");
            this.output.println("kill - kill <arg>");
        },
        "kill": function(args) {
            this.output.format('bic', '#ff0000');
            this.output.println("You just killed " + (args.join(' ') || 'yourself') + '!');
            this.output.clrfmt();
        }
    }
}

SimpleCmd.prototype.prompt = function() {
    return " $ ";
}

SimpleCmd.prototype.console = function(o) {
    this.output = o;
}

SimpleCmd.prototype.def = function(cmd, args) {
    this.output.println("Unknown command " + cmd + ". " + this.helpstr);
}
SimpleCmd.prototype.call = function(cmd, args) {
    var func = this.functions[cmd];
    var self = this;
    if(func)
        func.call(this, args);
    else
        fetch("http://[[host]]:[[port]]/cmd/" + cmd + '/' + args.join('-')).then(function(response) {
            response.text().then(function(text) {
                t = text.split('|')
                style = t[0];
                color = t[1];
                text = t[2];
                self.output.format(style, color);
                self.output.println(text);
                self.output.clrfmt();
            });
        });
        //this.def(cmd, args);
}
