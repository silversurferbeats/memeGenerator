import React, { useState, useEffect } from "react";
import { Meme } from "./components/Meme";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import "./styles/style.css";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

const objectToQueryParam = (obj) => {
  const params = Object.entries(obj).map(([key, value]) => `${key}=${value}`);
  return "?" + params.join("&");
};

function App() {
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [meme, setMeme] = useState(null);
  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes").then((x) =>
      x.json().then((response) => setTemplates(response.data.memes))
    );
  }, []);

  if (meme) {
    function downloadImage(meme) {
      // const fs = require('fs');
      // const request = require('request');

      // return request(meme).pipe(fs.createWriteStream('./meme.png'));
      var imgURL = meme;
      var a = document.createElement("a");
      a.href = "data:application/octet-stream," + encodeURIComponent(imgURL);
      a.download = "miimagen.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    return (
      <div style={{ textAlign: "center" }}>
        <form>
          <a href={meme} download="Meme.png">
            <img style={{ width: 200 }} src={meme} alt="custom meme" />
          </a>
          <Button type="button" onClick={downloadImage}>
            Descargar
          </Button>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className="app-container">
        {template && (
          <section>
            <Tilt>
              <div className="contenedor">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    // add logic to create meme from api
                    const params = {
                      template_id: template.id,
                      text0: topText,
                      text1: bottomText,
                      username: process.env.REACT_APP_USERNAME,
                      password: process.env.REACT_APP_PASSWORD,
                    };
                    const response = await fetch(
                      `https://api.imgflip.com/caption_image${objectToQueryParam(
                        params
                      )}`
                    );
                    const json = await response.json();
                    setMeme(json.data.url);
                  }}
                >
                  <Meme className="memeTemplate" template={template} />

                  <TextField
                    label="primera parte"
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                  />
                  <TextField
                    label="segunda parte"
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                  />

                  <Button type="submit">crear meme</Button>
                </form>
              </div>
            </Tilt>
          </section>
        )}
        {!template && (
          <>
            <h1 className="titulo">X-TREMEME</h1>

            <h2 className="parrafo">Elige tu meme favorito:</h2>
            <motion.div className="slider-container">
              <motion.div
                className="slider"
                drag="x"
              >
                {templates.map((template) => {
                  return (
                    <motion.div
                      className="item"
                      key={template.id}
                      onClick={() => {
                        setTemplate(template);
                      }}
                    >
                      <Meme className="Meme" template={template} />
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </>
        )}
      </div>
      <div class="wave-header">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#0099ff"
            fill-opacity="1"
            d="M0,32L20,26.7C40,21,80,11,120,42.7C160,75,200,149,240,192C280,235,320,245,360,218.7C400,192,440,128,480,90.7C520,53,560,43,600,74.7C640,107,680,181,720,208C760,235,800,213,840,192C880,171,920,149,960,154.7C1000,160,1040,192,1080,186.7C1120,181,1160,139,1200,128C1240,117,1280,139,1320,154.7C1360,171,1400,181,1420,186.7L1440,192L1440,320L1420,320C1400,320,1360,320,1320,320C1280,320,1240,320,1200,320C1160,320,1120,320,1080,320C1040,320,1000,320,960,320C920,320,880,320,840,320C800,320,760,320,720,320C680,320,640,320,600,320C560,320,520,320,480,320C440,320,400,320,360,320C320,320,280,320,240,320C200,320,160,320,120,320C80,320,40,320,20,320L0,320Z"
          ></path>
        </svg>
      </div>
    </>
  );
}

export default App;
