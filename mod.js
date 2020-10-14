/*
  This file is part of web3.js.

  web3.js is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  web3.js is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import { errors } from "https://deno.land/x/npm_web3_core_helpers@0.0.1/mod.js";
import http from "https://raw.githubusercontent.com/Soremwar/deno/http/std/node/http.js";
import https from "https://raw.githubusercontent.com/Soremwar/deno/http/std/node/https.js";

class TimeoutError extends Error {}

class InvalidJSONError extends Error {}

/**
 * HttpProvider should be used to send rpc calls over http
 */
export default class HttpProvider {
  constructor(host, options = {}) {
    this.withCredentials = options.withCredentials || false;
    this.timeout = options.timeout || 0;
    this.headers = options.headers;
    this.agent = options.agent;
    this.connected = false;

    // keepAlive is true unless explicitly set to false
    const keepAlive = options.keepAlive !== false;
    this.host = host || "http://localhost:8545";
    if (!this.agent) {
      if (this.host.substring(0, 5) === "https") {
        this.httpsAgent = new https.Agent({ keepAlive });
      } else {
        this.httpAgent = new http.Agent({ keepAlive });
      }
    }
  }

  /**
   * Should be used to make async request
   *
   * @method send
   * @param {Object} payload
   * @param {Function} callback triggered on end with (err, result)
   */
  send(payload, callback) {
    const headers = this.headers
      ? this.headers.map(({name, value}) => [name, value])
      : [];

    let expired = false;

    if(this.timeout){
      setTimeout(() => {
        expired = true
      }, this.timeout);
    }

    fetch(this.host, {
      credentials: this.withCredentials ? 'include' : undefined,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        ...Object.fromEntries(headers),
      },
      method: "POST",
    })
      .then(async (response) => {
        if(response.ok && !expired){
          this.connected = true;
          try{
            callback(null, await response.json());
          }catch(_e){
            throw new InvalidJSONError();
          }
        }else if(expired){
          throw new TimeoutError();
        }else{
          throw new Error();
        }
      })
      .catch((e) => {
        if(e instanceof TimeoutError){
          this.connected = false;
          callback(errors.ConnectionTimeout(this.timeout));
        } else if(e instanceof InvalidJSONError){
          callback(errors.InvalidResponse(e.message?.text));
        }else{
          this.connected = false;
          callback(errors.InvalidConnection(this.host));
        }
      });
  }

  disconnect() {
    //NO OP
  }

  /**
   * Returns the desired boolean.
   *
   * @method supportsSubscriptions
   * @returns {boolean}
   */
  supportsSubscriptions(){
    return false;
  }
}
