// Elements and imports

const { id } = require('joi/lib/base');

const socket = io();
const sendArea = document.querySelector('chat-message');
const sendMessage = document.getElementById('message-to-send');
const messageLine = document.querySelector('div.chat-history ul li');
const typing = document.getElementById('typing');
const userLine = document.querySelector('div.people-list ul');
const connectedList = document.querySelector('div.people-list ul li');
let fullName;
let count = 0;

// Functions
function appendUser(userdata) {
  const connectedUser = document.createElement('li clearfix');
  connectedUser.innerHTML = userdata;
  connectedList.appendChild(connectedUser);
}

function appendMessage(message, sender) { // if sender is true, he is own who wrote the message
  const messageElement = document.createElement('div');
  messageElement.setAttribute('class', 'message-data');
  // time
  messageElement.appendChild('span').setAttribute('class', 'message-data-time')[0].appendChild(document.createTextNode(
    `<i>${new Date().getHours()}:${new Date().getMinutes()}</i> ${message}`,
  ));
  // first name
  messageElement.appendChild('span').setAttribute('class', 'message-data-name')[0].appendChild(document.createTextNode(
    `${sender.firstName}`,
  ));

  messageElement.innerHTML = document
    .createElement('div')
    .setAttribute('class', 'message other-message')[0]
    .appendChild(document.createTextNode(`${messageElement}`));

  messageLine.appendChild(messageElement);
}

function antFlood() {
  count += 1;
  if (count > 0) {
    setTimeout(() => { count -= 1; }, 5000);
  }
}

// Receiving and sending information from the server

socket.on('users-list', (users) => {
  while (connectedList.firstChild) {
    connectedList.firstChild.remove();
  }
  users.forEach((user) => {
    // const userInfo = document.createElement('div class.about')
    // const userAbout = userInfo.append(document.createElement('div.about'));

    appendUser(user);
  });
});

socket.on('new-user-message', (username) => {
  appendMessage(`<b>${username}</b> entered to chat!`);
});

socket.on('disconnect-message', (username) => {
  appendMessage(`<b>${username}</b> desconectou-se do chat.`);
});

socket.on('user-typing', (user) => {
  typing.innerHTML = `<b>${user}</b> typing message...`;
  setTimeout(() => { typing.innerHTML = ''; }, 1000);
});

socket.on('chat-message', (data) => {
  appendMessage(`<b>${data.name}:</b> ${data.message}`);
});

// Event listeners

sendArea.addEventListener('submit', (e) => { // Send message submit
  e.preventDefault();
  const message = sendMessage.textContent;
  if (message.length !== 0) {
    if (count < 3) {
      socket.emit('send-chat-message', message);
      sendMessage.value = '';
      sendMessage.focus();
      appendMessage(`<b>${userdata}:</b> ${message}`, true);
      antFlood();
    }
  }
});

sendMessage.addEventListener('change', () => { // When someone writes something is triggered
  socket.emit('user-typing', name);
});
