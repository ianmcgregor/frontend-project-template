import './utils/polyfills';
import hello from './components/hello/hello';

document.body.insertAdjacentHTML('afterbegin', hello());

export function test() {
    return 'hello';
}
