getUserMedia = e => {
    e.preventDefault();
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(mediaStream => {
        document.querySelector("video").srcObject = mediaStream;
        const track = mediaStream.getVideoTracks()[0];
        // console.log(mediaStream.getVideoTracks()[0])
        // imageCapture = new ImageCapture(track);
        this.setState({ isCameraPlaying: true, isGetUserMedia: false, isPhotoTaken: false, track });
        this.setState({ imageCapture: new ImageCapture(track) });
      })
      .catch(error => console.log(error));
  };
  takePhoto = e => {
    e.preventDefault();
    const track = this.state.track;
    this.state.imageCapture
      .takePhoto()
      .then(blob => {
        let b = new File([blob], "image.jpeg", { type: "image/jpeg" });
        this.addFile(b);
        return createImageBitmap(blob);
      })
      .then(imageBitmap => {
        console.log("imageBitmap ", imageBitmap);
        this.setState({ isPhotoTaken: true, isCameraPlaying: false });
        const canvas = document.querySelector("#takePhotoCanvas");
        this.drawCanvas(canvas, imageBitmap);
        track.stop();
        console.log("I got here take photo");
      })
      .catch(error => console.log(error));
  };
  drawCanvas = (canvas, img) => {
    canvas.width = getComputedStyle(canvas).width.split("px")[0];
    canvas.height = getComputedStyle(canvas).height.split("px")[0];
    let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
    let x = (canvas.width - img.width * ratio) / 2;
    let y = (canvas.height - img.height * ratio) / 2;
    console.log("canvas ", canvas, canvas.width, canvas.height, ratio);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    canvas
      .getContext("2d")
      .drawImage(img, 0, 0, img.width, img.height, x, y, img.width * ratio, img.height * ratio);
  };
  addFile = file => {
    let newfiles = [];
    if (file.size > 15000000) {
      //return error code
      return;
    } else {
      newfiles.push({
        file: file,
        url: window.URL.createObjectURL(file),
        isCover: true,
        pos: 1
      });
      this.setState({ uploadedPhoto: file,imageCameraUrl:window.URL.createObjectURL(file) });
    }
  };


  //


  <div>
  <div className="form__label">Take Picture</div>
  <div className="post-pictures" ref={this.imageRef}>
    <React.Fragment>
      {this.state.isGetUserMedia && (                     
        <label className="each-picture" htmlFor="post-photo" onClick={this.getUserMedia} >
          <img className="each-imags pntr" src="Images/camera.svg" alt=""
            style={{
              width: 'calc(50% - 10px)',
              margin: '0px 10px 20px !important',
              background: '#f1f1f1',
              borderRadius: '5px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '180px',
              cursor: 'pointer', position: 'relative'
            }}
          />
        </label>
      )}
      <div className={` ${this.state.isCameraPlaying ? "" : "hide"}`}   >
        <video autoPlay className="cameraVideo"></video>
        <a className="take-photo" onClick={this.takePhoto} href="/#">
          <img src="Images/camera-white.svg" alt=""
            style={{
              width: 'calc(50% - 10px)',
              margin: '0px 10px 20px !important',
              background: '#f1f1f1',
              borderRadius: '5px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '180px',
              cursor: 'pointer', position: 'relative'
            }} />
        </a>
      </div>
      <div   >
        <div className="capturePic">
          <canvas id="takePhotoCanvas" className={this.state.isPhotoTaken ? "" : "hide"}></canvas>
          <span className={`take-photo ${this.state.isPhotoTaken ? "" : "hide"}`} onClick={this.getUserMedia}>
            <img src="Images/reload-white.svg" style ={{width:'50px'}} alt=""
               />
          </span>
        </div>
      </div>