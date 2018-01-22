import * as ethUtil from 'ethereumjs-util';
import randombytes from 'randombytes';
import * as secp256k1 from 'secp256k1';
import {
    sha3_256
} from 'js-sha3';

import {
    ensureBuffer,
    formatAddress
} from './util';


/**
 * get the ethereum-address by the publicKey
 * @param  {string} publicKey
 * @return {string} address
 */
export function publicKeyToAddress(publicKey) {
    publicKey = secp256k1
        .publicKeyConvert(
            ensureBuffer(publicKey),
            false
        )
        .slice(1); // slice(1) is to drop the type byte which is hardcoded as 04 ethereum
    return formatAddress(
        ethUtil.publicToAddress(publicKey)
        .toString('hex')
    );
}

/**
 * creates a new privateKey
 * @return {string} privateKey as hex
 */
export function createPrivateKey() {
    const key =
        new Buffer(
            randombytes(32), // Ethereum requires private key to be 256 bit long
            'hex'
        )
        .toString('hex');
    return key;
}


/**
 * create the publicKey from the privateKey
 * @param  {string} privateKey as hex
 * @return {string} publicKey as hex
 */
export function publicKeyFromPrivateKey(privateKey) {
    return secp256k1
        .publicKeyCreate(
            ensureBuffer(privateKey)
        )
        .toString('hex');
}

/**
 * creates a sha3_256 of the message
 * @param  {string} message
 * @return {string} the hash
 */
export function hash(message) {
    return sha3_256(message);
}

/**
 * signs the sha3_256-hash with the privateKey
 * @param {string} privateKey
 * @param {string} hash
 * @return {string} signature as hex
 */
export function signHash(privateKey, hash) {
    const sigObj = secp256k1.sign(
        ensureBuffer(hash),
        ensureBuffer(privateKey)
    );
    return sigObj.signature.toString('hex');
}

/**
 * check if signature of message is signed by the privateKey of the publicKey
 * @param {string} publicKey
 * @param {string} hash sha3_256-hash
 * @param {string} signature
 * @return {boolean} true if valid, false if not
 */
export function verifyHashSignature(publicKey, hash, signature) {
    return secp256k1.verify(
        ensureBuffer(hash),
        ensureBuffer(signature),
        ensureBuffer(publicKey)
    );
}