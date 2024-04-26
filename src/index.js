const { App } = require('@slack/bolt');
require('dotenv').config();

const socketModeAppConfig = {
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
};

const configureAppCommands = (app) => {
  app.command('/tarea', () => {
    // Cuando alguien utiliza /tarea en un canal en el que el bot se encuentra
    console.log('Se ha ejecutado /tarea');
  });
};

const configureAppEvents = (app) => {
  // Cuando alguien envia un mensaje a un canal en el que el bot se encuentra
  app.message(({ message }) => {
    console.log(message);
  });

  // Cuando alguien agrega una reaccion en un canal en el que el bot se encuentra
  app.event('reaction_added', async ({ event }) => {
    console.log('Evento:', event);

    // Trae a el un mensaje reaccionado
    const history = await app.client.conversations.history({
      latest: event.item.ts,
      channel: event.item.channel,
      limit: 1,
      inclusive: true,
    });
    console.log('Mensaje reaccionado:', history.messages[0]);

    // Trae a el dueño del mensaje
    // const users = await app.client.users.info({
    //   user: event.item_user,
    // });
    // console.log('Dueño:', users.user);

    // Trae a el usuario que reaccionó
    // const users = await app.client.users.info({
    //   user: event.user,
    // })
    // console.log('Reaccionado por:', users.user);

    // Envia un mensaje en el canal
    // app.client.chat.postMessage({
    //   channel: event.item.channel,
    //   text: 'Reaccionaste a un mensaje!',
    // })

    // Reacciona con un '+1' al mensaje reaccionado
    // app.client.reactions.add({
    //   channel: event.item.channel,
    //   name: '+1',
    //   timestamp: event.item.ts,
    // })
  });
};

const config = () => {
  return socketModeAppConfig;
};
const initializeApp = async () => {
  const appConfig = config();
  const app = new App(appConfig);
  configureAppCommands(app);
  configureAppEvents(app);
  await app.start(3000);
  console.log(`🤖 Bot app is running!`);
};

initializeApp();
