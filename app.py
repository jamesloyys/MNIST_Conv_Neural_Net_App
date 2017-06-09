from flask import Flask, render_template, request, jsonify
import numpy as np
import sys
import tensorflow as tf
sys.path.append('./models')
import cnn

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


@app.route('/')
def index():
	return render_template('template.html')


@app.route('/mnist', methods=['GET', 'POST'])
def predict():
	input = ((255 - np.array(request.json, dtype=np.uint8)) / 255.0).reshape(1, 784)
	prediction, prob_array = cnn.predict(input)
	tf.reset_default_graph()
	print(prob_array.tolist())
	return jsonify(results=[prediction, prob_array.tolist()])

