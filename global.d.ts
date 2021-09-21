declare const emit = (doc: any) => {};

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}
