const path = require('path');
const program = require("commander")

const { name, version } = require("../package");

const actions = {
    create: {
        description: 'create project with nicehubs-cli',
        alias: 'c',
        examples: [
            'nicehubs-cli create <project-name>',
        ],
    },
    config: {
        description: 'config info',
        alias: 'conf',
        examples: [
            'nicehubs-cli config get <k>',
            'nicehubs-cli config set <k> <v>',
        ],
    },
    '*': {
        description: 'command not found',
        alias: '',
        examples: [],
    },
};

Object.keys(actions).forEach((action) => {
    program
        .command(action)
        .alias(actions[action].alias)
        .description(actions[action].description)
        .action(() => {
            console.log(`run `, action);
            console.log(process.argv);
            require(path.resolve(__dirname, action))(...process.argv.slice(3));
        });
});

program.on('--help', () => {
    console.log('\nExamples:');
    Reflect.ownKeys(actions).forEach((action) => {
        console.log("-", action);
        actions[action].examples.forEach((example) => console.log(`  ${example}`));
    });
});

program.version(`nicehubs-cli version = ${version}`).parse(process.argv);