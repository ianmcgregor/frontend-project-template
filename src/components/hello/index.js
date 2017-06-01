import json from '../../../package.json';

export default function hello() {
    return `<main class="Hello">
        <h1 class="Hello-title">${json.name}</h1>
        <p class="Hello-description">${json.description}</p>
    </main>`;
}
