/// <reference types="vite/client" />

declare module '*.typ?raw' {
  const content: string;
  export default content;
}

declare module '*.typ' {
  const content: string;
  export default content;
}
