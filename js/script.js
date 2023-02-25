const commandsContainer = document.querySelector('.commands-container');

const forwardCommand = document.querySelector('#forward');
const leftCommand = document.querySelector('#left');
const rightCommand = document.querySelector('#right');

const mobileImg = document.querySelector('.mobile-img');
const commandButton = document.querySelector('.cmd-button');

const commands = [];
const globalFrame = {
  north: 'north',
  east: 'east',
  south: 'south',
  west: 'west'
};

let timer
let direction = globalFrame.east;
let angle = 0;

position = 0;

function addCommand (commandType) {
  img = document.createElement('img');
  img.src = `./assets/${commandType}.svg`;
  img.classList.add('cmd-img');

  commandsContainer.append(img);

  commands.push(commandType);
}

// function increaseDistance(start, final) {
//   position = position + 5;
//   if (position == final) {
//     clearInterval(timer);
//     return 
//   }
  
//   switch (direction) {
//     case 'north':
//       mobileImg.style.bottom = `${position}px`;
//       break;
//     case 'west':
//       mobileImg.style.right = `${position}px`;
//       break;   
//     case 'south':
//       mobileImg.style.top = `${position}px`;
//       break;
//     case 'east':
//       mobileImg.style.left = `${position}px`;
//       break;      
//   }
// }

function getGlobalPosition () {
  console.log('position', position)
  switch (direction) {
    case globalFrame.north:
      // elementPosition = window.getComputedStyle(mobileImg, null).getPropertyValue("bottom").slice(0,-2);
      position = getVerticalPosition();
      // position = elementPosition;
      break;
    case globalFrame.west:
      // elementPosition = window.getComputedStyle(mobileImg, null).getPropertyValue("right").slice(0,-2);
      position = getHorizontalPosition();
      // position = elementPosition;
      break;   
    case globalFrame.south:
      // elementPosition = window.getComputedStyle(mobileImg, null).getPropertyValue("top").slice(0,-2); 
      position = getVerticalPosition();
      // position = elementPosition;
      break;
    case globalFrame.east:
      // elementPosition = window.getComputedStyle(mobileImg, null).getPropertyValue("left").slice(0,-2);
      position = getHorizontalPosition();
      // position = elementPosition;
      break;      
  }
}

function getHorizontalPosition() {
  return parseInt(mobileImg.style.right.split('px')[0]) || 2;
}

function getVerticalPosition() {
  return parseInt(mobileImg.style.top.split('px')[0]) || 2;
}

function move(distance) {
  timer = setInterval(increaseDistance, 50)
  let localPosition = position;
  
  function increaseDistance() {
    // localPosition = localPosition + 5;
    console.log('move', localPosition);
    if (localPosition >= (position + distance)) {
      clearInterval(timer);
      rotate(90);
      return 
    }

   
    switch (direction) {
      case globalFrame.north:
        console.log('north');
        localPosition = localPosition - 5;
        mobileImg.style.top = `${localPosition}px`;
        // mobileImg.style.transform = `translate(0,${localPosition}px)`
        break;
      case globalFrame.west:
        console.log('west');
        localPosition = localPosition - 5;
        mobileImg.style.left = `${localPosition}px`;
        // mobileImg.style.transform = `translate(${localPosition}px,0)`
        break;   
      case globalFrame.south:
        localPosition = localPosition + 5;
        mobileImg.style.top = `${localPosition}px`;
        // mobileImg.style.transform = `translate(0,${localPosition}px)`
        break;
      case globalFrame.east:
        localPosition = localPosition + 5;
        mobileImg.style.left = `${localPosition}px`;
        // mobileImg.style.transform = `translate(${localPosition}px,0)`
        break;      
    }
  }   
}

function changeOrientation(isClockwise) {
  switch (direction) {
    case globalFrame.north:
      if(isClockwise) {
        direction = globalFrame.east
      } else {
        direction = globalFrame.west
      }
      break;
    case globalFrame.west:
      if(isClockwise) {
        direction = globalFrame.north
      } else {
        direction = globalFrame.south
      }
      break;   
    case globalFrame.south:
      if(isClockwise) {
        direction = globalFrame.west
      } else {
        direction = globalFrame.east
      }
      break;
    case globalFrame.east:
      if(isClockwise) {
        direction = globalFrame.south
      } else {
        direction = globalFrame.north
      }
      break;      
  }
}

function rotate(angleDistance) {
  timer = setInterval(increaseAngle, 50);
  let localAngle = angle;
  console.log('rotate');
  function increaseAngle() {
    localAngle += 2;
    if(localAngle >= (angle + angleDistance)) {
      angle = localAngle;
      changeOrientation(true)
      console.log('direction', direction);
      clearInterval(timer);
      return
    }
    mobileImg.style.transform = `rotate(${localAngle}deg)`
  }
}

function moveForward() {
  let distance = 0;
  move();
}

function runCommands(event) {
  event.preventDefault()
  // console.log(timer)
  // moveForward();
  getGlobalPosition();
  let x = position;
  
  move(200)
  // rotate(90);
  // for (const command of commands) {
  //   console.log(command)
  //   moveForward();
  // }
}

forwardCommand.addEventListener('click', () => {
  addCommand("frente");
})

rightCommand.addEventListener('click', () => {
  addCommand("direita");
})

leftCommand.addEventListener('click', () => {
  addCommand("esquerda");
})

commandButton.addEventListener('click', runCommands);