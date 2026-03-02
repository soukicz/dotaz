import { setTransport } from "../frontend-shared/lib/transport";
import { setStorage } from "../frontend-shared/lib/storage";
import { setCapabilities } from "../frontend-shared/lib/capabilities";
import { setShortcutMode } from "../frontend-shared/lib/keyboard";
import { createInlineTransport } from "./transport";
import { RpcAppStateStorage } from "../frontend-shared/lib/storage/rpc";
import "../frontend-shared/styles/global.css";
import { render } from "solid-js/web";
import App from "../frontend-shared/App";

setTransport(createInlineTransport());
setStorage(new RpcAppStateStorage());
setCapabilities({ hasFileSystem: false, hasHttpStreaming: false, hasNativeDialogs: false });
setShortcutMode("browser");
render(() => <App />, document.getElementById("app")!);
