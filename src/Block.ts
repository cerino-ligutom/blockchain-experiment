import * as crypto from 'crypto';
import { Transaction } from './Transaction';

/**
 * Individual block on the chain.
 */
export class Block {
	/**
	 * One time use random number.
	 */
	nonce = Math.round(Math.random() * 999_999_999);

	constructor(
		/**
		 * Link to previous block.
		 */
		public previousHash: string,
		public transaction: Transaction,
		public timestamp = Date.now()
	) {}

	get hash(): string {
		const str = JSON.stringify(this);
		const hash = crypto.createHash('SHA256');
		hash.update(str);

		return hash.digest('hex');
	}
}
