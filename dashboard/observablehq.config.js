export default {
  title: "Sorcerer of Truth: UAP Pipeline Observatory",
  root: "src",
  output: "dist",
  theme: ["dark", "dashboard"],
  style: "style.css",
  pages: [
    {name: "Control Plane", path: "/"},
    {name: "Evidence Registry", path: "/registry"},
    {name: "Methodology", path: "/methodology"}
  ],
  head: `<meta name="theme-color" content="#07070b">`,
  footer: "Sorcerer of Truth · UAP Pipeline Observatory · Evidence changes decisions."
};
