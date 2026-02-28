import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSwagger
} from "@effect/platform"
import { BunRuntime, BunHttpServer} from "@effect/platform-bun"
import { handler } from "@effect/platform/HttpApiBuilder";
import { Effect, Layer, Schema } from "effect"
import { createServer } from "node:http"

const EnextApi = HttpApi.make("Enext").add(
  HttpApiGroup.make("render").add(
    HttpApiEndpoint.get("first")`/`.addSuccess(Schema.String)
  )
);

const EnextApi_Live = HttpApiBuilder.group(EnextApi, "render", (handlers) => 
handlers.handle("first", () => Effect.succeed("Hello World"))
)

const EnextSrverLive = HttpApiBuilder.api(EnextApi).pipe(Layer.provide(EnextApi_Live));

const serverLive = HttpApiBuilder.serve().pipe(
  Layer.provide(EnextSrverLive),
  Layer.provide(BunHttpServer.layer(createServer))
);

Layer.launch(serverLive).pipe(BunRuntime.runMain)