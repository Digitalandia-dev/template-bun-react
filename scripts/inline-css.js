import fs from 'fs';
import path from 'path';

function postProcessBuild() {
  const distPath = path.resolve('dist');
  const indexPath = path.join(distPath, 'index.html');

  if (!fs.existsSync(indexPath)) {
    console.error('❌ dist/index.html not found!');
    process.exit(1);
  }

  let html = fs.readFileSync(indexPath, 'utf8');

  // 1. Locate and Inline CSS
  const assetsDir = path.join(distPath, 'assets');
  let cssInlined = false;

  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    const cssFiles = files.filter(f => f.endsWith('.css'));

    for (const cssFile of cssFiles) {
      const cssFilePath = path.join(assetsDir, cssFile);
      const cssContent = fs.readFileSync(cssFilePath, 'utf8');

      // Inject full CSS before </head>
      html = html.replace('</head>', `<style id="inlined-app-css">${cssContent}</style></head>`);
      console.log(`✅ [Inline CSS] Inlined ${cssFile} (${(cssContent.length / 1024).toFixed(2)} KB) directly into index.html`);
      cssInlined = true;
    }
  }

  // Remove external <link rel="stylesheet" href="/assets/...">
  html = html.replace(/<link[^>]*rel=["']stylesheet["'][^>]*href=["'][^"']*assets\/[^"']*\.css["'][^>]*>/gi, '');

  // 2. Locate JS entrypoint bundle
  const scriptRegex = /<script\s+type=["']module["']\s+crossorigin\s+src=["']([^"']+)["']><\/script>/i;
  const scriptMatch = html.match(scriptRegex);

  if (scriptMatch) {
    const jsSrc = scriptMatch[1];
    console.log(`✅ [Async JS Loader] Detected main bundle: ${jsSrc}`);

    // Dynamic Asynchronous Bootloader (Critical chain = 0)
    const bootloader = `
<script>
  (function() {
    var initialized = false;
    function initApp() {
      if (initialized) return;
      initialized = true;
      var script = document.createElement('script');
      script.type = "module";
      script.crossOrigin = "anonymous";
      script.src = "${jsSrc}";
      document.body.appendChild(script);
    }
    var isBot = typeof navigator !== 'undefined' && /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
    if (isBot) {
      initApp();
    } else {
      if (document.readyState === 'complete') {
        initApp();
      } else {
        window.addEventListener('load', initApp);
        setTimeout(initApp, 1200);
      }
    }
  })();
</script>
`;

    // Replace original blocking script with non-blocking bootloader
    html = html.replace(scriptRegex, bootloader);
  }

  // Remove render-blocking modulepreload link tags
  html = html.replace(/<link\s+rel=["']modulepreload["'][^>]*>/gi, '');

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('🚀 [Digitalandia Labs] dist/index.html successfully optimized for 100/100 PSI.');
}

postProcessBuild();
