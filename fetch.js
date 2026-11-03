(async function() {
    console.log("%c[Mirrify Asset Injector] Extracting active asset registry...", "color: #00ffff; font-weight: bold;");

    // 1. Locate the running PlayCanvas application instance
    const app = window.pc?.apps?.[0] || window.pc?.app;
    
    if (!app) {
        console.error("PlayCanvas instance not found! Please make sure you are pasting this AFTER the game has loaded to the main menu.");
        return;
    }

    // 2. Scan the asset registry for URLs
    const assets = app.assets.list();
    let captureCount = 0;

    console.log(`Found ${assets.length} total registry items. Forcing network re-fetches for Mirrify to intercept...`);

    // Helper function to handle timing
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // 3. Loop through assets and fire dummy network requests
    for (let i = 0; i < assets.length; i++) {
        const asset = assets[i];
        if (asset.file && asset.file.url) {
            const absoluteUrl = new URL(asset.file.url, window.location.href).href;
            
            try {
                // Fetching with 'no-cors' or standard configurations forces the browser network layer 
                // to process the request, forcing Mirrify to catch and record the file.
                fetch(absoluteUrl, { cache: 'reload' });
                captureCount++;
                
                if (captureCount % 10 === 0) {
                    console.log(`[Mirrify Log] Pushed ${captureCount} dynamic assets to the network tab...`);
                }
                
                // Small spacing delay to avoid overloading browser processing threads
                await delay(50);
            } catch (e) {
                // Fail silently and keep going if a specific asset format acts up
            }
        }
    }

    console.log(`%c[Success] Forced ${captureCount} asset requests. Watch your Mirrify asset log count increase!`, "color: #00ff00; font-weight: bold;");
})();
