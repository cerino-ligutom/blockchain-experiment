import * as crypto from 'crypto';
import { Chain } from './Chain';
import { Transaction } from './Transaction';

/**
 * Wallet gives a user a public/private key pair
 */
export class Wallet {
	publicKey: string;
	privateKey: string;

	constructor() {
		const keyPair = crypto.generateKeyPairSync('rsa', {
			modulusLength: 2048,
			publicKeyEncoding: { type: 'spki', format: 'pem' },
			privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
		});

		this.privateKey = keyPair.privateKey;
		this.publicKey = keyPair.publicKey;
	}

	sendMoney(amount: number, payeePublicKey: string) {
		const transaction = new Transaction(amount, this.publicKey, payeePublicKey);

		const sign = crypto.createSign('SHA256');
		sign.update(transaction.toString()).end();

		const senderSignature = sign.sign(this.privateKey);
		Chain.instance.addBlock(transaction, this.publicKey, senderSignature);
	}
}
