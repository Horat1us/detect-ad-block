# Detect Ad Block
Simple module to detect advertising block add-on in browser using Promise.

 - Promise-based
 - TypeScript
 - ESM/CommonJS support

*Require *Promise* to be supported or polifylled.*

Inspired by [FuckAdBlock@4.0.0-beta3](https://github.com/sitexw/FuckAdBlock/tree/4.0.0-beta.3).

## Installation
Using [npm](https://npmjs.com/package/detect-ad-block):
```bash
npm i @horat1us/detect-ad-block@^1.0
```

## Usage

```javascript
import { DetectAdBlock } from "@horat1us/detect-ad-block";

function detect() {
    const detectAdBlock = DetectAdBlock();
    detectAdBlock.perform({ timeout: 1000 })
        .then((result) => {
            console.log(result ? `AdBlock Detected` : `AdBlock Not Found`);
        })
        .catch((error) => {
            console.error(`Error while AdBlock checking: `, error);
        });
}
const timeout = 5000;

// You may use window.onload, document.onreadystatechange etc.
if (window.requestIdleCallback) {
    window.requestIdleCallback(detect, timeout);
} else {
    setTimeout(detect, timeout)
}
```

*Note: You should not run adblock checking directly on or after page load.*

### DetectPlugin
You may use built-in plugins:
- [http:ajax](./src/plugins/Http.ts) *(default)* - http request block detection using XMLHttpRequest (AJAX)
- [html](./src/plugins/Html.ts) *(default)* - html element block detection
- [http:script](./src/plugins/Http.ts) - http request block detection using script tag (<script src="/ad/.... />)

Also, you may implement custom plugin using [DetectPlugin](./src/plugins/DetectPlugin.ts) interface.

```javascript
import { DetectAdBlock, plugins } from "@horat1us/detect-ad-block";

const detectAdBlock = DetectAdBlock([
    // your plugins list
    plugins.ajax,
    plugins.script,
    plugins.html,
    // using built-in plugin with custom options
    plugins.Html({
        name: "custom-html",
        baitStyle: "...",
        baitClass: "...",
        interval: 100,
        timeout: 950,
    }),
    // or custom plugin
    {
        name: "custom-plugin",
        version: 1,
        detect(resolve) {
            const result = performSomeCheck();
            resolve(result);
        },
    },
])
```

## Contributors
- [Alexander <horat1us> Letnikow](mailto:reclamme@gmail.com)
- [Valentin Allaire](mailto:valentin.allaire@sitexw.fr) - as author of [FuckAdBlock](https://github.com/sitexw/FuckAdBlock)

## License
[MIT](./LICENSE)
