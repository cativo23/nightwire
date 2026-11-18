// The one glob implementation shared by the parity tool (--pages) and change categories
// (match.page). Zero dependencies. (path.matchesGlob needs Node 22.)

/**
 * Compile a glob to an anchored RegExp. `**` matches any number of characters including `/`;
 * `**` followed by `/` matches zero or more whole directories, so `examples/**\/x.html`
 * matches `examples/x.html`. `*` matches a run of characters within one segment, `?` matches
 * one character except `/`. Everything else is literal.
 */
export function globToRegExp(pattern) {
  let re = '';
  for (let k = 0; k < pattern.length; k++) {
    const ch = pattern[k];
    if (ch === '*' && pattern[k + 1] === '*') {
      k++;
      if (pattern[k + 1] === '/') { k++; re += '(?:.*/)?'; } else re += '.*';
    } else if (ch === '*') re += '[^/]*';
    else if (ch === '?') re += '[^/]';
    else re += ch.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${re}$`);
}
