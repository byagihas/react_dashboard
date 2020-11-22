const time = new Date(Date.now()).toISOString();
const localetime = new Date(Date.now()).toUTCString();
const browsertime = Intl.DateTimeFormat().resolvedOptions().timeZone;
const converted = DateTime.fromISO(time, { zone: browsertime });

let year = converted.c.year;
let month = String(converted.c.month).length > 1 ? converted.c.month : '0' + converted.c.month;
let day = String(converted.c.day).length > 1 ? converted.c.day : '0' + converted.c.day;
let hour = String(converted.c.hour).length > 1 ? converted.c.hour : '0' + converted.c.hour;
let minute = String(converted.c.minute).length > 1 ? converted.c.minute : '0' + converted.c.minute;
let second = String(converted.c.second).length > 1 ? converted.c.second : '0' + converted.c.second;
let timeFormat = year  + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;