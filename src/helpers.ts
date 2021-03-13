var register = function (Handlebars) {
    var helpers = {
        gt: function (num1, num2) {
            return num1 > num2
        },
        capFirstChar: function (string: string) {
            let splitted = string.split(' ')
            for (let i = 0; i < splitted.length; i++) {
                splitted[i] = splitted[i].charAt(0).toUpperCase() + splitted[i].slice(1)
            }
            return splitted.join(' ')
        },
        mapGender: function (gender, options) {
            if (gender === "M") {
                return `<option value="M" selected>Male</option>`
            }
            else if (gender === "F") {

            }
            return "yay"
        },
        select: function (value, options) {
            return options.fn(this)
                .split('\n')
                .map(function (v) {
                    var t = 'value="' + value + '"'
                    return !RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"')
                })
                .join('\n')
        }
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        return helpers;
    }

};

module.exports.register = register;