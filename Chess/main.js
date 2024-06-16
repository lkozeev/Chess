import { Chess } from './node_modules/chess.js/dist/chess.js'

function main() {
let fen = prompt('fen')
if (fen.length == 0) fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

const chess = new Chess(fen)

function isLegal(move) {
    const moves = chess.moves({ verbose: true })
    for (let i=0; i < moves.length; i++) {
    if (moves[i].lan == move) return true}
    return false}

function newLine(a) {
    if (a == 'a') return 'b'
    if (a == 'b') return 'c'
    if (a == 'c') return 'd'
    if (a == 'd') return 'e'
    if (a == 'e') return 'f'
    if (a == 'f') return 'g'
    if (a == 'g') return 'h'}

function setBoard(fen) {
    for (let numb=1; numb <= 8; numb++) {
      for (let numa=97; numa < 97 + 8; numa++) {
        if (document.getElementById(String.fromCharCode(numa)+numb).classList.length > 1) {
          document.getElementById(String.fromCharCode(numa)+numb).classList.remove(document.getElementById(String.fromCharCode(numa)+numb).classList[1])
        }
      }
    }
    let a = 'a'
    let b = 8
    for (let i=0; i < fen.length; i++) {
        if (fen[i] == ' ') break
        else if (fen[i] == 1) for (let i=0; i<1; i++) a = newLine(a)
        else if (fen[i] == 2) for (let i=0; i<2; i++) a = newLine(a)
        else if (fen[i] == 3) for (let i=0; i<3; i++) a = newLine(a)
        else if (fen[i] == 4) for (let i=0; i<4; i++) a = newLine(a)
        else if (fen[i] == 5) for (let i=0; i<5; i++) a = newLine(a)
        else if (fen[i] == 6) for (let i=0; i<6; i++) a = newLine(a)
        else if (fen[i] == 7) for (let i=0; i<7; i++) a = newLine(a)
        else if (fen[i] == 8) for (let i=0; i<8; i++) a = newLine(a)
        else if (fen[i] == '/') {b -= 1; a = 'a'}
        else if (fen[i] == 'p') {document.getElementById(a+b).classList.add("bp"); a = newLine(a)}
        else if (fen[i] == 'P') {document.getElementById(a+b).classList.add("wp"); a = newLine(a)}
        else if (fen[i] == 'k') {document.getElementById(a+b).classList.add("bk"); a = newLine(a)}
        else if (fen[i] == 'K') {document.getElementById(a+b).classList.add("wk"); a = newLine(a)}
        else if (fen[i] == 'r') {document.getElementById(a+b).classList.add("br"); a = newLine(a)}
        else if (fen[i] == 'R') {document.getElementById(a+b).classList.add("wr"); a = newLine(a)}
        else if (fen[i] == 'n') {document.getElementById(a+b).classList.add("bn"); a = newLine(a)}
        else if (fen[i] == 'N') {document.getElementById(a+b).classList.add("wn"); a = newLine(a)}
        else if (fen[i] == 'b') {document.getElementById(a+b).classList.add("bb"); a = newLine(a)}
        else if (fen[i] == 'B') {document.getElementById(a+b).classList.add("wb"); a = newLine(a)}
        else if (fen[i] == 'q') {document.getElementById(a+b).classList.add("bq"); a = newLine(a)}
        else if (fen[i] == 'Q') {document.getElementById(a+b).classList.add("wq"); a = newLine(a)}}}

let a = []
let b = []
let leg_moves = []
setBoard(fen)
document.querySelector('table').onclick = (event) => {
  if (event.target.tagName != 'TD')
    return
  if (a.length == 0) {
    if (event.target.classList.length == 2) {
        if (event.target.classList[1][0] == chess.turn()) {
            event.target.classList.toggle("blur")
            a = [event.target.id]
            leg_moves = chess.moves({ square: a[0], verbose: true })
            for (let i = 0; i < leg_moves.length; i++) {
              document.getElementById(leg_moves[i].to).classList.add('pblur')
            }
        } else
            return
    } else
        return
  } else {
      a.push(event.target.id)
      let move = a[0] + a[1]
      if ((a[0][1] == 7 && a[1][1] == 8 && document.getElementById(a[0]).classList[1] == 'wp') || (a[0][1] == 2 && a[1][1] == 1 && document.getElementById(a[0]).classList[1] == 'bp')) {
        let move_figure = prompt('Какая фигура (маленькими буквами)?')
        if (move_figure.length == 0) move_figure = 'q'
        move += move_figure}
      if (isLegal(move)) {
        for (let i = 0; i < leg_moves.length; i++) {
          document.getElementById(leg_moves[i].to).classList.remove('pblur')
        }
        console.log(move)
        chess.move(move)
        console.log(chess.fen())
        setBoard(chess.fen())
        if (b.length == 2) {
        document.getElementById(b[0]).classList.remove("mblur")
        document.getElementById(b[1]).classList.remove("mblur")}
        document.getElementById(a[0]).classList.toggle("mblur")
        document.getElementById(a[1]).classList.toggle("mblur")
        if (!chess.isGameOver()) {
        let c = a
        fetch('http://localhost:8000', {
          method: 'POST',
          body: chess.fen(),
          headers: {'Content-Type': 'text/plain'}})
        .then(response => response.text())
        .then(data => {
            b = [data[0] + data[1], (data[2] + data[3])]
            console.log(data)
            chess.move(data)
            console.log(chess.fen())
            setBoard(chess.fen())
            document.getElementById(c[0]).classList.remove("mblur")
            document.getElementById(c[1]).classList.remove("mblur")
            document.getElementById(b[0]).classList.toggle("mblur")
            document.getElementById(b[1]).classList.toggle("mblur")
            if (chess.isGameOver()) {
                setTimeout(function() {
                    console.log("Game Over")
                    console.log(chess.pgn())
                    if (confirm("Партия окончена, начать заново?")) {document.getElementById(b[0]).classList.remove("mblur"); document.getElementById(b[1]).classList.remove("mblur"); main()}}, 500)}})
        .catch(error => console.error(error))}
        if (chess.isGameOver()) {
            setTimeout(function() {
                console.log("Game Over")
                console.log(chess.pgn())
                if (confirm("Партия окончена, начать заново?")) {document.getElementById(a[0]).classList.remove("mblur"); document.getElementById(a[1]).classList.remove("mblur"); main()}}, 500)}
        a = []
      } else {
          if (a[0] == a[1]) {
            document.getElementById(a[0]).classList.remove("blur")
            for (let i = 0; i < leg_moves.length; i++) {
              document.getElementById(leg_moves[i].to).classList.remove('pblur')
            }
            a = []
            return
          }
          if (event.target.classList.length > 1 && event.target.classList[1][0] == chess.turn()) {
           document.getElementById(a[0]).classList.remove("blur")
            for (let i = 0; i < leg_moves.length; i++) {
              document.getElementById(leg_moves[i].to).classList.remove('pblur')
            }
            a = [event.target.id]
            event.target.classList.toggle("blur")
            leg_moves = chess.moves({ square: a[0], verbose: true })
            for (let i = 0; i < leg_moves.length; i++) {
              document.getElementById(leg_moves[i].to).classList.add('pblur')
            }
          }
        }
    }
}}
main()