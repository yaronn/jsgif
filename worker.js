

importScripts('https://anigif-c9-yaronn01.c9.io/jsgif/GIFEncoder.js', 'https://anigif-c9-yaronn01.c9.io/jsgif/LZWEncoder.js', 'https://anigif-c9-yaronn01.c9.io/jsgif/NeuQuant.js', 'https://anigif-c9-yaronn01.c9.io/jsgif/Demos/b64.js')

onmessage = function (msg) {
    
    var frame_index,
        frame_length,
        height, 
        width,
        repeat,
        delay,
        imageData; //get it from onmessage

    
    var arr = msg.data.split(';');
    frame_index = Number(arr[0])
    frame_length = Number(arr[1])
    height = Number(arr[2])
    width = Number(arr[3])
    repeat = Number(arr[4])
    delay = Number(arr[5])
    imageData = arr[6].split(',').map(Number)
    
    var encoder = new GIFEncoder(); //create a new GIFEncoder for every new job
    encoder.setRepeat(repeat)
    encoder.setDelay(delay)
    if(frame_index == 0){
      encoder.start();
    }else{
      //*encoder.setProperties(true, true); //started, firstFrame
      encoder.setProperties(true, false); //started, firstFrame
    }
    
    encoder.setSize(height, width);
    encoder.addFrame(imageData, true);
    if(frame_length == frame_index+1){
      encoder.finish()
    }
    //var temp = 'data:image/gif;base64,'+encode64(encoder.stream().getData())
    postMessage(encoder.stream().getData()) //on the page, search for the GIF89a to see the frame_index
};