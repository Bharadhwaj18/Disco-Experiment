const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get UserName and Room from the URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join ChatRoom

socket.emit("joinRoom", { username, room });

// Get Room and Users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //   Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message Submit

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //   Get message text
  const msg = e.target.elements.msg.value;

  //   Emitting a message to server
  socket.emit("chatMessage", msg);

  //   Clear Input
  e.target.msg.value = "";
  e.target.elements.msg.focus();
});

// Output Message to DOM

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <div class="message">
      <p class="meta">${message.username} <span>${message.time}</span>
      </p>
      <p class="text">${message.text}</p>
    </div>`;

  document.querySelector(".chat-messages").appendChild(div);
}

// Add Room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add Users to DOM

function outputUsers(users) {
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
}
