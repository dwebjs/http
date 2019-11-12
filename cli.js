#!/usr/bin/env node

var http = require('http')
var ram = require('random-access-memory')
var ddrive = require('@dwebjs/ddrive')
var revelation = require('@dwebjs/revelation')
var getDWebKey = require('@dwebjs/resolve')
var serve = require('.')

var link = process.argv[2]
var storage = ram
var port = 8080

if (!link) {
    console.log('link to a dWeb key required')
    process.exit(1)
}

getDWebKey(link, (err, key) => {
    if (err) throw err
    start(key)
})

function start(key) {
    var vault = ddrive(storage, key, { sparse: true })
    var server = http.createServer(serve(vault, { live: true }))
    server.listen(port)
    console.log(`Visit http://localhost:${port} to see vault`)

    if (key) {
        vault.ready(function() {
            revelation(vault, { live: true })
        })
    }
}