// === ESPN Fantasy Football Draft Tracker ===
// content.js - Watches ESPN draft log and logs drafted player names
// Injected into the page via manifest.json content_scripts

const seenPlayers = new Set(); // Track seen players to avoid duplicates

/*
 * Extracts player names from the pick history tab (includes all previously drafted players).
 */
function extractInitialDraftHistory() {
    const playerAnchors = document.querySelectorAll('.public_fixedDataTableCell_cellContent a.AnchorLink');
    const names = Array.from(playerAnchors).map(a => a.textContent.trim());

    names.forEach(name => {
        if (!seenPlayers.has(name)) {
            seenPlayers.add(name);
            console.log(`(History) ${seenPlayers.size}. ${name}`);
        }
    });
}


/*
 * Extracts player naems from the ESPN draft board DOM.
 */
function extractDraftedPlayers() {
    // Query all player names inside the live pick log
    const playerElements = document.querySelectorAll('.pick-message__container .playerinfo__playername');

    // Convert to array and extract player names
    const draftedNames = Array.from(playerElements).map(el => el.textContent.trim());

    draftedNames.forEach((name) => {
        // Check if this player has already been seen
        if (!seenPlayers.has(name)) {
            seenPlayers.add(name);
            console.log(`(Live) ${seenPlayers.size} drafted player: ${name}`);
        }
    });

    // Clear and log updated list
    console.log("Drafted players:");
    draftedNames.forEach((name, i) => {
        console.log(`${i + 1}. ${name}`);
    });

    // TODO: Send this data to a backend AI or store it for UI display (probably just backend AI)
}

/**
 * Sets up a MutationObserver to watch the ESPN draft board for changes.
 */
function startDraftObserver(retriesLeft = 5, delay = 1500) {
    // Find the parent container that holds all pick messages
    const draftLogContainer = document.querySelector('.pick-message__container')?.closest('ul');
    if (!draftLogContainer) {
        if (retriesLeft > 0) {
            console.warn(`Draft log container not found, retrying in ${delay}ms... (${retriesLeft} retries left)`);
            setTimeout(() => {
                startDraftObserver(retriesLeft - 1, delay);
            }, delay);
        } else {
            console.error("Draft log container not found after multiple retries. Is the draft room open and ready?");
        }
        return;
    }

    // Run immediately to get existing picks
    extractDraftedPlayers();

    // Create a MutationObserver to watch for added elements
    const observer = new MutationObserver(() => {
        // Debound to avoid too many updates during rapid DOM changes
        clearTimeout(window.draftDebounceTimer);
        window.draftDebounceTimer = setTimeout(() => {
            extractDraftedPlayers();
        }, 300); // Debounce time is 300 ms
    });

    // Start observing for DOM changes
    observer.observe(draftLogContainer, {childList: true, subtree: true});

    console.log("ESPN draft board observer started. Watching for drafted player updates...");
}

// Wait until everything is fully loaded
window.addEventListener('load', () => {
    setTimeout(() => {
        extractInitialDraftHistory(); // Extract draft history before you joined
        startDraftObserver(); // Continue watching live updates
    }, 2500); // Wait 2.5 seconds to ensure everything is loaded
});