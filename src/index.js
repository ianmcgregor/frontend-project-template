import './utils/polyfills';
import fps from 'usfl/fps';
import hello from './components/hello';

document.body.insertAdjacentHTML('afterbegin', hello());

fps.auto();

export function test() {
    return 'hello';
}
