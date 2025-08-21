declare module "dom-to-image-more" {
  export function toPng(node: HTMLElement, options?: object): Promise<string>;
  export function toJpeg(node: HTMLElement, options?: { quality?: number }): Promise<string>;
  export function toSvg(node: HTMLElement, options?: object): Promise<string>;
  export function toPixelData(node: HTMLElement, options?: object): Promise<Uint8Array>;
  export function toBlob(node: HTMLElement, options?: object): Promise<Blob>;
}
