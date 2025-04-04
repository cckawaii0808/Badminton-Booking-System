import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 引入Bootstrap CSS
import "bootstrap/dist/css/bootstrap.css";

const app = createApp(App);

// 提供 store，但不使用 app.use
app.provide('store', store);
app.use(router);

app.mount("#app");
