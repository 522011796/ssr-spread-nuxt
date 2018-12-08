export default function ({ isHMR, app, store, route, params }) {
  if (isHMR) return
  let isClient = process.client;
  let isServer = process.server;
}
