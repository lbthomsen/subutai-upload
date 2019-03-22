#!/usr/bin/node

/*
 * Upload file(s) to subutai
 */

const fs = require("fs");
const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const asyncModule = require("async");
const request = require("request");

const pkg = require(__dirname + "/package.json");

const optionDefs = [
    {
        name: "help",
        alias: "h",
        type: Boolean,
        defaultValue: false,
        description: "Display this help"
    },
    {
        name: "verbose",
        alias: "v",
        type: Boolean,
        defaultValue: false,
        description: "Produce verbose output"
    },
    {
        name: "network",
        alias: "n",
        type: String,
        defaultValue: "prod",
        description: "Choose bazaar network (prod, master, dev - default = prod)"
    },
    {
        name: "token",
        alias: "t",
        type: String,
        description: "Bazaar CDN Token (required!)"
    },
    {
        name: "type",
        alias: "y",
        type: String,
        defaultValue: "raw",
        description: "Upload type raw|template (default: raw)"
    },
    {
        name: "override",
        alias: "o",
        type: String,
        description: "Override bazaar base url - for example: https://bazaar-1.subutai.io"
    },
    {
        name: "files",
        alias: "f",
        type: String,
        multiple: true,
        defaultOption: true,
        description: "File(s) to upload - one at the time"
    }
];

const bazaarUrls = {
    prod: "https://bazaar.subutai.io",
    master: "https://masterbazaar.subutai.io",
    dev: "https://devbazaar.subutai.io"
}

async function doRun() {

    var selector;
    if (options.dev) selector = "dev"
    else if (options.master) selector = "master"
    else selector = "prod";

    var url = options.override || bazaarUrls[options.network];

    url += "/rest/v1/cdn/" + options.type + "/upload";

    options.verbose && console.log("Using bazaar url = ", url);

    asyncModule.eachSeries(options.files, function (file, doneFile) {
        options.verbose && console.log("Processing file: ", file);

        const formData = {
            token: options.token,
            file: fs.createReadStream(file)
        };

        request.post({
            url: url,
            formData: formData
        }, function (err, rest, body) {
            if (err) {
                console.err("Error: ", err);
            } else {
                bodyJson = JSON.parse(body);
                console.log(file + " uploaded to: https://ipfs.subutai.io/ipfs/" + bodyJson.id);
            }

            doneFile();
        });

    }, function () {
        options.verbose && console.log("Done uploading files");
    });

}

console.log(pkg.name + ", version " + pkg.version);

var options = commandLineArgs(optionDefs, { stopAtFirstUnknown: false });

options.verbose && console.log("Options: ", options);

if (options.help) {
    const usage = commandLineUsage([
        {
            header: "Usage",
            content: 'subutai-upload --token "9beeecae-742b-497a-984b-d32b7d179aaa" photo.png'
        },
        {
            header: "Options",
            optionList: optionDefs
        },
        {
            content: "See 'https://github.com:lbthomsen/subutai-upload' for more info"
        }
    ]);
    console.log(usage);
} else if (!options.token) {
    console.log("Please provide a token");
} else if (options.files.lengh === 0) {
    console.log("Please provide at least one file");
} else {
    doRun();
}

/*
 * vim: ts=4 et nowrap autoindent
 */