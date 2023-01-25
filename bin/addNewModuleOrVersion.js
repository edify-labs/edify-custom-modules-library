const fs = require('fs');
const prompts = require('prompts');
const path = require('path');
const yargs = require('yargs');
const { toBoolean } = require('@edify/js-utils/bool');

const basicInfo = require('./jsonDocTemplates/basicInfo.json');
const functionConfig = require('./jsonDocTemplates/functionConfig.json');
const webhookBasicConfig = require('./jsonDocTemplates/webhookConfig.json');
const webhookWithWaitForCallback = require('./jsonDocTemplates/webhookWithWaitForCallback.json');

prompts.override(yargs.argv);

const args = yargs.option('isNewModule').argv;
(async () => {
  const isNewModule = toBoolean(args.isNewModule);
  const { type, name, versionNumber, webhookType } = await prompts([
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
      message: `What is the name of the module${isNewModule ? '' : ' (match the directory name of module)'}`,
      validate: value => !!value || 'Must provide a module name',
    },
    {
      type: 'text',
      name: 'versionNumber',
      message: 'What is the first version number?',
      initial: '1.0',
      validate: value => !!value || 'Must provide a version number',
    },
  ]);

  if (!name || !type || !versionNumber || (type === 'webhook' && !webhookType)) {
    throw new Error('Missing values from prompt');
  }

  const moduleName = getFormattedModuleName(name);

  const moduleLookupPath = path.join(__dirname, `../src/modules/${type === 'customFunction' ? 'functions' : 'webhooks'}/${moduleName}`);
  const moduleExists = fs.existsSync(moduleLookupPath);

  if (args.isNewModule) {
    if (moduleExists) {
      throw new Error('There is already a module with this name');
    }
  } else if (!moduleExists) {
    throw new Error('No module found matching provided name');
  }

  const pathWithVersionNumber = `${moduleLookupPath}/${versionNumber}`;
  if (isNewModule) {
    fs.mkdirSync(moduleLookupPath);
    fs.writeFileSync(`${moduleLookupPath}/README.md`, `# ${name}`);
  }

  fs.mkdirSync(pathWithVersionNumber);
  fs.writeFileSync(`${pathWithVersionNumber}/module.json`, JSON.stringify(getModuleJson(name, moduleName, versionNumber, type, webhookType), null, 2));
  
  if (type === 'customFunction') {
    const createFiles = [
      {
        name: `${pathWithVersionNumber}/function.js`,
        content: `
        function functionName() {}
        
        module.exports = functionName;
        `
      },
      {
        name: `${pathWithVersionNumber}/function.test.js`,
        content: `describe('functionName', () => {})`,
      },
    ];

    for (const { name, content } of createFiles) {
      fs.writeFileSync(name, content);
    }
  }
})();

function getFormattedModuleName(unFormattedName) {
  const stripped = unFormattedName.replace(/[&\/\\#,+()$~%.'":*?!<>{}]/g, '');

  return stripped.toLowerCase().split(' ').join('-');
}

function getModuleJson(name, formattedName, moduleVersion, type, webhookType) {
  return {
    ...basicInfo,
    name,
    moduleVersion,
    ...getModuleTypeConfig(),
  }

  function getModuleTypeConfig() {
    if (type === 'function') {
      return {
        functionConfig: {
          ...functionConfig.functionConfig,
          code: `/src/modules/${type}/${formattedName}/function.js`,
        },
      };
    }

    if (webhookType === 'basic') {
      return webhookBasicConfig;
    }

    return webhookWithWaitForCallback;
  }
}
