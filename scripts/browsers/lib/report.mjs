const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const title = (engine) => engine.charAt(0).toUpperCase() + engine.slice(1);
const num = (n) => +n.toFixed(3);

/**
 * Markdown report for the overlay browser run.
 * results: [{ engine, version, ua, rows: [{check, overlay, pass, detail}], durations: {overlay: {enter, exit}} }]
 * meta: { date, head, branch, playwright, puppeteer }
 */
export function buildMarkdown(results, meta) {
  let md = `# Overlay browser results: open/close in ${results.map((r) => title(r.engine)).join(' and ')}\n\n`
    + `- Date: ${meta.date}\n`
    + `- Repo HEAD: ${meta.head} (branch ${meta.branch}), nightwire.css as built, read-only\n`
    + `- Method: automated (Chrome via playwright-core ${meta.playwright}, real Chrome channel; Firefox via puppeteer-core ${meta.puppeteer} over the system Firefox, headless). `
    + `Real keyboard Tab presses and real mouse moves/clicks; per-frame requestAnimationFrame sampling of computed style.\n`
    + `- Reduced motion: Chrome emulateMedia reducedMotion=reduce; Firefox pref ui.prefersReducedMotion=1 (matchMedia confirmed true).\n`
    + `- Safari: declared in the browser baseline, not tested.\n`;
  for (const r of results) {
    const passed = r.rows.filter((x) => x.pass).length;
    md += `\n## ${title(r.engine)}: ${r.version.replace('firefox/', 'Firefox ')} (${passed}/${r.rows.length} PASS)\n\n`
      + `User agent: \`${r.ua}\`\n\n| Check | Overlay | Result | Observed |\n|---|---|---|---|\n`;
    for (const x of r.rows) md += `| ${esc(x.check)} | ${x.overlay} | ${x.pass ? 'PASS' : 'FAIL'} | ${esc(x.detail)} |\n`;
  }
  const dur = results[0]?.durations ?? {};
  const durLine = Object.entries(dur).map(([k, d]) => `${k} ${num(d.enter)}ms in / ${num(d.exit)}ms out`).join(', ');
  md += `\nNotes\n`
    + `- Check 1 durations are read from the stylesheet at run time (the longest computed transition-duration of the overlay's elements in the open and the closed state), not constants: ${durLine}. `
    + `"hidden@Nms" is the first animation frame where visibility was hidden; expected within [exit-25, exit+60] ms.\n`
    + `- Check 2 includes a control (rows "2 control") showing the same probes do detect an overlay when it is open. The tooltip content is pointer-events:none by design, so only the Tab control applies to it.\n`
    + `- Check 4 uses a page with no LED (its infinite animation would otherwise populate getAnimations()).\n`
    + `- Check 6 rows for operator and combat are controls: pulse runs outside archive.\n`
    + `- Firefox Tab order shows tt-trigger twice in a row in some runs; no control inside a closed overlay was ever focused.\n`;
  return md;
}
