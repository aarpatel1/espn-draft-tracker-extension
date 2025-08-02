// === ESPN Fantasy Football Draft Tracker ===
// content.js - Watches ESPN draft log and logs drafted player names
// Injected into the page via manifest.json content_scripts

/*
 * Extracts player naems from the ESPN draft board DOM.
 */
function extractDraftedPlayers() {
    // Query all player names inside the live pick log
    const playerElements = document.querySelectorAll('.pick-message__container .playerinfo__playername');

    // Convert to array and extract player names
    const draftedNames = Array.from(playerElements).map(el => el.textContent.trim());

    // Clear and log updated list
    console.clear();
    console.log("Drafted players:");
    draftedNames.forEach((name, i) => {
        console.log('${i + 1}. ${name}');
    });

    // TODO: Send this data to a backend AI or store it for UI display (probably just backend AI)
}

/**
 * Sets up a MutationObserver to watch the ESPN draft board for changes.
 */
function startDraftObserver() {
    // Find the parent container that holds all pick messages
    const draftLogContainer = document.querySelector('.pick-message__container')?.closest('ul');
    if (!draftLogContainer) {
        console.warn("Draft board not found - is the draft room open and ready?");
        return;
    }

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
        setTimeout(startDraftObserver, 2500); // Delay to allow dynamic UI to fully render for 2.5 seconds
    });
})