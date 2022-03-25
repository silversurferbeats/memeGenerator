import React, { useState, useEffect } from "react";
import { Meme } from "./components/Meme";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import './styles/style.css'
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';


const objectToQueryParam = obj => {
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
    fetch("https://api.imgflip.com/get_memes")
    .then(x =>
      x.json()
      .then(response => setTemplates(response.data.memes))
    );
  }, []);

  if (meme) {
    function downloadImage(meme){
      // const fs = require('fs');
      // const request = require('request');

      // return request(meme).pipe(fs.createWriteStream('./meme.png'));
      var imgURL = meme;
      var a = document.createElement('a');
      a.href = 'data:application/octet-stream,' + encodeURIComponent(imgURL);
      a.download = "miimagen.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    return (
      <div style={{ textAlign: "center" }}>
        <form>
          <a href={meme} download='Meme.png'>
            <img style={{ width: 200 }} src={meme} alt="custom meme" />
          </a>
          <Button type="button" onClick={downloadImage}>Descargar</Button>
        </form>
      </div>
    );
  }

  return (
    <>
      <div style={{ textAlign: "center" }}>
        {template && (
          <section>
            <Tilt>
              <div className="contenedor">
                  <form
                      onSubmit={async e => {
                      e.preventDefault();
                      // add logic to create meme from api
                      const params = {
                          template_id: template.id,
                          text0: topText,
                          text1: bottomText,
                          username: process.env.REACT_APP_USERNAME,
                          password: process.env.REACT_APP_PASSWORD
                      };
                      const response = await fetch(
                          `https://api.imgflip.com/caption_image${objectToQueryParam(params)}`
                      );
                      const json = await response.json();
                      setMeme(json.data.url);
                      }}
                  >
                      <Meme className='memeTemplate' template={template} />

                      <TextField 
                      label="primera parte"
                      value={topText}
                      onChange={e => setTopText(e.target.value)}
                      
                      />
                      <TextField 
                      label="segunda parte"
                      value={bottomText}
                      onChange={e => setBottomText(e.target.value)}
                      />
                      
                      <Button type="submit">crear meme</Button>
                  </form>
              </div>
            </Tilt>
          </section>
        )}
        {!template && (
          <>
            <h1 className='titulo' >PERSONALIZA TUS MEMES</h1>
            <h2 className='parrafo' >Elige tu meme favorito:</h2>
            <motion.div className='slider-container'>
                  <motion.div 
                    className='slider' 
                    drag='y' 
                    //dragConstraints={{right: 0, left: -2123}} 
                  >
                  {templates.map((template) => {
                    return(
                      <motion.div 
                        className='item'
                        key={template.id}
                        onClick={() => {
                          setTemplate(template);
                        }}
                      >
                        <Meme
                          className="Meme"
                          template={template}
                        />
                      </motion.div>
                    )
                  })}
                  </motion.div>
            </motion.div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
