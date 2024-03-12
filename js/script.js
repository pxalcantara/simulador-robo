
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

// Create ros object to communicate over your Rosbridge connection
const ros = new ROSLIB.Ros({ url : 'ws://localhost:9090' });
const commands_ros = [];
let cmd_position_reference = 0;
let moving = false;
const twist_msg = new ROSLIB.Message({
  linear : {
    x : 0.0,
    y : 0.0,
    z : 0.0
  },
  angular : {
    x : 0.0,
    y : 0.0,
    z : 0.0
  }
});


ros.on('connection', () => {
  console.log("successful");
});

ros.on('error', (error) => {
  console.log(`errored out (${error})`);
});

ros.on('close', () => {
  console.log(`closed`);
});

// Create a listener for /my_topic
const my_topic_listener = new ROSLIB.Topic({
  ros,
  name : "/my_topic",
  messageType : "std_msgs/String"
});

// When we receive a message on /my_topic, add its data as a list item to the “messages" ul
my_topic_listener.subscribe((message) => {
  const title =  document.querySelector('h2');
  title.innerText = message.data
});

const pose_subscriber = new ROSLIB.Topic({
  ros,
  name : "/turtle1/pose",
  messageType : "turtlesim/Pose"
});

pose_subscriber.subscribe((message) => {
  if (message.angular_velocity !== 0 || message.linear_velocity !== 0) {
    console.log("Zero", message)
    return
  }
  // console.log(message)
})

const cmd_vel_topic = new ROSLIB.Topic({
  ros,
  name : "/turtle1/cmd_vel",
  messageType : "geometry_msgs/Twist"
});

let joy = nipplejs.create({
  zone: document.getElementById('map'),
  mode: 'static',
  position: {right: '30%', bottom: '20%'},
  color: 'blue',
  size: 150
});

joy.on('start', (event, nipple) => {
  console.log("Start Joy")
  timer = setInterval(function () {
    cmd_vel_topic.publish(twist_msg)
  }, 1);
})

joy.on('move', (event, nipple) => {
  max_linear = 1.0; // m/s
  max_angular = 0.5; // rad/s
  max_distance = 75.0; // pixels;
  linear_speed = Math.sin(nipple.angle.radian) * max_linear * nipple.distance/max_distance;
  angular_speed = -Math.cos(nipple.angle.radian) * max_angular * nipple.distance/max_distance;
  console.log(linear_speed, angular_speed);
  twist_msg.angular.z = angular_speed;
  twist_msg.linear.x = linear_speed;
  cmd_vel_topic.publish(twist_msg)
})

joy.on('end', (event, nipple) => {
  console.log("End")
  if (timer) {
    clearInterval(timer)
  }
  twist_msg.angular.z = 0.0;
  twist_msg.linear.x = 0.0;
  cmd_vel_topic.publish(twist_msg)
})


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

  twist_msg.angular.z = -1.55;
  twist_msg.linear.x = 0.0;

  if (!isClockwise) {
    twist_msg.angular.z = -twist_msg.angular.z
  }

  cmd_vel_topic.publish(twist_msg);

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
  twist_msg.angular.z = 0.0;
  twist_msg.linear.x = 1.0;
  cmd_vel_topic.publish(twist_msg);
  console.log(twist_msg);
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