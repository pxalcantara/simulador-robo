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

let direction = globalFrame.east;
let angle = 0;
let position = 0;
let commandsIndex = 0;
let timer


function addCommand (commandType) {
  img = document.createElement('img');
  img.src = `./assets/${commandType}.svg`;
  img.classList.add('cmd-img');
  img.setAttribute('id',`cmd-${commandsIndex}`);
  
  img.addEventListener('click', (event) => {
    // event.target.remove();
    console.log(event.target.id);
    removeCommand(event.target.id);
    console.log(commands);
    })

  commandsContainer.append(img);
  commands.push(commandType);

  commandsIndex++;
}

function clearCommand () {
  commandsContainer.innerHTML = '';
  commands.length = 0;
  commandsIndex = 0;
}

function removeCommand(id) {
  cmd = document.querySelector('#'+id);
  index = id.replace('cmd-','');
  console.log(index);
  
  commands[index] = '';
  cmd.remove();
}


function getGlobalPosition () {
  switch (direction) {
    case globalFrame.north:
      elementPosition = window.getComputedStyle(mobileImg, null).getPropertyValue("top").slice(0,-2);
      position = parseInt(elementPosition);
      break;
    case globalFrame.west:
      elementPosition = window.getComputedStyle(mobileImg, null).getPropertyValue("left").slice(0,-2);
      position = parseInt(elementPosition);
      break;   
    case globalFrame.south:
      elementPosition = window.getComputedStyle(mobileImg, null).getPropertyValue("top").slice(0,-2); 
      position = parseInt(elementPosition);
      break;
    case globalFrame.east:
      elementPosition = window.getComputedStyle(mobileImg, null).getPropertyValue("left").slice(0,-2);
      position = parseInt(elementPosition);
      break;      
  }
}

function executeCommand () {
  console.log('comandIndex', commandsIndex)
  if (commandsIndex >= commands.length) {
    clearCommand()
    return
  }
  
  getGlobalPosition();
  switch (commands[commandsIndex]) {
    case 'frente':
      moveForward();
      break;
    case 'direita':
      rotate(90, true);
      break;
    case 'esquerda':
      rotate(-90, false);
      break
    case '':
      console.log('sem comando');
      commandsIndex++;
      executeCommand();
      break
  }

  commandsIndex++;
}

function move(distance) {
  timer = setInterval(increaseDistance, 50)
  let localPosition = position;
  let final
  if (direction === globalFrame.east || direction === globalFrame.south) {
    final = position + distance
  } else {
    final = position - distance
  }
  console.log('final', final)
  function increaseDistance() {
    getGlobalPosition()
    // console.log('move', localPosition);
    if (direction === globalFrame.east || direction === globalFrame.south) {
      if (localPosition >= (final)) {
        clearInterval(timer);
        executeCommand();
        return 
      }
    } else {
      if (localPosition <= (final)) {
        clearInterval(timer);
        executeCommand();
        return 
      }
    }
       
    switch (direction) {
      case globalFrame.north:
        localPosition = localPosition - 5;
        mobileImg.style.top = `${localPosition}px`;
        break;
      case globalFrame.west:
        localPosition = localPosition - 5;
        mobileImg.style.left = `${localPosition}px`;

        break;   
      case globalFrame.south:
        localPosition = localPosition + 5;
        mobileImg.style.top = `${localPosition}px`;
        break;
      case globalFrame.east:
        localPosition = localPosition + 5;
        mobileImg.style.left = `${localPosition}px`;
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

function rotate(angleDistance, isClockwise) {
  timer = setInterval(increaseAngle, 50);
  let localAngle = angle;
  console.log('rotate');

  function increaseAngle() {
    if (isClockwise) {
      localAngle += 2;

      if(localAngle >= (angle + angleDistance)) {
        angle = localAngle;
        changeOrientation(isClockwise)
        console.log('direction', direction);
        clearInterval(timer);
        executeCommand();
        return
      }
    } else {
      localAngle -= 2;

      if(localAngle <= (angle + angleDistance)) {
        angle = localAngle;
        changeOrientation(isClockwise)
        console.log('direction', direction);
        clearInterval(timer);
        executeCommand();
        return
      }
    }

    mobileImg.style.transform = `rotate(${localAngle}deg)`
  }
}

function moveForward() {
  let distance = 0;
  move(100);
}

function runCommands(event) {
  event.preventDefault()
  commandsIndex = 0;
  getGlobalPosition();
  executeCommand();
  
  // move(50)
  // rotate(-90, false);

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