const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo () {
    navigator.mediaDevices.getUserMedia({video:true, audio:false})
    .then(localMediaStream => {
    console.log(localMediaStream);
    video.srcObject = localMediaStream;
    video.play();
   })
   .catch(err => {
       console.error(`OH NO!!!`, err)
   });
}

function paintToCanvas() {
 const width = video.videoWidth;
 const height = video.videoHeight;
 canvas.width = width;
 canvas.height = height;
 //conosole.log(width, height);

 return setInterval(() => {
   ctx.drawImage(video, 0, 0, width, height);
   //take the pixels out
   let pixels = ctx.getImageData(0,0,width,height);
   //alter them with the function
   //pixels = redEffect(pixels);

   //pixels = rgbSplit(pixels);
   //ctx.globalAlpha = 0.05; //ghosting effect
   
   pixels = greenScreen(pixels);
   //put the pixels back
   ctx.putImageData(pixels,0,0);
   //console.log(pixels);
   //debugger;

 }, 16);
}

function takePhoto () {
    snap.currentTime = 0;
    snap.play(); //sound
    //take data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    //console.log(data);
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download','stunning');
    link.innerHTML = `<img src="${data}" alt="Stunning Person" />`
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for(let i = 0; i< pixels.data.length; i+=4) {
        pixels[i+0] = pixels.data[i + 0] + 200; //red
        pixels[i+1] = pixels.data[i + 1] - 30;//green
        pixels[i+2] = pixels.data[i + 2] * 0.5;//blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 150] = pixels.data[i + 0]; // red
        pixels.data[i + 450] = pixels.data[i + 1]; // green
        pixels.data[i - 450] = pixels.data[i + 2]; // blue
    }
    return pixels;
} 

function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });

    //console.log(levels);
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out! The forth pixel is alpha which is the transparency pixels.
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
  }

getVideo ();

video.addEventListener('canplay', paintToCanvas)