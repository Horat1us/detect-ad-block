import { DetectPlugin } from "./DetectPlugin";

function Check(url: string, mode: 'ajax' | 'script'): Promise<boolean> {
    return new Promise<boolean>((end) => {
        if (mode === 'ajax') {
            var readyStates = [ false, false, false, false ];
            var status: null | number = null;
            var respond = function (responseForce?: boolean) {
                if (responseForce !== undefined) {
                    end(responseForce);
                } else {
                    if (status === 0) {
                        end(true);
                        return;
                    }
                    for (var i = 0; i < 4; i++) {
                        if (readyStates[ i ] === false) {
                            end(true);
                            return;
                        }
                    }
                    end(false);
                }
            };
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                readyStates[ xmlHttp.readyState - 1 ] = true;
                try {
                    status = xmlHttp.status;
                } catch (e) {
                }
                if (xmlHttp.readyState === 4) {
                    respond();
                }
            };
            try {
                xmlHttp.open('GET', url, true);
                xmlHttp.send();
            } catch (e) {
                if (e.result == '2153644038') {
                    respond(true);
                }
            }
        } else if (mode === 'script') {
            var element = document.createElement('script');
            element.src = url;
            element.onerror = function () {
                end(true);
                window.document.body.removeChild(element);
            };
            element.onload = function () {
                end(false);
                window.document.body.removeChild(element);
            };
            window.document.body.appendChild(element);
        } else {
            end(false);
        }
    });
}

export interface HttpOptions {
    name?: string;
    baitUrl: string;
    baitMode: "ajax" | "script";
}

export const HttpAjaxOptions: HttpOptions = Object.freeze<HttpOptions>({
    baitUrl: '/ad/banner/_adsense_/_adserver/_adview_.ad.json?adzone=top&adsize=300x250&advid={RANDOM}',
    baitMode: "ajax",
});
export const HttpScriptOptions: HttpOptions = Object.freeze<HttpOptions>({
    baitUrl: '/ad/banner/_adsense_/_adserver/_adview_.ad.js?adzone=top&adsize=300x250&advid={RANDOM}',
    baitMode: "script",
});

export function Http(options: HttpOptions): DetectPlugin {
    return {
        detect: function HttpDetectPlugin(resolve: (result: boolean) => void) {
            Check(options.baitUrl.replace('{RANDOM}', Number(new Date).toString()), options.baitMode)
                .then(resolve);
        },
        name: "detect-ad-block/http" + (options.name || (":" + options.baitMode)),
        version: 1,
    };
}

export const ajax = Http(HttpAjaxOptions);
export const script = Http(HttpScriptOptions);
