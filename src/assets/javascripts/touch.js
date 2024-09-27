// Logic for handling swipe based navigation within the item pane.
let screenWidth = window.innerWidth;
let touchStartX = 0
let touchEndX = 0
let touchStartY = 0
let touchEndY = 0

// The item pane is identified by the id `col-item`. We only want to handle swipes within that element.
let item_element = document.getElementById('col-item')

item_element.addEventListener('touchstart', function (event) {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
})

item_element.addEventListener('touchend', function (event) {
    touchEndX = event.changedTouches[0].screenX;
    touchEndY = event.changedTouches[0].screenY;
    handleSwipe();
})

window.addEventListener('resize', function (event) {
    screenWidth = window.innerWidth;
})

// Helper functions are from key.js.
// Threshold of 100 should avoid accidental changes when scrolling up and down.
function handleSwipe() {
    let threshold = Math.floor(screenWidth * .2);
    let diffY = Math.abs(touchEndY - touchStartY);
    let diffX = Math.abs(touchEndX - touchStartX);

    if (diffX > diffY) {
        if (touchEndX < touchStartX - threshold) {
            // Swiped left
            helperFunctions.navigateToItem(+1);
        } else if (touchEndX > touchStartX + threshold) {
            // Swiped right
            helperFunctions.navigateToItem(-1);
        }
    }
}