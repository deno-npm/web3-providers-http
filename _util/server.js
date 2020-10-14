import {
  serve,
} from "https://deno.land/std@0.74.0/http/mod.ts";

const server = serve({
  hostname: "127.0.0.1",
  port: 8000,
});

postMessage("All set");

for await (const request of server) {
  const url = request.url.slice(1);
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  await new Promise((resolve) => setTimeout(() => resolve(), 700));

  switch(url){
    case 'json':
      request.respond({ 
        body: encoder.encode(JSON.stringify({hey: 'ya'}))
      });
      break;
    case 'mirror':
      request.respond({ 
        body: await Deno.readAll(request.body),
      });
      break;
    default:
      request.respond({ 
        body: encoder.encode("Error"),
        status: 500,
      });
  }
}