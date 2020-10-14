import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.74.0/testing/asserts.ts";
import {
  mustCall,
} from "https://raw.githubusercontent.com/Soremwar/deno/duplex/std/node/_utils.ts";
import Provider from "./mod.js";

const worker = new Worker(
  new URL("./_util/server.js", import.meta.url),
  { type: "module", deno: true },
);

let server_running = false;

worker.onmessage = () => {
  server_running = true;
};

worker.onerror = () => {
  throw new Error("Server not started");
}

worker.postMessage("");

async function awaitServerStart (){
  await new Promise(resolve => setTimeout(resolve, 100));
  if(!server_running){
    await awaitServerStart();
  }
}

await awaitServerStart();

Deno.test({
  name: "Test http server",
  fn: async () => {
    const provider = new Provider('http://127.0.0.1:8000/mirror');

    const request = {'x': 'y'};

    const [send_executed, send_cb] = mustCall((e, response) => {
      assert(!e);
      assertEquals(request, response);
    });

    provider.send(request, send_cb);

    await send_executed;
  },
  sanitizeOps: false,
  sanitizeResources: false,
});

Deno.test({
  name: "Finish",
  fn: async () => {
    worker.terminate();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});
