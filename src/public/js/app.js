const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName = "";

// 메시지 추가하기
function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${input.value}`);
    input.value = "";
  });
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

// 방에 접속시 할 일
form.addEventListener("submit", handleRoomSubmit);

// welcome 이벤트 발생시 할 일
socket.on("welcome", () => {
  addMessage("친구가 방에 입장했습니다.");
});

// bye 이벤트 발생시 할 일
socket.on("bye", () => {
  addMessage("친구가 방에서 퇴장했습니다.");
});

// new_message 이벤트 발생시 할 일
socket.on("new_message", addMessage);
