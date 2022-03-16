import React, { useState, useEffect } from "react";
import { Meme } from "./components/Meme";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";

import './styles/style.css'

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
          <Meme template={template} />

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
      )}
      {!template && (
        <>
          <h1 className='titulo' >PERSONALIZA TUS MEMES</h1>
          <h2 className='parrafo' >Elige tu meme favorito:</h2>
          {templates.map((template, index) => {
            return (
              <Meme
                key={template.id}
                template={template}
                onClick={() => {
                  setTemplate(template);
                }}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

export default App;
