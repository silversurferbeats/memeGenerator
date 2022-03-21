import React, { useState, useEffect } from "react";
import { Meme } from "./components/Meme";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import './styles/style.css'
import { motion } from 'framer-motion';

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
    return (
      <div style={{ textAlign: "center" }}>
        <img style={{ width: 200 }} src={meme} alt="custom meme" />
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      {template && (
        <section>
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
        </section>
      )}
      {!template && (
        <>
          <h1 className='titulo' >PERSONALIZA TUS MEMES</h1>
          <h2 className='parrafo' >Elige tu meme favorito:</h2>
          <motion.div className='slider-container'>
                <motion.div 
                  className='slider' 
                  drag='x' 
                  dragConstraints={{right: 0, left: -2123}} 
                >
                {templates.map((template, index) => {
                  return(
                    <motion.div className='item'>
                      {console.log('lo que me trae del map =>', template.url)}
                      <Meme
                        className="Meme"
                        key={index}
                        template={template}
                        onClick={() => {
                          setTemplate(template);
                        }}
                      />
                    </motion.div>
                  )
                })}
                </motion.div>
              </motion.div>
        </>
      )}
    </div>
  );
}

export default App;
