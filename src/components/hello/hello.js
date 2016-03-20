export default function hello() {
    let el;

    el = document.querySelector('title');
    const title = el && el.innerHTML;

    el = document.querySelector('meta[name="description"]');
    const description = el && el.getAttribute('content');

    return `<main class="Hello">
        <h1 class="Hello-title">${title}</h1>
        <p class="Hello-description">${description}</p>
    </main>`;
}
