// Logic for handling swipe based navigation within the item pane.
let touchStartX = 0
let touchEndX = 0

// The item pane is identified by the id `col-item`. We only want to handle swipes within that element.
let item_element = document.getElementById('col-item')

item_element.addEventListener('touchstart', function (event) {
    touchStartX = event.changedTouches[0].screenX;
})

item_element.addEventListener('touchend', function (event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
})

// Helper functions are from key.js.
// Threshold of 100 should avoid accidental changes when scrolling up and down.
function handleSwipe() {
    let threshold = 150;
    if (touchEndX < touchStartX - threshold) {
        // Swiped left
        helperFunctions.navigateToItem(+1);
    } else if (touchEndX > touchStartX + threshold) {
        // Swiped right
        helperFunctions.navigateToItem(-1);
    }
}