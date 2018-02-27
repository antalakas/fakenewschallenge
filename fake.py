from util import *
import random
import tensorflow as tf
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import json
import uuid

# Set file names
file_train_instances = "train_stances.csv"
file_train_bodies = "train_bodies.csv"
file_test_instances = "test_stances_unlabeled.csv"
file_test_bodies = "test_bodies.csv"
file_predictions = 'predictions_test.csv'

# Initialise hyperparameters
lim_unigram = 5000
target_size = 4
hidden_size = 100
l2_alpha = 0.00001

# Load data sets
raw_train = FNCData(file_train_instances, file_train_bodies)
raw_test = FNCData(file_test_instances, file_test_bodies)

# Process data sets
train_set, train_stances, bow_vectorizer, tfreq_vectorizer, tfidf_vectorizer = \
    pipeline_train(raw_train, raw_test, lim_unigram=lim_unigram)
feature_size = len(train_set[0])

# ----------------------------------------------------------------------------------------------------------------------
# Define model

# Create placeholders
features_pl = tf.placeholder(tf.float32, [None, feature_size], 'features')
stances_pl = tf.placeholder(tf.int64, [None], 'stances')
keep_prob_pl = tf.placeholder(tf.float32)

# Infer batch size
batch_size = tf.shape(features_pl)[0]

# Define multi-layer perceptron
hidden_layer = tf.nn.dropout(tf.nn.relu(tf.contrib.layers.linear(features_pl, hidden_size)), keep_prob=keep_prob_pl)
logits_flat = tf.nn.dropout(tf.contrib.layers.linear(hidden_layer, target_size), keep_prob=keep_prob_pl)
logits = tf.reshape(logits_flat, [batch_size, target_size])

# Define L2 loss
tf_vars = tf.trainable_variables()
l2_loss = tf.add_n([tf.nn.l2_loss(v) for v in tf_vars if 'bias' not in v.name]) * l2_alpha

# Define overall loss
loss = tf.reduce_sum(tf.nn.sparse_softmax_cross_entropy_with_logits(logits, stances_pl) + l2_loss)

# Define prediction
softmaxed_logits = tf.nn.softmax(logits)
predict = tf.arg_max(softmaxed_logits, 1)

# ----------------------------------------------------------------------------------------------------------------------
# Load model
sess = tf.Session()
load_model(sess)


def get_prediction(headline, body_text):
    test_set = pipeline_single(headline, body_text, bow_vectorizer, tfreq_vectorizer, tfidf_vectorizer)

    # Predict
    test_feed_dict = {features_pl: test_set, keep_prob_pl: 1.0}
    test_pred = sess.run(predict, feed_dict=test_feed_dict)

    # Get prediction
    return get_predictions(test_pred)


# Web server
app = Flask(__name__)
CORS(app)

# curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:5000/test_article
@app.route("/test_article")
def test_artice():
    print('--- TEST New article classification TEST ---')
    headline = 'Ferguson riots: Pregnant woman loses eye after cops fire BEAN BAG round through car window'
    print('HEADLINE: ' + headline)
    body_text = 'A Facebook post By Tikal goldie showed a image of her sister Lenora hospitalized from rubber bullets fired in Ferguson, Mo on Monday. We were tagged in a Instagram post this morning and decided to do more research before we posted this story. We donâ€™t have all the facts but we know this young lady will now loose her left eye do to this situation. Apparently her boy friend was arrested and charged with a felony for trying to run a police officer over.  Above the original photo posted via Facebook. We will continue to keep you updated as this story develops.'
    print('TEXT: ' + body_text)

    result = get_prediction(headline, body_text)
    print('STANCE: ' + result)

    return jsonify({
        'stance': result,
        'headline': headline,
        'body_text': body_text
    })


# curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST -d '{"headline": "Ferguson riots: Pregnant woman loses eye after cops fire BEAN BAG round through car window", "body_text": "A Facebook post By Tikal goldie showed a image of her sister Lenora hospitalized from rubber bullets fired in Ferguson, Mo on Monday. We were tagged in a Instagram post this morning and decided to do more research before we posted this story. We donâ€™t have all the facts but we know this young lady will now loose her left eye do to this situation. Apparently her boy friend was arrested and charged with a felony for trying to run a police officer over.  Above the original photo posted via Facebook. We will continue to keep you updated as this story develops."}' http://localhost:5000/classify_article
@app.route("/classify_article", methods=['POST'])
def classify_article():
    content = request.get_json()

    print('--- New article classification ---')
    headline = content.get('headline')
    print('HEADLINE: ' + headline)
    body_text = content.get('body_text')
    print('TEXT: ' + body_text)

    result = get_prediction(headline, body_text)
    print('STANCE: ' + result)

    return jsonify({
        'stance': result,
        'headline': headline,
        'body_text': body_text
    })


# {0: 'agree', 1: 'disagree', 2: 'discuss', 3: 'unrelated'}
# curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST -d '{"headline": "Ferguson riots: Pregnant woman loses eye after cops fire BEAN BAG round through car window", "body_text": "A Facebook post By Tikal goldie showed a image of her sister Lenora hospitalized from rubber bullets fired in Ferguson, Mo on Monday. We were tagged in a Instagram post this morning and decided to do more research before we posted this story. We donâ€™t have all the facts but we know this young lady will now loose her left eye do to this situation. Apparently her boy friend was arrested and charged with a felony for trying to run a police officer over.  Above the original photo posted via Facebook. We will continue to keep you updated as this story develops.", "stance": "agree"}' http://localhost:5000/stance_article
@app.route("/stance_article", methods=['POST'])
def stance_article():
    content = request.get_json()

    print('--- New stance persistence ---')
    headline = content.get('headline')
    print('HEADLINE: ' + headline)
    body_text = content.get('body_text')
    print('TEXT: ' + body_text)
    stance = content.get('stance')
    print('STANCE: ' + stance)

    filename = './stances/' + str(uuid.uuid4()) + '.json'

    with open(filename, 'w') as outfile:
        json.dump(content, outfile)

    return jsonify({
        'result': 'OK'
    })
