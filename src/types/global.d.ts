export {};

declare global {
   type Option = Record<"value" | "label", string> & Record<string, string>;
}
