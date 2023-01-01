import ffmpeg from "ffmpeg";
import fs from "fs";
import Jimp from "jimp";

async function imageToText(inputFile, outputFile) {
  const image = await Jimp.read(inputFile);
  image.resize(96, 72);
  image.greyscale();

  let pixels = [];

  for (let y = 0; y < image.bitmap.height; y++) {
    for (let x = 0; x < image.bitmap.width; x++) {
      let pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
      pixels.push(pixel.r);
    }
  }

  let text = "";
  let countBreakLike = 1;
  for (let i = 0; i < pixels.length; i++) {
    let value = pixels[i];
    if ((i % 96) * countBreakLike === 0) {
      text += "\n";
      countBreakLike + 1;
    }
    value += value < 32 ? " " : "@";
  }

  fs.writeFileSync(outputFile, text);
}

(async () => {
  try {
    var process = new ffmpeg("./video.mp4");
    await process.then(
      async function (video) {
        video.fnExtractFrameToJPG("./frames/", {
          file_name: "frame%n",
          every_n_frames: 1,
        });
      },
      async function (err) {
        console.log("Error: " + err);
      }
    );
  } catch (e) {
    console.log(e.code);
    console.log(e.msg);
  }
  console.log("All frames created");

  const promises = [];
  for (let i = 1; i <= 6955; i++) {
    promises.push(
      imageToText(`./frames/frame_${i}.jpg`, `./texts/text${i}.txt`)
    );
  }

  await Promise.all(promises);
  console.log("All texts creted");
})();
