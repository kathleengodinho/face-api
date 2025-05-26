async function start() {
    console.log('Iniciando Face API...');
  
    // Carrega o modelo
    await faceapi.nets.ssdMobilenetv1.loadFromUri('models');
  
    const img = document.getElementById('inputImage');
  
    // Cria o canvas sobre a imagem
    const canvas = faceapi.createCanvasFromMedia(img);
    document.body.appendChild(canvas);
  
    const displaySize = { width: img.width, height: img.height };
    faceapi.matchDimensions(canvas, displaySize);
  
    const detections = await faceapi.detectAllFaces(img);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
  
    faceapi.draw.drawDetections(canvas, resizedDetections);
  
    console.log('Quantidade de rostos detectados:', detections.length);
  
    // BONUS: calcular área de cada face para estimar distância
    const facesWithSize = resizedDetections.map((detection, index) => {
      const { x, y, width, height } = detection.box;
      const area = width * height;
      return { index, box: { x, y }, area };
    });
  
    const sortedFaces = facesWithSize.sort((a, b) => b.area - a.area);
  
    console.log("Rostos ordenados por proximidade (mais próximo primeiro):");
    sortedFaces.forEach((face) => {
      console.log(`#${face.index} → Distância relativa: ${(1000 / face.area).toFixed(2)}`);
    });
  
    const ctx = canvas.getContext("2d");
    sortedFaces.forEach((face) => {
      const { x, y } = face.box;
      ctx.fillStyle = "red";
      ctx.font = "16px Arial";
      ctx.fillText(`Dist: ${(1000 / face.area).toFixed(2)}`, x, y - 10);
    });
  }
  
  window.onload = start;
  