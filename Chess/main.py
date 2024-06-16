from http.server import BaseHTTPRequestHandler, HTTPServer
import stockfish

stockfish = stockfish.Stockfish('./stockfish_15.1_win_x64/stockfish-windows-2022-x86-64.exe')


class MyHTTPRequestHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        fen = self.rfile.read(content_length).decode('utf-8')
        stockfish.set_fen_position(fen)
        move = stockfish.get_best_move()
        print(move)
        self.send_response(200)
        self.end_headers()
        self.wfile.write(move.encode())


if __name__ == '__main__':
    server_address = ('localhost', 8000)
    httpd = HTTPServer(server_address, MyHTTPRequestHandler)
    httpd.serve_forever()
