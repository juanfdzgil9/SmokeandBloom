import os
import http.server
import socketserver

PORT = 8000
DIRECTORY = "."

class CleanURLRequestHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Default behavior gets the absolute path
        original_path = super().translate_path(path)
        
        # If the path exactly matches a directory or file that exists, serve it
        if os.path.exists(original_path):
            return original_path
            
        # Otherwise, if appending .html matches a file, serve that instead
        # This mimics the .htaccess rewrite rule:
        # RewriteCond %{REQUEST_FILENAME}.html -f
        # RewriteRule ^(.+)$ $1.html [L]
        html_path = original_path + ".html"
        if os.path.exists(html_path):
            return html_path
            
        # Fallback to the original path (will likely result in a 404)
        return original_path

Handler = CleanURLRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at port {PORT} with clean URL (.html) support...")
    httpd.serve_forever()
