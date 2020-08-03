import * as pkg from "./package.json";
import {
  Options,
  UploadInput,
  UploadOutput,
  ShortenInput,
  ShortenOutput,
} from "./typings";
import { post } from "chainfetch";
import { parse as parseURL } from "url";

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
}

export = Elixire;
