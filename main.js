import { Markov } from "./lib/markov";

import "./style.css";

const mk = Markov();
const synth = window.speechSynthesis;
let client;

const connect = () => {
  client = new tmi.Client({
    connection: {
      secure: true,
      reconnect: true,
    },
    channels: window.location.hash.slice(1).split(","),
  });

  client.on("connected", () => {
    const d = new Date();

    const container = document.createElement("div");
    const chnl = document.createElement("span");
    const user = document.createElement("span");
    const msg = document.createElement("span");

    container.classList.add("msg");
    chnl.classList.add("channel");
    user.classList.add("user");
    msg.classList.add("message");

    container.append(chnl);
    container.append(user);
    container.append(msg);

    chnl.innerText = "status: ";
    user.innerText = "connected";
    msg.innerText = " at " + d.toLocaleTimeString();
    msg.title = `status: connected at ${d.toLocaleTimeString()}`;

    document.body.prepend(container);
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

    const container = document.createElement("div");
    const chnl = document.createElement("span");
    const user = document.createElement("span");
    const msg = document.createElement("span");
    const speech = document.createElement("button");

    container.classList.add("msg");
    chnl.classList.add("channel");
    user.classList.add("user");
    msg.classList.add("message");
    speech.classList.add("utter");

    container.append(chnl);
    container.append(user);
    container.append(msg);
    container.append(speech);

    chnl.innerText = `${channel} `;
    user.innerText = tags["display-name"];
    msg.innerText = `: ${resp}`;
    msg.title = message;
    speech.innerText = "Utter";

    speech.addEventListener("click", () => {
      const say = new SpeechSynthesisUtterance(resp);
      synth.speak(say);
    });

    document.body.prepend(container);
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
