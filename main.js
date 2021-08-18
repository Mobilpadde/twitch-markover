import { Markov } from "./lib/markov";

import "./style.css";

const mk = Markov();
const synth = window.speechSynthesis;
let client;

const say = (channel, username, markov, message) => {
  const container = document.createElement("div");
  const holder = document.createElement("div");
  const actions = document.createElement("div");
  const chnl = document.createElement("a");
  const user = document.createElement("span");
  const msg = document.createElement("span");
  const speech = document.createElement("button");

  container.classList.add("msg");
  holder.classList.add("info");
  actions.classList.add("actions");
  chnl.classList.add("channel");
  user.classList.add("user");
  msg.classList.add("message");
  speech.classList.add("utter");

  holder.append(chnl);
  holder.append(user);
  actions.append(holder);
  actions.append(speech);

  container.append(msg);
  container.append(actions);

  chnl.innerText = `${channel} `;
  user.innerText = username;
  msg.innerText = `${markov}`;
  msg.title = message;
  speech.innerText = "Utter";

  chnl.href = `https://www.twitch.tv/${channel.slice(1)}`;
  chnl.target = "_blank";

  speech.addEventListener("click", () => {
    const say = new SpeechSynthesisUtterance(markov);
    synth.speak(say);
  });

  document.body.prepend(container);
};

const connect = () => {
  if (!!client) {
    const d = new Date();
    say(
      "status: ",
      "disconnected",
      ` at ${d.toLocaleTimeString()}`,
      `status: disconnected at ${d.toLocaleTimeString()}`
    );
  }

  client = new tmi.Client({
    connection: {
      secure: true,
      reconnect: true,
    },
    channels: window.location.hash.slice(1).split(","),
  });

  client.on("connected", () => {
    const d = new Date();
    say(
      "status: ",
      "connected",
      ` at ${d.toLocaleTimeString()}`,
      `status: connected at ${d.toLocaleTimeString()}`
    );
  });

  client.connect();

  client.on("message", (channel, tags, message) => {
    let word = mk.update(message);

    const len = message.length; //~~(Math.random() * message.length)
    let resp = word;
    for (let i = 0; i < len; i++) {
      word = mk.gen(word);
      resp += " " + word;
      resp = resp.trim();
    }

    say(channel, tags["display-name"], resp, message);
  });
};

window.addEventListener("hashchange", () => {
  if (!!client) client.disconnect();
  connect();
});

window.addEventListener("DOMContentLoaded", () => {
  if (!!client) client.disconnect();
  connect();
});

document.getElementById("clear").addEventListener("click", mk.clear);
