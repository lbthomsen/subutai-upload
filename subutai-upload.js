#!/usr/bin/node

/*
 * Upload file(s) to subutai
 */

const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const fs = require("fs-extra");
const request = require("request-promise");

const pkg = require(__dirname + "/package.json");

const optionDefs = [
    {
        name: "help", 
        alias: "h", 
        type: Boolean, 
        defaultValue: false
    }, 
    {
        name: "verbose", 
        alias: "v", 
        type: Boolean, 
        defaultValue: false
    }, 
    {
        name: "dev", 
        alias: "d", 
        type: Boolean, 
        defaultValue: false
    }, 
    {
        name: "master", 
        alias: "m", 
        type: Boolean, 
        defaultValue: false
    }, 
    {
        name: "files", 
        alias: "f", 
        type: String, 
        multiple: true, 
        defaultOption: true
    }, 
    {
        name: "username", 
        alias: "u", 
        type: String
    }, 
    {
        name: "password", 
        alias: "p", 
        type: String
    }, 
    {
        name: "template", 
        alias: "t", 
        type: Boolean, 
        defaultValue: false
    }
];

async function doRun() {

}

console.log(pkg.name + ", version " + pkg.version);

var options = commandLineArgs(optionDefs, { stopAtFirstUnknown: false });

options.verbose && console.log("Options: ", options);

if (options.help) {
    const usage = commandLineUsage([
        {
            header: "Typical use", 
            content: "subutai-upload --username myusername --password mypassword someimage.png"
        }, 
        {
            header: "Options", 
            optionList: optionDefs
        }
    ]);
    console.log(usage);
} else if (!options.username || !options.password) {
    console.log("Please provide username and password");
} else if (options.files.lengh === 0) {
    console.log("Please provide at least one file");
} else {
    doRun();
}

/*
 * vim: ts=4 et nowrap autoindent
 */