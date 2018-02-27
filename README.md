# UI for UCL Machine Reading - FNC-1 Submission

A work to add a user interface to UCL Machine Reading - FNC-1 Submission
by means of a Chrome Extension. An article based scrapper is used to 
extract information (headline /text) to feed the algorithm.

## Quick start

<a href="https://github.com/antalakas/fakenewschallenge/tree/master/javascript/defence.crx" target="_blank">Download extension</a>
Then drag n drop into extensions page in Chrome


## Getting started (installing server side modules for development):
1. Install Python3, npm, node.js
2. Clone the repo
3. cd fakenewschallenge
4. virtualenv -p python3 venv
5. source ./venv/bin/activate
6. pip install flask
7. pip install numpy
8. pip install scikit-learn
9. pip install scipy
9.5. pip install -U flask-cors
10. pip install tensorflow==0.12.1
11. ./fake.sh : starts the web server
12. things to try:

    * Tests the installation:
    
    ```
    curl -i -H "Accept: application/json" -H "Content-Type: application/json" 
    -X GET http://localhost:5000/test_article
    ```
    
    * result
    
    ```
    {
          "body_text": "A Facebook post By Tikal goldie showed a image of her sister Lenora hospitalized from rubber bullets fired in Ferguson, Mo on Monday. We were tagged in a Instagram post this morning and decided to do more research before we posted this story. We don\u00e2\u20ac\u2122t have all the facts but we know this young lady will now loose her left eye do to this situation. Apparently her boy friend was arrested and charged with a felony for trying to run a police officer over.  Above the original photo posted via Facebook. We will continue to keep you updated as this story develops.",
          "headline": "Ferguson riots: Pregnant woman loses eye after cops fire BEAN BAG round through car window",
          "stance": "discuss"
    }
    ```
    
    * Classifies article
    
    ```
    curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST -d 
    '{"headline": "Ferguson riots: Pregnant woman loses eye after cops fire BEAN BAG round 
    through car window", "body_text": "A Facebook post By Tikal goldie showed a image of 
    her sister Lenora hospitalized from rubber bullets fired in Ferguson, Mo on Monday. 
    We were tagged in a Instagram post this morning and decided to do more research before 
    we posted this story. We donâ€™t have all the facts but we know this young lady will 
    now loose her left eye do to this situation. Apparently her boy friend was arrested 
    and charged with a felony for trying to run a police officer over.  Above the original 
    photo posted via Facebook. We will continue to keep you updated as this story develops."}' 
    http://localhost:5000/classify_article
    ```
    
    * result
    
    ```
    {
      "body_text": "A Facebook post By Tikal goldie showed a image of her sister Lenora hospitalized from rubber bullets fired in Ferguson, Mo on Monday. We were tagged in a Instagram post this morning and decided to do more research before we posted this story. We don\u00e2\u20ac\u2122t have all the facts but we know this young lady will now loose her left eye do to this situation. Apparently her boy friend was arrested and charged with a felony for trying to run a police officer over.  Above the original photo posted via Facebook. We will continue to keep you updated as this story develops.",
      "headline": "Ferguson riots: Pregnant woman loses eye after cops fire BEAN BAG round through car window",
      "stance": "discuss"
    }
    ```
    
    * Suggests a new classification, the result is stored as a json file under ./stances folder:
    
    ```
    curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST -d 
    '{"headline": "Ferguson riots: Pregnant woman loses eye after cops fire BEAN BAG round 
    through car window", "body_text": "A Facebook post By Tikal goldie showed a image of 
    her sister Lenora hospitalized from rubber bullets fired in Ferguson, Mo on Monday. 
    We were tagged in a Instagram post this morning and decided to do more research before 
    we posted this story. We donâ€™t have all the facts but we know this young lady will 
    now loose her left eye do to this situation. Apparently her boy friend was arrested 
    and charged with a felony for trying to run a police officer over.  Above the original 
    photo posted via Facebook. We will continue to keep you updated as this story develops.", 
    "stance": "agree"}' http://localhost:5000/stance_article
    ```
 
     * result
     
    ```
    {
      "result": "OK"
    }
    ```
    
 13. in a new console cd to fakenewschallenge/javascript/extractor
 14. npm install --save unfluff
 15. npm install --save request
 16. npm install --save cors
 17. npm install --save express
 18. ./extractor.sh: runs on port http://localhost:5005
 19. things to try:
    * scraps an article
    
    ```
    curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST -d 
    '{"url":"https://www.reuters.com/article/us-usa-immigration-ruling/second-u-s-judge-blocks-trump-administration-from-ending-daca-program-idUSKCN1FX2TJ"}' 
    http://localhost:5005/getArticleInfo
    ```
    
    * result:
    
    ```
    {
       "title": "Second U.S. judge blocks Trump administration from ending DACA program",
       "softTitle": "Second U.S. judge blocks Trump administration from ending DACA program",
       "date": "February 13, 2018 / 8:57 PM / 14 days ago",
       "author": [
          "Dan Levine"
       ],
       "publisher": "U.S.",
       "copyright": "2018 Reuters",
       "favicon": "https://s3.reutersmedia.net/resources_v2/images/favicon/favicon.ico",
       "description": "A second U.S. judge on Tuesday blocked President Donald Trump's decision to end a program that protects immigrants brought to the United States illegally as children from deportation.",
       "keywords": "US,USA,IMMIGRATION,RULING,Crime / Law / Justice,Lawmaking,Society / Social Issues,Asylum / Immigration / Refugees,Judicial Process / Court Cases / Court Decisions,Government / Politics,New York City,Fundamental Rights / Civil Liberties,Major News,Human Rights / Civil Rights,US Government News,New York,United States",
       "lang": "en",
       "canonicalLink": "https://www.reuters.com/article/us-usa-immigration-ruling/second-u-s-judge-blocks-trump-administration-from-ending-daca-program-idUSKCN1FX2TJ",
       "tags": [],
       "image": "https://s3.reutersmedia.net/resources/r/?m=02&d=20180214&t=2&i=1231217675&w=1200&r=LYNXNPEE1C1VQ",
       "videos": [],
       "links": [],
       "text": "(Reuters) - A second U. S. judge on Tuesday blocked President Donald Trump’s decision to end a program that protects immigrants brought to the United States illegally as children from deportation.\n\nU. S. District Judge Nicholas Garaufis in Brooklyn ruled that the Deferred Action for Childhood Arrivals program, or DACA, cannot end in March as the Republican administration had planned, a victory for Democratic state attorneys general and immigrants who sued the federal government.\n\nThe decision is similar to a Jan. 9 ruling by U. S. District Judge William Alsup in San Francisco that DACA must remain in place while litigation challenging Trump’s decision continues.\n\nThe legal battle over DACA complicates a debate currently underway in Congress on whether to change the nation’s immigration laws.\n\nThe Supreme Court on Friday is due to consider whether to take up the administration’s appeal of the San Francisco ruling. The court could announce as soon as Friday afternoon whether it will hearing the case.\n\nGaraufis said the administration could eventually rescind the DACA program but that the reasons it gave last September for rescinding it were too arbitrary and could not stand. The judge ordered the administration to process DACA renewal applications on the same terms as had been in place before the president took his action.\n\nIn a statement, U. S. Justice Department spokesman Devin O‘Malley said DACA was implemented unilaterally by Trump’s Democratic predecessor Barack Obama and thus unlawfully circumvented Congress.\n\n“The Justice Department will continue to vigorously defend this position, and looks forward to vindicating its position in further litigation,” O‘Malley said.\n\nOften called “Dreamers,” hundreds of thousands of young adults, mostly Hispanics, have been granted protection from deportation and given work permits under DACA, which was created in 2012."
    }%
    ```
    
20. under fakenewschallenge/javascript/defence, check popup.js and replace the hostname in XMLHttpRequest with localhost



### Follows the original README.md:





<p align="center">
<img src="https://github.com/uclmr/fakenewschallenge/blob/master/images/uclmr_logo.png" alt="UCL Machine Reading" width="25%"/>
</p>

# UCL Machine Reading - FNC-1 Submission

The stance detection model submitted by the [UCL Machine Reading](http://mr.cs.ucl.ac.uk/)
group (UCLMR) for stage number 1 of the [Fake News Challenge](http://www.fakenewschallenge.org/)
(FNC-1) is a single, end-to-end system consisting of lexical as well as
similarity features fed through a multi-layer perceptron (MLP) with one
hidden layer.

Although relatively simple in nature, the model performs on par with
more elaborate, ensemble-based systems of other teams.

The features extracted from the headline and article body pairs consist
of three overarching elements only:

* A bag-of-words term frequency (BoW-TF) vector of the headline
* A BoW-TF vector of the body
* The cosine similarity of term frequency-inverse document frequency
(TF-IDF) vectors of the headline and body

A schematic overview of the setup is provided below. Further detailed
information can be found in a [short paper](http://arxiv.org/abs/1707.03264)
on arXiv and the [model description](https://github.com/uclmr/fakenewschallenge/blob/master/description/uclmr_model_description.pdf)
submitted as part of FNC-1.

<br>
<br>
<p align="center">
<img src="https://github.com/uclmr/fakenewschallenge/blob/master/images/uclmr_model.jpeg" alt="Schematic diagram of UCLMR's model" width="80%"/>
</p>


## Reproducibility

This repository contains the files necessary to reproduce UCLMR's
submission.

Rather than providing seed values and requiring the model to be
retrained, the repository contains relevant scripts and the TensorFlow
model trained as part of the submission.

The submission can easily be reproduced by loading this model using the
`pred.py` script to make the predictions on the relevant test set.

Alternatively, as suggested by the organizers of the competition, the
validity of the submission can be checked by also using the `pred.py`
script to train the model with different seeds and evaluating the
mean performance of the system.

## Getting started

To get started, simply download the files in this repository to a local
directory.

### Prerequisites

The model was developed, trained and tested using the
following:

```
Python==3.5.2
NumPy==1.11.3
scikit-learn==0.18.1
TensorFlow==0.12.1
```

Please note that compatibility of the saved model with newer versions
of `TensorFlow` has not been checked. Accordingly, please use the
`TensorFlow` version listed above.

### Installing

Other than ensuring the dependencies are in place, no separate
installation is required.

Simply execute the `pred.py` file once the repository has been
saved locally.

## Reproducing the submission

The `pred.py` script can be run in two different modes: 'load' or 'train'.
Upon running the `pred.py` file, the user is requested to input
the desired mode.

Execution of the `pred.py` file in 'load' mode entails the
following:

* The train set will be loaded from `train_stances.csv` and
`train_bodies.csv` using the corresponding `FNCData` class defined in
`util.py`.
* The test set will be loaded from `test_stances_unlabeled.csv` and
`train_bodies.csv` using the same `FNCData` class. Please note that
`test_stances_unlabeled.csv` corresponds to the second, amended release
of the file.
* The train and test sets are then respectively processed by the
`pipeline_train` and `pipeline_test` functions defined in `util.py`.
* The `TensorFlow` model saved in the `model` directory is then loaded
in place of the model definition in `pred.py`. The associated
`load_model` function can be found in `util.py`.
* The model is then used to predict the labels on the processed test
set.
* The predictions are then saved in a `predictions_test.csv` file in the
top level of the local directory. The corresponding `save_predictions`
function is defined in `util.py`. The predictions made are equivalent to
those submitted during the competition.

Execution of the `pred.py` file in 'train' mode encompasses steps
identical to those outlined above with the exception of the model being
trained as opposed to loaded from file. In this case, the predictions
will obviously not be identical to those submitted during the
competition.

The file name for the predictions can be changed in section '# Set file
names' at the top of `pred.py`, if required.

Please note that the predictions are saved in chronological order with
respect to the `test_stances_unlabeled.csv` file, however, only the
predictions are saved and not combined with the `Headline` and `Body ID`
fields of the source file.

## Team members

* [Benjamin Riedel](https://www.linkedin.com/in/benjaminriedel/) - Full implementation
* [Isabelle Augenstein](http://isabelleaugenstein.github.io/) - Advice
* [George Spithourakis](http://geospith.github.io/) - Advice
* [Sebastian Riedel](http://www.riedelcastro.org/) - Academic supervision

## Citation

If you use this work in your research, please cite the [short paper](http://arxiv.org/abs/1707.03264)
on arXiv using the following BibTeX entry.

```
@article{riedel2017fnc,
    author = {Benjamin Riedel and Isabelle Augenstein and George Spithourakis and Sebastian Riedel},
    title = {A simple but tough-to-beat baseline for the {F}ake {N}ews {C}hallenge stance detection task},
    journal = {CoRR},
    volume = {abs/1707.03264},
    year = {2017},
    url = {http://arxiv.org/abs/1707.03264}
}
```

## License

This project is licensed under the Apache 2.0 License. Please see the
`LICENSE.txt` file for details.

## Acknowledgements

* Richard Davis and Chris Proctor at the Graduate School of Education
at Stanford University for [the description of their development
efforts for FNC-1](https://web.stanford.edu/class/cs224n/reports/2761239.pdf).
The model presented here is based on their setup.
* Florian Mai at the Department of Computer Science at
Christian-Albrechts Universtität zu Kiel for insightful and constructive
discussions during model development.
* Anna Seg of FNC-1 team 'annaseg' for her suggestions on how to split
the training data for more realistic model evaluation.


