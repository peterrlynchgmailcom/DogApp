
// Variables
let coachingProgress = 0;
let timer = null;
let timeLeft = 3;
let initialTime = 3;
let multiplier = 1;
let stepperValue = 1;
const levelNumberArray = [3,5,10,20,40,60,90,120,180,300];
let isRunning = false;
let isInitialRun = true;
let wakeLock = null;

// Elements
const coachingLabel = document.getElementById('coachingLabel');
const instructionTitle = document.getElementById('instructionTitle');
const goLabel = document.getElementById('goLabel');
const titleJackpotLabel = document.getElementById('titleJackpot');
const timerLabel = document.getElementById('timerLabel');
const levelLabel = document.getElementById('levelLabel');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const levelSlider = document.getElementById('levelSlider');
const infoButton = document.getElementById('infoButton');

// Audio
const singleBell = new Audio('audio/SingleBell.m4a');
const jackpot = new Audio('audio/Jackpot.m4a');

// Wake Lock
async function requestWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
  } catch (err) {
    console.error('Wake Lock not supported', err);
  }
}

function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
}

// Timer functions
function updateTimerLabel() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerLabel.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

function chanceMultiplier() {
  const midpoint = 5;
  multiplier = 1;
  let keepGoing = true;
  while(keepGoing) {
    let randInt = Math.floor(Math.random()*10);
    if(randInt < midpoint && multiplier < 5) {
      multiplier++;
    } else {
      keepGoing = false;
    }
  }
}

function fireTimer() {
  updateTimerLabel();
  timeLeft--;
  if(timeLeft < 0) {
    multiplier = 1;
    let randIntJackpot = Math.floor(Math.random()*100);
    if(randIntJackpot===1 && coachingProgress>=5) {
      jackpot.play();
      titleJackpotLabel.textContent = '🍒🍒🍒 JACKPOT 🍒🍒🍒';
    } else {
      singleBell.play();
      titleJackpotLabel.textContent = 'Dog Therapy';
    }
    chanceMultiplier();
    if(isInitialRun) multiplier = 1;
    timeLeft = levelNumberArray[stepperValue-1]*multiplier;
    isInitialRun = false;
  }
}

// Level slider change
levelSlider.addEventListener('input', ()=>{
  stepperValue = parseInt(levelSlider.value);
  isInitialRun = true;
  initialTime = levelNumberArray[stepperValue-1];
  timeLeft = initialTime;
  levelLabel.textContent = 'Level ' + stepperValue;
  updateTimerLabel();
  if(isRunning) {
    clearInterval(timer);
    timer = setInterval(fireTimer,1000);
  }
});

// Left button (clicker / tutorial)
leftButton.addEventListener('click',()=>{
  let randIntJackpot = Math.floor(Math.random()*100);
  if(randIntJackpot===1 && coachingProgress>=5) {
    jackpot.play();
    titleJackpotLabel.textContent = '🍒🍒🍒 JACKPOT 🍒🍒🍒';
  } else {
    singleBell.play();
    titleJackpotLabel.textContent = 'Dog Therapy';
  }

  if (isRunning) {

    timeLeft = levelNumberArray[stepperValue-1];
    updateTimerLabel();
    timer = setInterval(fireTimer,1000);
    }

  
  // Tutorial progression
  if(coachingProgress===0) {
    coachingProgress=1;
    instructionTitle.textContent='🟢 Is Your Clicker';
    coachingLabel.textContent='• If your dog does particularly well press it and give a treat \n\n• The bell lets them know exactly what they were doing to earn a treat';
    goLabel.textContent='Try it now. Press 🟢';
  } else if(coachingProgress===1){
    coachingProgress=2;
    instructionTitle.textContent='🟠 Starts a Variable Timer';
    coachingLabel.textContent='• This is how you train calm behavior \n\n• The length of each interval will vary\n\n• Have your dog go to their bed then start the timer';
    goLabel.textContent='Try it now. Press 🟠';
  }
});

// Right button (start/stop timer)
rightButton.addEventListener('click',()=>{
  if(!isRunning) {
    isRunning=true;
    rightButton.textContent='🟡';
    timeLeft = levelNumberArray[stepperValue-1];
    updateTimerLabel();
    timer = setInterval(fireTimer,1000);
    requestWakeLock();
  } else {
    isRunning=false;
    rightButton.textContent='🟠';
    clearInterval(timer);
    timeLeft = levelNumberArray[stepperValue-1];
    updateTimerLabel();
    releaseWakeLock();
  }
});

// Info button (tutorial reset / skip)
infoButton.addEventListener('click',()=>{
  let choice = prompt('Type RESET to restart tutorial, SKIP to skip it, or CANCEL to cancel:');
  if(choice && choice.toUpperCase()==='RESET'){
    coachingProgress=0;
    instructionTitle.textContent='Dog Therapy Uses the Science of Variable Reinforcement';
    coachingLabel.textContent='• Stop jumping, barking and whining using only positive training techniques';
    goLabel.textContent='Press 🟢 to get started or ℹ️ to skip the tutorial';
    timeLeft = levelNumberArray[stepperValue-1];
    updateTimerLabel();
  } else if(choice && choice.toUpperCase()==='SKIP'){
    coachingProgress=100;
    instructionTitle.textContent='Keep Training Fun and Easy';
    coachingLabel.textContent='• Give your dog a high value treat if they get a Jackpot \n\n• Many intervals are short but some are longer \n\n• This variability is optimized to make Dog Therapy extremely effective';
    goLabel.textContent='Happy Training';
  }
});

// Init
window.onload=()=>{
  updateTimerLabel();
  if(localStorage.getItem('finishedInstructions')==='true'){
    coachingProgress=100;
    instructionTitle.textContent='Keep Training Fun and Easy';
    coachingLabel.textContent='• Give your dog a high value treat if they get a Jackpot \n\n• Many intervals are short but some are longer \n\n• This variability is optimized to make Dog Therapy extremely effective';
    goLabel.textContent='Happy Training';
  }
};
