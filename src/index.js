import _ from 'lodash';
import App from './js/view/App';

console.log('Hello world');
console.log('lodash', _.VERSION);

document.body.innerHTML = 'changed';

console.log('=>', [1, 2, 3].map((num) => num * num));

class Foo {

    static foobar = 'foobar';

    constructor (bar = 'bardef') {
        console.log(bar);
    }

    say (word) {
        return `Hello ${word} ${Foo.foobar}`;
    }

}

const foo = new Foo();
console.log(foo.say('hi'));

App();
