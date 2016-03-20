import _ from 'lodash';
import app from './views/app/app';

console.log('lodash', _.VERSION);

const testApp = app();

export function test() {
    return testApp;
}
