import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc'
import * as timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

var register = function (Handlebars) {
    var helpers = {
        gt: function (num1, num2) {
            return num1 > num2
        },

        gte: function (num1, num2) {
            return num1 >= num2
        },

        eq: function (arg1, arg2) {
            return arg1 == arg2
        },

        neq: function (arg1, arg2) {
            return arg1 != arg2
        },

        ifNotEquals: function (arg1, arg2, options) {
            return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
        },

        roleOfThisIdIs: function (id: number, role: "owner" | "sitter" | "admin") {
            let strId = id.toString()
            let idLength = strId.length
            let _role = undefined
            if(idLength == 7){
                if(strId[0] == "1") _role = "owner"
                if(strId[0] == "2") _role = "sitter"
            }else if(idLength < 7) _role = "admin"
            return _role == role
        },

        capFirstChar: function (string: string) {
            if (!string) return ''
            let splitted = string.split(' ')
            for (let i = 0; i < splitted.length; i++) {
                splitted[i] = splitted[i].charAt(0).toUpperCase() + splitted[i].slice(1)
            }
            return splitted.join(' ')
        },

        formatDate: function (utcFormat: Date, format: string) {
            return dayjs(utcFormat).format(format)
        },

        fromNow: function (inDate) {
            let now = dayjs.utc()
            let date = dayjs(inDate).utc()
            if (now.diff(date, 'second') < 60) return `${now.diff(date, 'second')} seconds ago`
            if (now.diff(date, 'minute') < 60) return `${now.diff(date, 'minute')} minutes ago`
            if (now.diff(date, 'hour') < 24) return `${now.diff(date, 'hour')} hours ago`
            if (now.diff(date, 'day') < 31) return `${now.diff(date, 'day')} days ago`
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
        },

        isFinished: function (status, endDate) {
            if (status === "Paid" && dayjs().isAfter(dayjs(endDate))) return true
            else return false
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