class AudioVisualizer {
    constructor(canvasElement) {
      this.canvas = canvasElement;
      this.canvasCtx = this.canvas.getContext('2d');
      this.WIDTH = this.canvas.width;
      this.HEIGHT = this.canvas.height;
      this.canvasCtx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
      this.gradient = this.canvasCtx.createLinearGradient(0, 0, this.WIDTH, 0);
      this.gradient.addColorStop(0, '#00FFFF');
      this.gradient.addColorStop(1, '#FF00FF');
    }
  
    draw(dataArray) {
      this.canvasCtx.fillStyle = 'rgba(10, 14, 31, 0.2)';
      this.canvasCtx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
  
      const barWidth = (this.WIDTH / dataArray.length) * 2.5;
      let barHeight;
      let x = 0;
  
      for (let i = 0; i < dataArray.length; i++) {
        barHeight = dataArray[i] / 2;
  
        this.canvasCtx.fillStyle = this.gradient;
        this.canvasCtx.fillRect(x, this.HEIGHT - barHeight, barWidth, barHeight);
  
        x += barWidth + 1;
      }
    }
  }