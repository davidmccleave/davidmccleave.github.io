import os
from flask import Flask, render_template

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_string'
app._static_folder = os.path.abspath('templates/static/')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)