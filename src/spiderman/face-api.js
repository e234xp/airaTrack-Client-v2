import * as faceapi from 'face-api.js';

faceapi.nets.tinyFaceDetector.loadFromUri('/models');

async function detectFaceAndGetHeadBox(img) {
  if (faceapi === undefined) return null;

  let detection = null;
  try {
    detection = await faceapi.detectSingleFace(
      img,
      new faceapi.TinyFaceDetectorOptions({scoreThreshold: 0.4})
    );
  }
  catch( ex) {
    console.error(ex);
  }

  return new Promise((resolve) => {
    let box = null;
    if (detection) {
      let rangeRatio = 2;
      let headWidthToHunt =
        (detection.box.width < detection.box.height
          ? detection.box.width
          : detection.box.height) * rangeRatio;
      let headX = detection.box.x - detection.box.height / 2;
      let headY = detection.box.y - detection.box.height / 1.2;
      if (headX < 0) headX = 0;
      if (headY < 0) headY = 0;
      while (
        headWidthToHunt + headX > img.width ||
        headWidthToHunt + headY > img.height
      ) {
        headWidthToHunt--;
      }

      box = {
        x: headX,
        y: headY,
        width: headWidthToHunt,
        height: headWidthToHunt,
      };
    }
    // if (cb) cb(box);
    resolve(box);
  });
}

export default { detectFaceAndGetHeadBox };