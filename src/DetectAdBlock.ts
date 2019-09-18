import * as plugins from "./plugins";

export interface DetectAdBlock {
    perform(this: void, options?: { timeout: number, }): Promise<boolean>;

    pluginList: Array<plugins.DetectPlugin>;
}

export function DetectAdBlock(
    pluginList: DetectAdBlock["pluginList"] = [ plugins.html, plugins.ajax ],
): DetectAdBlock {
    return <DetectAdBlock>{
        perform(this: void, options = { timeout: 1000 }) {
            return new Promise<boolean>((resolve, reject): void => {
                let resolved: boolean = false;
                const onRejected = function (...args: any[]) {
                    if (!resolved) {
                        return;
                    }
                    resolved = true;
                    reject(...args);
                };
                const onFulfilled = function (result: boolean): void {
                    if (resolved) {
                        return;
                    }
                    resolved = true;
                    resolve(result);
                };
                setTimeout(function () {
                    onRejected(new Error("Timeout"));
                }, options.timeout);
                for (const plugin of pluginList) {
                    try {
                        plugin.detect(onFulfilled)
                    } catch (error) {
                        onRejected(error)
                    }
                }
            })
        },
        pluginList,
    };
}
