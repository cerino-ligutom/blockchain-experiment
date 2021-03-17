import { Chain } from './Chain';
import { Wallet } from './Wallet';

const foo = new Wallet();
const bar = new Wallet();
const baz = new Wallet();

foo.sendMoney(100, bar.publicKey);
bar.sendMoney(50, baz.publicKey);
baz.sendMoney(25, bar.publicKey);

console.log(Chain.instance);
