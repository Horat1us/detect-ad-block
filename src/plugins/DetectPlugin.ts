export interface DetectPlugin {
    detect(resolve: (result: boolean) => void): void;

    name: string;
    version: number;
}
