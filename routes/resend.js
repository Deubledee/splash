const express = require('express');
const path = require('path')
const audioConverter = require('audio-converter')
const router = express.Router();
const save = require('save-file')
/*var BlockStream = require('block-stream')
const audioSave = wav.FileWriter*/

function optimize(file, req, res) {
        let fileToWrite = `${new Date().toISOString()}-slpash.wav`
        let fileToWrite2 = `${new Date().toISOString()}-slpash.mp3`
        let fileName = path.join(__dirname, '/audio/', fileToWrite)
        let fileName2 = path.join(__dirname, '/audio/', fileToWrite2)
        save(file, fileName, (err, data) => {
                if (err) {
                        console.log(err)
                }
              /*  audioConverter(fileName, fileName2, {
                        progressBar: true,
                        mp3Only: true,
                        mpQuality: false
                }).then((evt) => {
                        console.log('done', evt)
                })*/
                res.send(data)
        })

}

router.post('/audio', (req, res) => {
        console.log(req)
        optimize(req.body.file, req, res)
});

module.exports = router;
