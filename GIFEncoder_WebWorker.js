function GIFEncoder_WebWorker() {
    
    var exports = {}
    
    var init = exports.init = function init() {
        this.repeat = 0
        this.delay = 500
        this.frames = []
    }
    
    var setRepeat = exports.setRepeat = function setRepeat(repeat) {
        this.repeat = repeat
    }
    
    var setDelay = exports.setDelay = function setDelay(delay) {
        this.delay = delay
    }
    
    var addFrame = exports.addFrame = function addFrame(im/*BitmapData*/, is_imageData)/*Boolean*/ {
        this.frames.push(im)
        return true;
    }

    var start = exports.start = function start() {
         return true;       
    }
    
    var finish_sync = exports.finish_sync = function finish_sync(cba) {
        var encoder = new window.GIFEncoder();
        encoder.setRepeat(this.repeat); //auto-loop
        encoder.setDelay(this.delay);
        encoder.start();
         for (var i=0; i<this.frames.length; i++) {
            encoder.addFrame(this.frames[i]);
        }
        encoder.finish();
        cba(null, encoder.stream().getData())
    }
    
    var finish_async = exports.finish_async = function finish_async(cba) {
        var animation_parts = new Array(this.frames.length);
        
        var crew = new WorkCrew('../jsgif/worker.js', 8);
        crew.oncomplete = function(result) {
            console.log("done: " + result.id)
            animation_parts[result.id] = result.result.data;
        };
        
        crew.onfinish = function() {
            console.log("done all")
            crew.clean();
            var res = animation_parts.join('')
            cba(null, res)
        };
      
        
        for (var j=0; j<this.frames.length; j++) {
            var curr = this.frames[j]
            var imdata = curr.getImageData(0,0,curr.canvas.width, curr.canvas.height)
            var len = curr.canvas.width * curr.canvas.height * 4;
            var imarray = [];
            for(var i = 0; i < len; i++){
              imarray.push(imdata.data[i]);
            }
            
            var msg = j + ';' + this.frames.length + ';' + curr.canvas.width + ';' + curr.canvas.height + ';' + this.repeat + ';' + this.delay + ';' + imarray.join(',')
            var id = crew.addWork(msg);
            console.log("addWork");
        }
    }
    
    /*
     var finish_async = exports.finish_async = function finish_async(cba) {
        var animation_parts = new Array(this.frames.length);
        var animations_parts_done = 0;
        var frames_count= this.frames.length;
        
        var workerMessage = function(idx) {
            return function(msg) {
               
                if (msg.data.length<50) return;
                    
                    
                animation_parts[idx] = msg.data;
                if (++animations_parts_done==frames_count) {
                    var res = animation_parts.join('')
                    cba(null, res)
                }
            }    
        }
        
        for (var j=0; j<this.frames.length; j++) {
            
            var curr = this.frames[j]
            var imdata = curr.getImageData(0,0,curr.canvas.width, curr.canvas.height)
            var len = curr.canvas.width * curr.canvas.height * 4;
            var imarray = [];
            for(var i = 0; i < len; i++){
              imarray.push(imdata.data[i]);
            }
            
            var worker = new Worker("../worker.js");
            worker.onmessage = workerMessage(j);
            var msg = j + ';' + this.frames.length + ';' + curr.canvas.width + ';' + curr.canvas.height + ';' + this.repeat + ';' + this.delay + ';' + imarray.join(',')
            worker.postMessage(msg)
            
        }
    }
     */
    
    exports.init()
    return exports;
}


          