import * as pkg from "./package.json";
import {
  Options,
  UploadInput,
  UploadOutput,
  ShortenInput,
  ShortenOutput,
} from "./typings";
import { post, get } from "chainfetch";
import { parse as parseURL } from "url";
import Armpits from '@sniff/armpits'
let Armpit = new Armpits()

function isEmptyObject(obj) {
  var name;
  for (name in obj) {
    if (obj.hasOwnProperty(name)) {
      return false;
    }
  }
  return true;
}

function handleError(status: number) {
  switch (status) {
    // Error Codes
    case 200:
      break;
    case 400: {
      throw new Error("Your Input data was not understood by the Server");
    }
    case 403: {
      throw new Error("Your APIKey/Username/Password is invalid");
    }
    case 404: {
      throw new Error("Files or Shorten not found");
    }
    case 420: {
      throw new Error("Banned from the Service.");
    }
    case 429: {
      throw new Error("You have been ratelimited!");
    }
    case 503: {
      throw new Error("This part of the Instance is turned off.");
    }
    // Upload Specific
    case 415: {
      throw new Error("Bad or Unsupported File.");
    }
    case 412: {
      throw new Error("No Files were given.");
    }
    case 469: {
      throw new Error(
        "Your Quota has been exceeded or this file would exceed your quota if uploaded."
      );
    }

    default:
      console.log(status);
      break;
  }
}

function sleep(s) {
  return new Promise(resolve => setTimeout(resolve, 1000 * s));
}

async function recursiveFetch(a, ind, ret: any[]) {
  let i = ind
  let res = await get(`${a.instance}/api/list?page=${i}`)
    .set("Authorization", a.options.apikey)
    .set("User-Agent", a.options.useragent).catch(async e => {
      if (e.status === 429) {
        // console.log(e.headers)
        // console.log(e.body)
        await sleep(e.body.retry_after)
        recursiveFetch(a, ind, ret)
      } else {
        return console.error(e)
      }
    })
  let remaining = res.headers.get('x-ratelimit-remaining')
  if (remaining === '1') {
    await sleep(a.options.sleep)
  }
  if (isEmptyObject(res.body.files)) return ret.values().next().value
  else {
    ret.push(res.body.files)
    // console.log(ret.length)
    // await sleep(1)
    return recursiveFetch(a, i + 1, ret)

  }
}

class Elixire {
  private instance: string;
  options: Options;
  constructor(options: Partial<Options>) {
    if (!options) options = {};
    this.options = {
      useragent:
        options.useragent ||
        `node-elixire/${pkg.version} (werewolf.design/elixire)`,
      instance_url: options.instance_url || "elixi.re",
      sleep: options.sleep || 5,
      apikey: options.apikey || undefined,
    };
    this.instance = `https://${this.options.instance_url}`;
  }
  // Upload
  /**
   * Upload Images to a Elixire Instance
   * @param {object} UploadOptions - takes an Image Buffer inside of an Object
   *
   */
  async Upload(UploadOptions: UploadInput): Promise<UploadOutput> {
    let res = await post(`${this.instance}/api/upload`)
      .set("Authorization", this.options.apikey)
      .set("User-Agent", this.options.useragent)
      .attach("hewwo", UploadOptions.buffer, "uwu.png");
    handleError(res.status);
    return res.body;
  }
  /**
   * Shorten a URL
   * @param ShortenOptions - takes a URL inside of an object
   */
  async Shorten(ShortenOptions: ShortenInput): Promise<ShortenOutput> {
    let URL = parseURL(ShortenOptions.url);
    if (!URL.protocol.includes("http" || "https"))
      throw new Error("Please specify a Protocol (http/https)");

    let res = await post(`${this.instance}/api/shorten`)
      .set("Authorization", this.options.apikey)
      .set("User-Agent", this.options.useragent)
      .send({ url: ShortenOptions.url });

    handleError(res.status);

    return res.body;
  }
  async listFiles(): Promise<[]> {
    Armpit.info(`Fetching upload list from ${this.instance}/api/list`)
    Armpit.info(`Make sure to save the response from this Function (somehow) otherwise it will go to waste`)
    let x = await recursiveFetch(this, 0, [])
    return x
  }
}

export = Elixire;
