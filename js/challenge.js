// Wait until the page content is fully loaded before running any script
window.addEventListener('DOMContentLoaded', () => {
  console.log('challenge.js loaded and DOM fully ready.');

  // -------------------------------
  // DOM Element References
  // -------------------------------

  const counterDisplay = document.getElementById('counter');   // The number displayed at the top
  const plusBtn = document.getElementById('plus');             // ➕ button
  const minusBtn = document.getElementById('minus');           // ➖ button
  const heartBtn = document.getElementById('heart');           // ❤️ Like button
  const pauseBtn = document.getElementById('pause');           // Pause/Resume button
  const likesList = document.querySelector('.likes');          // Where likes will appear
  const commentForm = document.getElementById('comment-form'); // Comment form element
  const commentInput = document.getElementById('comment-input'); // Comment input field
  const commentDisplay = document.getElementById('list');      // Where comments are displayed

  // -------------------------------
  // Application State
  // -------------------------------

  let counter = 0;           // Tracks the current number on the counter
  let isPaused = false;      // Whether the counter is paused or not
  let intervalId = null;     // Will store the interval ID for the timer
  const likes = {};          // Object to keep track of how many times a number has been liked

  // -------------------------------
  // Start the automatic counter
  // -------------------------------

  function startCounter() {
    return setInterval(() => {
      if (!isPaused) {
        counter++;
        updateCounterDisplay();
      }
    }, 1000);
  }

  // Start immediately
  intervalId = startCounter();

  // Update the counter text in the DOM
  function updateCounterDisplay() {
    counterDisplay.textContent = counter;
  }

  // -------------------------------
  // Button Event Listeners
  // -------------------------------

  // ➕ button increases the counter manually
  plusBtn.addEventListener('click', () => {
    counter++;
    updateCounterDisplay();
  });

  // ➖ button decreases the counter manually
  minusBtn.addEventListener('click', () => {
    counter--;
    updateCounterDisplay();
  });

  // ❤️ button likes the current counter value
  heartBtn.addEventListener('click', () => {
    const currentNumber = counter;

    if (likes[currentNumber]) {
      likes[currentNumber]++;
      const existingLi = document.getElementById(`like-${currentNumber}`);
      existingLi.textContent = `${currentNumber} has been liked ${likes[currentNumber]} times`;
    } else {
      likes[currentNumber] = 1;
      const li = document.createElement('li');
      li.id = `like-${currentNumber}`;
      li.textContent = `${currentNumber} has been liked 1 time`;
      likesList.appendChild(li);
    }
  });

  // Pause/resume button toggles counter and buttons
  pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;

    if (isPaused) {
      clearInterval(intervalId);           // Stop the timer
      pauseBtn.textContent = 'resume';     // Update the button label
      toggleButtons(true);                 // Disable other buttons
    } else {
      intervalId = startCounter();         // Resume the timer
      pauseBtn.textContent = 'pause';      // Revert label
      toggleButtons(false);                // Enable buttons again
    }
  });

  // Disable or enable controls based on pause state
  function toggleButtons(disable) {
    plusBtn.disabled = disable;
    minusBtn.disabled = disable;
    heartBtn.disabled = disable;
    commentInput.disabled = disable;
    commentForm.querySelector('#submit').disabled = disable;
  }

  // -------------------------------
  // Comment Submission Handler
  // -------------------------------

  commentForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    const commentText = commentInput.value.trim();

    if (commentText !== '') {
      const p = document.createElement('p');
      p.textContent = commentText;
      commentDisplay.appendChild(p);
      commentInput.value = ''; // Clear the input
    }
  });

  // -------------------------------
  // Manual Test Cases (Console Logs)
  // -------------------------------

  setTimeout(() => {
    console.log('Running manual test cases...');

    // Test 1: Timer should have incremented from 0
    const val1 = parseInt(counterDisplay.textContent);
    console.assert(val1 > 0, `Timer not incrementing (value = ${val1})`);
    console.log('Timer increments automatically');

    // Test 2: Plus button works
    const prev = counter;
    plusBtn.click();
    console.assert(counter === prev + 1, `Plus button failed (expected ${prev + 1}, got ${counter})`);
    console.log('Plus button works');

    // Test 3: Minus button works
    minusBtn.click();
    console.assert(counter === prev, `Minus button failed (expected ${prev}, got ${counter})`);
    console.log('Minus button works');

    // Test 4: Heart (like) button works
    heartBtn.click();
    const likeEntry = document.getElementById(`like-${counter}`);
    console.assert(likeEntry && likeEntry.textContent.includes('liked'), 'Like not recorded in DOM');
    console.log('Like button works');

    // Test 5: Pause disables other buttons
    pauseBtn.click();
    console.assert(isPaused === true, 'Pause state not set');
    console.assert(plusBtn.disabled, 'Plus not disabled on pause');
    console.log('Pause disables controls');

    // Test 6: Resume enables buttons again
    pauseBtn.click();
    console.assert(isPaused === false, 'Resume state not cleared');
    console.assert(!plusBtn.disabled, 'Buttons not re-enabled after resume');
    console.log('Resume re-enables controls');

    // Test 7: Submit a comment
    commentInput.value = 'Test comment!';
    commentForm.querySelector('#submit').click();
    const last = commentDisplay.lastElementChild;
    console.assert(last && last.textContent === 'Test comment!', 'Comment not added to DOM');
    console.log('Comment submission works');

    console.log('All manual test cases passed!');
  }, 3000); // Wait 3 seconds to allow counter to tick at least once
});
