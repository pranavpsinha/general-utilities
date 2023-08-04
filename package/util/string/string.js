function StringUTIL () {}

StringUTIL.prototype.getRandomCharacters = function() {
  return Math.random().toString(36).substring(7);
}

StringUTIL.prototype.getSubstring = function(string, till=0, from=0) {
  return string.substring(from, till);
}

StringUTIL.prototype.getStringBetweenStrings = function(base, left, right) {
  try {
    return ((base || '').match(new RegExp(left + "(.*)" + right)) || [])[1];
  } catch (e) {
    return '';
  }
}

StringUTIL.prototype.getLastNCharacters = function(text = '', n = 4) {
  return text.slice(-n);
}

StringUTIL.prototype.splitTextInLinesByLength = function(text = '', n = 15) {
  return text.split(new RegExp("(.{"+n.toString()+"})")).filter(x => !!x);
}

StringUTIL.prototype.splitWordsInLinesByMaxLineLength = function(str = '', n = 15) {
  const tokens = str.split(' ');
  const lines  = [];
  let line     = '';

  tokens.forEach((token,ind) => {
    if(token.length + line.length + 1 <= n) {
      line = (line + ' ' + token).trim();
    } else {
      lines.push(line);
      line = token;
      
      if(tokens.length === ind + 1) {
        lines.push(token);
      }
    }
  });

  return lines.filter(x => !!x);
}

module.exports = new StringUTIL();