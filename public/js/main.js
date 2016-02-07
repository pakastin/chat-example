
(function () {
  'use strict';

  function el (tagName, attrs, children) {
    var element = document.createElement(tagName || 'div');

    for (var attr in attrs || {}) {
      element[attr] = attrs[attr];
    }

    if (children) {
      for (var i = 0; i < children.length; i++) {
        element.appendChild(children[i]);
      }
    }

    return element;
  }
  el.extend = function (tagName) {
    return function (attrs, children) {
      return el(tagName, attrs, children);
    }
  }

  var button = el.extend('button');
  var div = el.extend('div');
  var form = el.extend('form');
  var input = el.extend('input');
  var table = el.extend('table');
  var tbody = el.extend('tbody');
  var tr = el.extend('tr');
  var td = el.extend('td');
  var textarea = el.extend('textarea');

  var messagesBody = tbody();

  var messages = div({className: 'messages'}, [
    table(null, [
      messagesBody
    ])
  ]);
  var name = input({className: 'name', placeholder: 'Nickname', autofocus: true});
  var message = input({className: 'message', placeholder: 'Message'});
  var send = button({className: 'send', textContent: 'Send'});

  var compose = form({className: 'compose'}, [
    name, message, send
  ]);

  document.body.insertBefore(compose, document.body.firstChild);
  document.body.insertBefore(messages, compose);

  var socket = io.connect();

  socket.on('msg', function (msg) {
    var time = humanizeTime(msg.time);
    var nickname = msg.nickname;
    var message = msg.message;

    messagesBody.appendChild(tr(null, [
      td({textContent: time}), td({textContent: nickname}), td({textContent: message})
    ]));
    messages.scrollTop = messages.scrollHeight;
  });

  compose.addEventListener('submit', function (e) {
    e.preventDefault();

    socket.emit('msg', {
      nickname: name.value,
      message: message.value
    });
    message.value = '';
    message.focus();
  });
})();

function humanizeTime (time) {
  var date = new Date(time);

  return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}
