export default function log(...c) {
  if (!process.env.prod === "yes") return console.log(...c);
}
