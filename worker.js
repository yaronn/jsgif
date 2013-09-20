

importScripts('https://anigif-c9-yaronn01.c9.io/jsgif/GIFEncoder.js', 'https://anigif-c9-yaronn01.c9.io/jsgif/LZWEncoder.js', 'https://anigif-c9-yaronn01.c9.io/jsgif/NeuQuant.js', 'https://anigif-c9-yaronn01.c9.io/jsgif/Demos/b64.js')

onmessage = function (evt) {
    
    var msg = evt.data;
    //var imageData = msg.imageData.split(',').map(Number)
    
    var encoder = new GIFEncoder(); //create a new GIFEncoder for every new job
    encoder.setRepeat(msg.repeat)
    encoder.setDelay(msg.delay)
    if(msg.frame_index == 0){
      encoder.start();
    }else{
      //*encoder.setProperties(true, true); //started, firstFrame
      encoder.setProperties(true, false); //started, firstFrame
    }
    
    encoder.setSize(msg.width, msg.height);
    //encoder.addFrame(imageData, true);
    encoder.addFrame(new Uint8ClampedArray(msg.imageData), true);
    if(msg.frame_length == msg.frame_index+1){
      encoder.finish()
    }
    //var temp = 'data:image/gif;base64,'+encode64(encoder.stream().getData())
    
    postMessage(encoder.stream().getData()) //on the page, search for the GIF89a to see the frame_index
};