import { createApp } from 'vue'
import App from './App.vue'
import SvgIcon from '@/components/svgIcon'
import '@/styles/index.less'
import 'virtual:svg-icons-register'

const app = createApp(App)

app.component('svg-icon', SvgIcon)

app.mount('#app')
