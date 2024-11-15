/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    // Theme colors - expanded patterns
    {
      pattern: /(bg|text|border|ring|hover:bg|hover:border)-(green|blue|purple|indigo|rose|amber)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    // Gradients
    {
      pattern: /bg-gradient-to-(r|l|t|b|tr|tl|br|bl)/,
    },
    // Transitions and transforms
    'translate-x-0',
    '-translate-x-full',
    'translate-x-full',
    // Other utility classes
    {
      pattern: /(grid-cols|gap)-(1|2|3|4)/,
    }
  ]
}
