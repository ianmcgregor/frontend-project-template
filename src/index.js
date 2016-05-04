import './utils/polyfills';
import _ from 'lodash';
import hello from './components/hello/hello';

console.log('lodash', _.VERSION);

document.body.insertAdjacentHTML('afterbegin', hello());

export function test() {
    return 'hello';
}
