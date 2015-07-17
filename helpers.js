exports = module.exports = {
    guid: function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },
    env: function(key, defaultValue){
        if(process.env.hasOwnProperty(key)) return process.env[key];
        return defaultValue;
    }
};