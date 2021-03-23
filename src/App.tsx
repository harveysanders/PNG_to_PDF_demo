import React, { SyntheticEvent, useState } from "react";
import { jsPDF } from "jspdf";
import "./App.css";

function handleUpload(setImg: React.Dispatch<any>) {
  return async (e: SyntheticEvent<HTMLInputElement>) => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
      };
      img.src = event?.target?.result as string;
      setImg(canvas);
    };
    // @ts-ignore
    reader.readAsDataURL(e.target.files[0]);
  };
}

const handleClick = async (c?: HTMLCanvasElement | null) => {
  if (!c) return;
  let pdf;
  let width = c.width;
  let height = c.height;

  //set the orientation
  if (width > height) {
    pdf = new jsPDF("l", "px", [width, height], true);
  } else {
    pdf = new jsPDF("p", "px", [height, width], true);
  }
  //then we get the dimensions from the 'pdf' file itself
  width = pdf.internal.pageSize.getWidth();
  height = pdf.internal.pageSize.getHeight();
  pdf.addImage(c, "PNG", 0, 0, width, height);
  pdf.save("download.pdf");
};

function App() {
  const [img, setImg] = useState<HTMLCanvasElement>();
  return (
    <div className="App">
      <header className="App-header">
        <input onChange={handleUpload(setImg)} type="file"></input>
        <button onClick={handleClick.bind(null, img)}>Download</button>
      </header>
      <canvas id="canvas" />
    </div>
  );
}

export default App;
