/** @type {import('tailwindcss').Config} */
module.exports = {
    // Include all paths to component files.
    content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
    ],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {},
    },
    plugins: [],
}
