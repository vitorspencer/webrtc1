var getUserMedia = require('getusermedia');

getUserMedia({ video: false, audio: true }, function (err, stream) {

  if (err) return console.error(err)

  var Peer = require('simple-peer')
  var peer = new Peer({
    initiator: location.hash === '#init',
    config: { iceServers: [ { url: 'stun:23.21.150.121' } ] },
    trickle: false,
    stream: stream
  })

  document.getElementById('connect').addEventListener('click', function () {
    var otherId = JSON.parse(document.getElementById('otherId').value)
    peer.signal(otherId)
  })

  document.getElementById('send').addEventListener('click', function () {
    var yourMessage = document.getElementById('yourMessage').value
    peer.send(yourMessage)
  })

  peer.on('signal', function (data) {
  	console.log('SIGNAL', JSON.stringify(data))
    document.getElementById('yourId').value = JSON.stringify(data)
  })

  peer.on('data', function (data) {
    console.log('data', JSON.stringify(data))
    document.getElementById('messages').textContent += data + '\n'
  })

  peer.on('connect', function () {
    console.log('CONNECTED!')
    document.getElementById('messages').textContent += "CONNECT" + '\n'
  })

  peer.on('close', function () {
    console.log('CONNECTION CLOSED!')
    document.getElementById('messages').textContent += "CONNECTION CLOSED" + '\n'
  })

  peer.on('error', function (err) {
    console.log('ERROR', err.toString())
  })

  peer.on('stream', function (stream) {
    console.log('STREAM')
    var video = document.createElement('video')
    document.body.appendChild(video)
    video.src = window.URL.createObjectURL(stream)
    video.play()
  })
})