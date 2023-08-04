require('dotenv');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const ENCRYPTION_ALGO = process.env.DATA_ENCRYPTION_ALGORITHM;
const ENCRYPTION_KEY  = crypto.createHash('sha256').update(String(process.env.DATA_ENCRYPTION_KEY)).digest('base64').substr(0, 32);
const ENCRYPTION_IV   = process.env.DATA_ENCRYPTION_IV_32;

function CryptoUtil() { }

CryptoUtil.prototype.encrypt = function (text, staticIV = false) {
  if (!text) return '';
  if (!text.trim()) return '';

  const iv      = staticIV ? Buffer.alloc(16, ENCRYPTION_IV) : crypto.randomBytes(16);
  const cipher  = crypto.createCipheriv(ENCRYPTION_ALGO, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted     = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

CryptoUtil.prototype.decrypt = function (text) {
  if (!text) return '';
  if (!text.trim()) return '';

  const textParts     = text.split(':');
  const iv            = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher      = crypto.createDecipheriv(ENCRYPTION_ALGO, ENCRYPTION_KEY, iv);
  let decrypted       = decipher.update(encryptedText);
  decrypted           = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

CryptoUtil.prototype.mask = function(text='', from=4, to=10, maskWith='*') {
  if (!text) return '';

  const maskPattern = maskWith.repeat(to-from);
  return text.replace(text.substring(from, to), maskPattern);
}

function randomizeStrings(a, b, c = 0) {
  if(c === (+process.env.HASH_ENTROPY || 5)) return [...a, ...b].join('');

  a = String(a);
  b = String(b);

  var d = [...a, ...b];
  var l = d.filter((_,i) => 0 === i%2);
  var r = d.filter((_,i) => 0 !== i%2);

  return randomizeStrings(l.join(''), r.join(''), c+1);
}

CryptoUtil.prototype.hash = function (text) {
  if(!text) return '';

  const saltRnd = +process.env.HASH_SALT_ROUNDS;
  const pepper  = process.env.HASH_PEPPER;
  const subject = randomizeStrings(text, pepper);

  const salt = bcrypt.genSaltSync(saltRnd);
  
  return bcrypt.hashSync(subject, salt);
}

CryptoUtil.prototype.hashCompare = function (text, hash) {
  if (!text) return false;
  if (!hash) return false;

  const pepper  = process.env.HASH_PEPPER;
  const subject = randomizeStrings(text, pepper);
  
  return bcrypt.compareSync(subject, hash);
}

module.exports = new CryptoUtil();