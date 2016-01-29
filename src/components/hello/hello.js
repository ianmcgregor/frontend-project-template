export default function hello() {
    const title = document.querySelector('title').innerHTML;
    const description = document.querySelector('meta[name="description"]').getAttribute('content');

    document.body.insertAdjacentHTML('afterbegin', `<main class="Hello">
        <h1 class="Hello-title">${title}</h1>
        <p class="Hello-description">${description}</p>
    </main>`);

    return 'hello';
}
