# elixi.re uploader/shortener by [hokkqi](https://werewolf.computer)

this is a module for the main [elixire](https://gitlab.com/elixire/elixire) instance as well as self-hosted instances

```js
import Elixire from "elixire"; 
// OR 
let Elixire = require("elixire");

let Uploader = new Elixire({
  instance_url: "<Instance URL here>",// optional, defaults to elixi.re
  apikey: "<API Key here>", // needed
});

let File = fs.readFileSync("./404.png"); // or another way to get the Buffer of an Image
let URL = "https://himbo.cat";

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
