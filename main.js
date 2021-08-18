import { Blahkov } from "./lib/markov";

import "./style.css";

const bk = Blahkov();

let client;
const connect = () => {
  client = new tmi.Client({
    connection: {
      secure: true,
      reconnect: true,
    },
    channels: window.location.hash.slice(1).split(","),
  });

  client.connect();

  // var synth = window.speechSynthesis
  client.on("message", (channel, tags, message) => {
    let word = bk.update(message);

    const len = message.length; //~~(Math.random() * message.length)
    let resp = word;
    for (let i = 0; i < len; i++) {
      word = bk.gen(word);
      resp += " " + word;
      resp = resp.trim();
    }

    // var utterThis = new SpeechSynthesisUtterance(resp)
    // synth.speak(utterThis)
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

    chnl.innerText = `${channel} `;
    user.innerText = tags["display-name"];
    msg.innerText = `: ${resp}`;
    msg.title = message;

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
