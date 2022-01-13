const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '1195258916:AAHCoNPAEoJEnNQsj-RHuV-b3PY9yC2D6J4';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

var users = [];  // { username, uid, ugroup }

var notes = [];  // { uid, time, text, announcementMonth, announcementDay }

var groupNotes = [];  // { group, description }

function isNotListed(msg) {
  var isUserNotListed = true;
  for(var i=0; i < users.length; i++) {
    if (msg.from.id == users[i]['uid']) {
      isUserNotListed = false;
      break;
    }
  }
  return isUserNotListed;
}

function isDate(tmp) {
  var isDate = true;

  var noteDay = '';
  var noteMonth = '';
  var timeHour = '';
  var timeMinutes = '';
  var n = 0;

  while ((tmp[n] != '.') && (n < tmp.length)) {
    noteDay += tmp[n];
    ++n;
  }

  if (n == tmp.length) {
    isDate = false;
    return isDate;
  }

  if (isNaN(parseInt(noteDay, 10))) {
    isDate = false;
    return isDate;
  }
  else {
    if ((parseInt(noteDay, 10) < 1) || (parseInt(noteDay, 10) > 31) || (parseInt(noteDay, 10) < new Date().getDate())) {
      isDate = false;
      return isDate;
    }
  }

  ++n;

  while ((tmp[n] != ' ') && (n < tmp.length)) {
    noteMonth += tmp[n];
    ++n;
  }

  if (n == tmp.length) {
    isDate = false;
    return isDate;
  }

  if (isNaN(parseInt(noteMonth, 10))) {
    isDate = false;
    return isDate;
  }
  else {
    if ((parseInt(noteMonth, 10) < 1) || (parseInt(noteMonth, 10) > 12) || (parseInt(noteMonth, 10) < (new Date().getMonth() + 1))) {
      isDate = false;
      return isDate;
    }
  }

  ++n;

  while ((tmp[n] != ':') && (n < tmp.length)) {
    timeHour += tmp[n];
    ++n;
  }

  if (n == tmp.length) {
    isDate = false;
    return isDate;
  }

  if (isNaN(parseInt(timeHour, 10))) {
    isDate = false;
    return isDate;
  }
  else {
    if ((parseInt(timeHour, 10) < 0) || (parseInt(timeHour, 10) > 23)) {
      isDate = false;
      return isDate;
    }
  }

  ++n;

  while (n < tmp.length) {
    timeMinutes += tmp[n];
    ++n;
  }

  if (isNaN(parseInt(timeMinutes, 10))) {
    isDate = false;
    return isDate;
  }
  else {
    if ((parseInt(timeMinutes, 10) < 0) || (parseInt(timeMinutes, 10) > 59)) {
      isDate = false;
      return isDate;
    }
  }

  return isDate;
}

function isGroup(tmp) {
  var isGroup = true;

  var directionNumber = '';
  var groupNumber = '';

  var n = 0;

  if (tmp[n] == 'з') {
    ++n;
  }
  else {
    while ((tmp[n] != '/') && (n < tmp.length)) {
      directionNumber += tmp[n];
      ++n;
    }

    if (n == tmp.length) {
      isGroup = false;
      return isGroup;
    }
  
    if (isNaN(parseInt(directionNumber, 10)) || (directionNumber.length != 7)) {
      isGroup = false;
      return isGroup;
    }

    ++n;

    while (n < tmp.length) {
      groupNumber += tmp[n];
      ++n;
    }
  
    if (isNaN(parseInt(groupNumber, 10)) || (groupNumber.length != 5)) {
      isGroup = false;
      return isGroup;
    }
  }

  return isGroup;
}

function getInfo() {
  return '--------------Help--------------\n' 
      + '1) /remind <note_name> in <note_time> description <note_description> - добавление записи в ежедневник;\n'
      + '    <note_name> - название записи в ежедневнике;\n'
      + '    <note_time> - время события в формате <день>.<месяц(без 0)>_(_ - пробел)<час>:<минута>;\n'
      + '    <note_description> - информация записи;\n'
      + '2) /getNotes - возможность просмотра ежедневника;\n'
      + '3) /setGroup <group_number> - установление группы студента;\n'
      + '    <group_number> - номер группы в формате <направление(7 чисел)>/<группа(5 чисел)>, допускается \'з\' перед номером группы для указания заочной формы обучения;\n'
      + '4) /addGroupNote <note_description> - добавление записей в список записей группы, которая доступна всем участникам этой группы;\n'
      + '    <note_description> - информация записи;\n'
      + '5) /deleteGroupNote <note_id> - удаление записей из списка записей группы, который доступен всем участникам этой группы;\n'
      + '    <note_id> - номер существующей записи из списка записей группы(/getGroupNotes);\n'
      + '6) /getGroupNotes - возможность просмотра записей группы;\n'
      + '7) /getSchedule - получение ссылки на расписание группы;\n'
}

function getUserGroup(tmp) {
  for (var i = 0; i < users.length; i++) {
    if (users[i]['uid'] == tmp) {
      return users[i]['ugroup'];
    }
  }
}

bot.on('message', (msg) => {
  var userId = msg.from.id;

  if (isNotListed(msg)) {
    users.push({'uid': userId, 'ugroup': 'Undefined',});

    bot.sendMessage(userId, 'It\'s your first message, send you some commands for start!\n\n' + getInfo());
  }
});

bot.onText(/setGroup (.+)/, function (msg, match) {
  var userId = msg.from.id;
  var group = match[1];

  if (isGroup(group)) {
    for (var i = 0; i < users.length; i++) {
      if (users[i]['uid'] == userId) {
        users[i]['ugroup'] = group;
      }
    }

    bot.sendMessage(userId, 'Group is changed!');
  }
  else {
    bot.sendMessage(userId, 'Wrong group name!');
  }
});

bot.onText(/addGroupNote (.+)/, function (msg, match) {
  var userId = msg.from.id;
  var description = match[1];
  var group = getUserGroup(userId);

  if (group != 'Undefined') {
    groupNotes.push({'group': group, 'description': description});

    bot.sendMessage(userId, 'Group note was added!');
  }
  else {
    bot.sendMessage(userId, 'Firstly you need to set your group by \'/setGroup\'!');
  }
});

bot.onText(/deleteGroupNote (.+)/, function (msg, match) {
  var userId = msg.from.id;
  var noteId = match[1];

  var group = getUserGroup(userId);
  var n = 0;

  if ((group != 'Undefined')) {

    for (var i = 0; i < groupNotes.length; i++) {
      if (groupNotes[i]['group'] == group) {
        ++n;
        if (noteId == n) {
          groupNotes.splice(i, 1);
          bot.sendMessage(userId, 'Group note \'' + noteId + '\' was deleted!');
          return;
        }
      }
    }
    bot.sendMessage(userId, 'Wrong noteId!');
  }
  else {
    bot.sendMessage(userId, 'Firstly you need to set your group by \'/setGroup\'!');
  }
});

bot.onText(/getGroupNotes/, function (msg) {
  var userId = msg.from.id;
  var group = getUserGroup(userId);

  if (group == 'Undefined') {
    bot.sendMessage(userId, 'Firstly you need to set your group by \'/setGroup\'!');
  }
  else {
    var n = 0;
    var output = '';

    output += '--------------Group notes--------------'

    for (var i = 0; i < groupNotes.length; i++) {
      if (groupNotes[i]['group'] == group) {
        output += '\n';
        output += n + 1;
        output += ':\n';
        output += 'Description: ' + groupNotes[i]['description'];
        ++n;
      }
    }

    if (n == 0) {
      output += '\nNothing there';
    }

    bot.sendMessage(userId, output);
  }
});

bot.onText(/remind (.+) in (.+) description (.+)/, function (msg, match) {
  var userId = msg.from.id;
  var text = match[1];
  var time = match[2];
  var description = match[3];
  var announcementMonth = false;
  var announcementDay = false;

  if (isDate(time)) {
    notes.push({ 'uid': userId, 'time': time, 'text': text, 'description': description, 'announcementMonth': announcementMonth, 'announcementDay': announcementDay});

    bot.sendMessage(userId, 'Okay, i will remind it to you!');
  } 
  else {
    bot.sendMessage(userId, 'Wrong date format!');
  }
});

bot.onText(/getNotes/, function (msg) {
  var userId = msg.from.id;

  var n = 0;
  var output = '';

  output += '--------------Notes--------------'

  for (var i = 0; i < notes.length; i++) {
    if (notes[i]['uid'] == userId) {
      output += '\n';
      output += n + 1;
      output += ':\n';
      output += 'Text: ' + notes[i]['text'] + '\n';
      output += 'Time: ' + notes[i]['time'] + '\n';
      output += 'Description: ' + notes[i]['description'];
      ++n;
    }
  }

  if (n == 0) {
    output += '\nNothing there';
  }

  bot.sendMessage(userId, output);
});

bot.onText(/getSchedule/, function (msg) {
  var userId = msg.from.id;
  var group = getUserGroup(userId);

  if (group == 'Undefined') {
    bot.sendMessage(userId, 'Firstly you need to set your group by \'/setGroup\'!');
  }
  else {
    var url = 'https://ruz.spbstu.ru/search/groups?q=';

    var n = 0;
    var directionNumber = '';
    var groupNumber = '';

    if (group[n] == 'з') {
      url += group[n];
      ++n;
    }

    while (group[n] != '/') {
      directionNumber += group[n];
      ++n;
    }

    url += directionNumber + '%2F';

    ++n;

    while (n < group.length) {
      groupNumber += group[n];
      ++n;
    }

    url += groupNumber;

    bot.sendMessage(userId, 'Your schedule: ' + url);
  }
});

bot.onText(/getLinks/, function (msg) {
  var userId = msg.from.id;

  var output = '';

  output += '--------------Links--------------\n'
      + '1) Личный кабинет - https://lk.spbstu.ru/\n'
      + '2) Профсоюз - https://vk.com/profunionpro\n'
      + '3) Открытое образование - https://openedu.ru/\n'
      + '4) СДО ИКНТ - https://dl.spbstu.ru/\n'
      + '5) СДО СПбПУ - https://lms.spbstu.ru/\n'
      + '6) СДО ГИ - https://dl-hum.spbstu.ru/';

  bot.sendMessage(userId, output);
});

setInterval(function() {
  for (var i = 0; i < notes.length; i++) {
  const curDate = new Date().getDate() + '.' + (new Date().getMonth() + 1) + ' ' + new Date().getHours() + ':' + new Date().getMinutes();
  const curMonth = new Date().getMonth() + 1;
  const curDay = new Date().getDate();
  var noteDay = '';
  var noteMonth = '';
  var timeHour = '';
  var timeMinute = '';
  var n = 0;
  while (notes[i]['time'][n] != '.') {
    noteDay += notes[i]['time'][n];
    ++n;
  }
  ++n;
  while (notes[i]['time'][n] != ' ') {
    noteMonth += notes[i]['time'][n];
    ++n;
  }
  ++n;
  while (notes[i]['time'][n] != ':') {
    timeHour += notes[i]['time'][n];
    ++n;
  }
  ++n;
  while (n < notes[i]['time'].length) {
    timeMinute += notes[i]['time'][n];
    ++n;
  }
  if (('' + parseInt(noteDay ,10) + '.' + parseInt(noteMonth, 10) + ' ' + parseInt(timeHour, 10) + ':' + parseInt(timeMinute, 10)) === curDate) {
    bot.sendMessage(notes[i]['uid'], 'You have the '+ notes[i]['text'] + ' now!\n' + 'Description - ' + notes[i]['description']);
    notes.splice(i, 1);
  }
  else {
    if ((noteDay == curDay) && (notes[i]['announcementDay'] != true)) {
      bot.sendMessage(notes[i]['uid'], 'You have the '+ notes[i]['text'] + ' today!\n' + 'Description - ' + notes[i]['description']);
      notes[i]['announcementDay'] = true;
    }
    else {
      if ((noteMonth == curMonth) && (notes[i]['announcementMonth'] != true) && (notes[i]['announcementDay'] != true)) {
        bot.sendMessage(notes[i]['uid'], 'You have the '+ notes[i]['text'] + ' in this month!\n' + 'Description - ' + notes[i]['description']);
        notes[i]['announcementMonth'] = true;
      }
    }
  }
}
}, 1000);
