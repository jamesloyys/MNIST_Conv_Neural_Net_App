from flask import Flask, render_template, request, jsonify
import numpy as np
import sys
import tensorflow as tf
import re
sys.path.append('./models')
import cnn
from scipy.misc import imsave, imread, imresize, imshow
import base64
from scipy.ndimage.interpolation import zoom
from math import sqrt

# Function to convert an image from base64 into raw representation
def convertImage(imgData1):
	imgstr = re.search(r'base64,(.*)',imgData1).group(1)
	with open('./output.png','wb') as output:
		output.write(base64.b64decode(imgstr))

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.route('/')
def index():
	return render_template('template.html')


@app.route('/mnist', methods=['GET', 'POST'])
def predict():
	ret = request.json
	print(type(ret))
	convertImage(ret)
	input = imread('output.png',mode='L')
	input = np.invert(input)
	input = zoom(input, 30.0/sqrt(input.size))
	input = np.delete(input, input.shape[0]-1, 1)
	input = np.delete(input, 0, 1)
	input = np.delete(input, input.shape[0]-1, 0)
	input = np.delete(input, 0, 0)
	input = input.reshape(1, 784)

	prediction, prob_array = cnn.predict(input)
	tf.reset_default_graph()
	return jsonify(results=[prediction, prob_array.tolist()])
