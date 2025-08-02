// === ESPN Fantasy Football Draft Tracker ===
// Injected into the page via manifest.json content_scripts

/*
 * Extracts player naems from the ESPN draft board DOM.
 */
function extractDraftedPlayers() {
    //TODO: Inspect ESPN's draft room and update this selector to match the actual DOM structure.
    const playerElements = document.querySelectorAll('.drafted-player-name');

    // Convert to array and extract player names
    const draftedNames = Array.from(playerElements).map(el => el.textContent.trim());

    // Clear and log updated list
    console.clear();
    console.log("Drafted players (from ESPN draft board):");
    draftedNames.forEach((name, i) => {
        console.log('${i + 1}. ${name}');
    });

    // TODO: Send this data to a backend AI or store it for UI display (probably just backend AI)
}

/**
 * Sets up a MutationObserver to watch the ESPN draft board for changes.
 */
function startDraftObserver() {
    //TODO: Inspect and replace with ESPN's actual draft board container selector
    const draftBoard = document.querySelector('#draft-board-root');
    if (!draftBoard) {
        console.warn("Draft board not found - is the draft room open and ready?");
        return;
    }
    const observer = new MutationObserver((mutationsList, observer) => {
        // Debound to avoid too many updates during rapid DOM changes
        clearTimeout(window.draftUpdateTimer);
            window.draftUpdateTimer = setTimeout(() => {
                extractDraftedPlayers();
            }, 300); 
    });

    // Start observing for DOM changes
    observer.observe(draftBoard, {childList: true, subtree: true});

    console.log("ESPN draft board observer started. Watching for drafted player updates...");
}

// Wait until everything is fully loaded
window.addEventListener('load', () => {
    setTimeout(() => {
        setTimeout(startDraftObserver, 2500);
    });
})