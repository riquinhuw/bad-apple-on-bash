(() => {
  const frames = [];

  for (let i = 1; i <= 3808; i++) {
    const frame = fs.readFileSync(`./texts/text${i}.txt`, "utf8");
    frames.push(frame);
  }
  let frameIndex = 0;
  setInterval(() => {
    console.clear();
    console.log(frames[frameIndex]);
    frameIndex = (frameIndex + 1) % frames.length;
  }, 31);
})();
