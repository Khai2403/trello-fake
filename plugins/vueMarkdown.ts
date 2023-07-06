import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

export default defineNuxtPlugin((nuxtApp) => {
    // nuxtApp.vueApp.component('markdownEditor', MdEditor);
    nuxtApp.vueApp.component('markdownPreview', MdPreview);
  })