const commandsContainer = document.querySelector('.commands-container');

const forwardCommand = document.querySelector('#forward');
const leftCommand = document.querySelector('#left');
const rightCommand = document.querySelector('#right');

const commands = [];

function addCommand (commandType) {
  img = document.createElement('img');
  img.src = `./assets/${commandType}.svg`;
  img.classList.add('cmd-img');

  commandsContainer.append(img);

  commands.push(commandType);
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
