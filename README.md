# elixi.re uploader/shortener by [hokkqi](https://werewolf.computer)

this is a module for the main [elixire](https://gitlab.com/elixire/elixire) instance as well as self-hosted instances

```js
import Elixire from "elixire"; // for TS
let elixire = require("elixire"); // for nodejs

let Uploader = new Elixire({
  instance_url: "<Instance URL here>", //defaults to elixi.re
  apikey: "<API Key here>",
});

let File = fs.readFileSync("./assets/chibi.png"); // or another way to get the Buffer of an Image
let URL = "https://werewolf.computer";

Uploader.Upload({ buffer: File }).then((r) => console.log(r));
/* 
returns {
    url: string,
    shortlink: string,
    delete_url: string
}
*/
Uploader.Shorten({ url: URL }).then((r) => console.log(r));
/* 
returns {
    url: string
}
*/
```
