import store from "store";

export function Blahkov() {
  const ngrams = store.get("tm-ngrams", {});

  return {
    gen(curr) {
      let possibilites = ngrams[curr];
      if (!!!possibilites) return "";

      const next = possibilites[~~(Math.random() * possibilites.length)];
      if (!!!next) return "";

      return next;
    },

    update(txt) {
      const words = txt
        .replace(/[^\w+ ]/gim, "")
        .replace(/\R'/gim, " ")
        .split(" ")
        .filter((x) => !!x);

      for (let i = 0; i < words.length; i++) {
        let gram = words[i];

        if (!ngrams[gram]) ngrams[gram] = [];
        ngrams[gram].push(words[i + 1]);
      }

      store.set("tm-ngrams", ngrams);
      return words[0];
    },
  };
}
