import { DetectPlugin } from "./DetectPlugin";

export interface HtmlOptions {
    name: string;
    baitClass: string;
    baitStyle: string;
    interval: number;
    timeout: number,
}

export const HtmlDefaultOptions: HtmlOptions = Object.freeze<HtmlOptions>({
    name: "",
    baitClass: 'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links',
    baitStyle: 'width:1px!important;height:1px!important;position:absolute!important;left:-10000px!important;top:-1000px!important;',
    interval: 50,
    timeout: 950,
});

interface Bait {
    element: HTMLDivElement;

    append(parent?: HTMLElement): void;

    check(): boolean;

    remove(): void;
}
function Bait(className: string, style: string): Bait {
    const element = window.document.createElement('div');
    element.setAttribute('class', className);
    element.setAttribute('style', style);
    element.offsetParent;
    element.offsetHeight;
    element.offsetLeft;
    element.offsetTop;
    element.offsetWidth;
    element.clientHeight;
    element.clientWidth;

    function append(parent = window.document.body): void {
        parent.appendChild(element);
    }
    function check(): boolean {
        if (element.offsetParent === null
            || element.offsetHeight == 0
            || element.offsetLeft == 0
            || element.offsetTop == 0
            || element.offsetWidth == 0
            || element.clientHeight == 0
            || element.clientWidth == 0) {
            return true;
        }

        const computedStyle = window.getComputedStyle(element);
        return (computedStyle.getPropertyValue('display') == 'none'
            || computedStyle.getPropertyValue('visibility') == 'hidden');
    }
    function remove(): void {
        element.parentElement && element.parentElement.removeChild(element);
    }
    return Object.freeze({
        element, append, check, remove,
    });
}

export function Html(options: HtmlOptions = HtmlDefaultOptions): DetectPlugin {
    return {
        detect: function HtmlDetectPlugin(resolve: (result: boolean) => void) {
            const bait = Bait(options.baitClass, options.baitStyle);
            let done: ((result: boolean) => void) | undefined = function (result) {
                resolve(result);
                bait.remove();
                clearInterval(intervalId);
                done = undefined;
            };
            bait.append();
            setTimeout(function () {
                done && done(false);
            }, options.timeout);
            const intervalId = setInterval(function() {
                if (!bait.check()) {
                    return;
                }
                done && done(true);
            }, options.interval)
        },
        name: "detect-ad-block/html" + options.name,
        version: 1,
    };
}

export const html = Html();
