const path = require('path');
const program = require("commander")

const { name, version } = require("../package");

const actions = {
    create: {
        description: 'create project with niceHubs-cli',
        alias: 'c',
        examples: [
            'niceHubs-cli create <project-name>',
        ],
    },
    config: {
        description: 'config info',
        alias: 'conf',
        examples: [
            'niceHubs-cli config get <k>',
            'niceHubs-cli config set <k> <v>',
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
            console.log(`执行 action->`, action);
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

program.version(`niceHubs-cli version = ${version}`).parse(process.argv);