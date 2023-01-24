const fs = require('fs');
const prompts = require('prompts');
prompts.override(require('yargs').argv);

(async () => {
  const response = await prompts([
    {
      type: 'select',
      name: 'type',
      message: `What type of module?`,
      choices: [
        { title: 'customWebhook', value: 'customWebhook' },
        { title: 'customFunction', value: 'customFunction' },
      ],
    },
    {
        type: prev => prev === 'customWebhook' ? 'select' : null,
        name: 'webhookType',
        message: 'What webhook type?',
        choices: [
          { title: 'Basic (onResponse)', value: 'basic' },
          { title: 'Wait for callback', value: 'waitForCallback' },
        ],
      },
    {
      type: 'text',
      name: 'name',
      message: 'What is the name of the module',
      validate: value => !!value || 'Must provide a the module name',
    },
    {
      type: 'text',
      name: 'versionNumber',
      message: 'What is the new version number?',
      validate: value => !!value || 'Must provide a version number',
    },
  ]);

  console.log(response);
})();