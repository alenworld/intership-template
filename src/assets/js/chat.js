/**
 * Elements and imports
 */

const socket = io();
const messages = document.querySelector('.chat-history ul');
const sendArea = document.querySelector('.chat-message');
const textArea = document.getElementById('message-to-send');
const connectedList = document.querySelector('.people-list ul');
const typing = document.getElementById('typing');
const chatAbout = document.querySelector('.chat-about');
const onlineInfo = document.getElementById('online-info');
const idValue = document.getElementById('user_id').textContent;
/**
 * Functions
 */

const appendOnlineInfo = (num) => {
  let u;
  if (num === 1) u = 'user';
  else u = 'users';
  onlineInfo.textContent = `${num} ${u} online`;

  chatAbout.prepend(onlineInfo);
};

const appendUser = (user) => {
  const connectedUser = document.createElement('li');
  connectedUser.setAttribute('class', 'clearfix');

  const imgData = document.createElement('img');
  imgData.setAttribute('src', `${user.picture}`);

  connectedUser.appendChild(imgData);

  const nameData = document.createElement('div');
  nameData.setAttribute('class', 'about');

  const tagNameValue = document.createElement('div');
  tagNameValue.setAttribute('class', 'name');
  tagNameValue.textContent = `${user.firstName} ${user.lastName}`;

  nameData.appendChild(tagNameValue);
  connectedUser.appendChild(nameData);

  connectedList.appendChild(connectedUser);
};

const appendMessage = (message, sender, own) => { // if sender is true, he is own who wrote the message
  const item = document.createElement('li');
  if (sender === true) {
    item.classList.add('clearfix');
  }

  const messageData = document.createElement('div');
  if (sender === true) {
    messageData.setAttribute('class', 'message-data align-right');
  } else {
    messageData.setAttribute('class', 'message-data');
  }

  const dataName = document.createElement('span');
  dataName.setAttribute('class', 'message-data-name');

  if (sender === true) {
    dataName.innerHTML = `${own}`;
    messageData.appendChild(dataName);
  } else {
    dataName.innerHTML = `${sender}`;
    messageData.appendChild(dataName);
  }

  const dataTime = document.createElement('span');
  dataTime.setAttribute('class', 'message-data-time');
  const timeValue = document.createTextNode(`${new Date().toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })}`);
  // insert time to span
  dataTime.appendChild(timeValue);

  // insert span elements to div
  messageData.appendChild(dataTime);

  // if sender === true -> insert before time then name
  if (sender === true) {
    dataName.innerHTML = ` ${own}`;
    messageData.appendChild(dataName);
  }

  // messageData to item li
  item.appendChild(messageData);

  // create element for message
  const messageTag = document.createElement('div');
  if (sender === true) {
    messageTag.setAttribute('class', 'message other-message float-right');
  } else {
    messageTag.setAttribute('class', 'message my-message');
  }
  const messageValue = document.createTextNode(`${message}`);
  // insert message to element
  messageTag.appendChild(messageValue);

  // insert messageTag to item li
  item.appendChild(messageTag);
  // insert item to chat-history
  messages.appendChild(item);
};

/**
 * Receiving and sending information from the server
 */

socket.emit('new-connect', idValue);

socket.on('new-connect', (userInfo) => {
  socket.emit('new-user', userInfo);
});

socket.on('users-online-amount', (num) => {
  appendOnlineInfo(num);
});

socket.on('users-list', (users) => {
  while (connectedList.firstChild) {
    connectedList.firstChild.remove();
  }
  appendOnlineInfo(users.length);
  users.forEach((user) => {
    appendUser(user);
  });
});

socket.on('chat-message', (data) => {
  appendMessage(data.message, data.name);
});

socket.on('reload', () => {
  document.location.reload();
});

socket.on('user-typing', (data) => {
  typing.textContent = `${data.firstName} is typing...`;
  setTimeout(() => { typing.textContent = ''; }, 2300);
});

/**
 * Event listeners
 */

sendArea.querySelector('button').addEventListener('click', (event) => {
  event.preventDefault();

  const message = textArea.value;
  const me = 'ME';

  if (message.length !== 0) {
    socket.emit('send-chat-message', message);
    textArea.value = '';
    appendMessage(`${message}`, true, `${me}`);
  }
});

textArea.addEventListener('keydown', (event) => {
  if (event.code) {
    socket.emit('user-typing', { socket_id: socket.id });
  }
});
