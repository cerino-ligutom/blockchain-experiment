import * as crypto from 'crypto';
import { Block } from './Block';
import { Transaction } from './Transaction';

/**
 * The blockchain.
 */
export class Chain {
	/**
	 * There should only be one chain.
	 */
	public static instance = new Chain();

	chain: Block[];

	constructor() {
		const GENESIS_BLOCK = new Block(
			// Asserted type "any" here to bypass strict type checking.
			// This is only unique to the genesis block. Succeeding blocks
			// cannot have empty previous hash.
			null as any,
			new Transaction(100, 'genesis', 'zeferinix')
		);

		this.chain = [GENESIS_BLOCK];
	}

	get lastBlock(): Block {
		return this.chain[this.chain.length - 1];
	}

	/**
	 * Proof of work system
	 *
	 * Attempt to find a number that when added to the nonce
	 * will produce a hash that starts with four 0s
	 */
	mine(nonce: number) {
		let solution = 1;
		console.log('⛏️  mining...');

		while (true) {
			const hash = crypto.createHash('MD5');
			hash.update((nonce + solution).toString()).end();

			const attempt = hash.digest('hex');

			if (attempt.substr(0, 4) === '0000') {
				console.log(`Solved: ${solution}`);
				return solution;
			}

			solution += 1;
		}
	}

	// This is insecure. Anyone could just tamper with it
	// addBlock(transaction: Transaction, senderPublicKey: string) {
	// 	const newBlock = new Block(this.lastBlock.hash, transaction);
	// 	this.chain.push(newBlock);
	// }

	/**
	 * Add a new block to the chain if valid signature & proof of work is complete.
	 */
	addBlock(
		transaction: Transaction,
		senderPublicKey: string,
		senderSignature: Buffer
	) {
		const verifier = crypto.createVerify('SHA256');
		verifier.update(transaction.toString());

		const isValid = verifier.verify(senderPublicKey, senderSignature);

		if (isValid) {
			const newBlock = new Block(this.lastBlock.hash, transaction);
			this.mine(newBlock.nonce);
			this.chain.push(newBlock);
		}
	}
}
