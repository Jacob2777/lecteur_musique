import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import * as app from './app.js'


const root = {
    setup() {
        return app
    }
}

createApp(root).mount("#app")