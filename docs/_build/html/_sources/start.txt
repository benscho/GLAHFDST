Getting Started
===============

Overview
--------
Here's what you will need to get started running the GLAHF Explorer on your own machine. This document will cover both a local copy for testing purposes and a deployment to an actual webserver.

Local Copy
----------
To set up a local copy for testing:

#. Download a .zip of the repository from github (`Link <https://github.com/benscho/GLAHFDST>`_), and unzip it with your software of choice to a location of your choice.
#. Navigate into the 'viewer' folder.
#. shift + right click and select "Open Command Window here".
#. In the command window, type "python -p SimpleHTTPServer *port*" followed by a port number of your choosing (port 8001 is a reasonable value if you do not care otherwise).
#. Now, open a web browser and navigate to: http://127.0.0.1:*port*/ - you should see your local copy up and running! Note that when making rapid local changes you may need to clear your cache in order to see them.

A python webserver is merely the simplest solution, any other web server with 'viewer' as the root should be perfectly fine for testing purposes. If you are having trouble with the Python webserver, please ensure that you have
Python properly installed and the environment variables properly configured (`Basic Walkthough <https://docs.python.org/2/using/>`_). 

Deploy to a server
------------------
Things are a little more tricky here. Most webservers should work fine, but if you want the Print function to work you need to use a server that supports the cURL, OpenSSL, and PDO_SQLITE PDO PHP extensions.
This should be any server with PHP 5.4.2 or later.

To deploy to a pre-configured server, such as the glahf.org server, follow these steps:

#. Download a .zip of the repository from github (`Link <https://github.com/benscho/GLAHFDST>`_), and unzip it with your software of choice to a location of your choice.
#. Download or select a file manager of your choice (WinSCP is an adequate free one).
#. Using your kerberos credentials, log glahf.sites.uofmhosting.net port 22
#. Navigate to /data/glahf/public_html/explorer/
#. From here you can either upload your new/changed files, or delete everything in the /explorer/ folder on the server and reupload it. I typically do a full delete and reupload for simplicity.

You're done! Note that it can take some time (30min - 1hr) for your changes to show up on the live site after you upload them - the server has it's own cache.

Geoprocessing
-------------
In order for tasks like the Criteria function to operate, you'll need a corresponding geoprocessing service running on the server. The currently used geoprocessing service is a python script titled "criteriaIntersect.py"
which is included in the repository under the "Geoprocessing" sub-folder. To set this service up, use the following steps:

#. Open ArcCatalog or ArcMap (either will work, but this will mainly be written from the perspective of ArcCatalog)
#. In the catalog tree, navigate to "My Toolboxes" and create a new toolbox (I named mine "Criteria")
#. Right click on the toolbox and select Add > Script...
#. Add the criteriaIntersect.py script
#. Right click on the script and select "Properties". On the Parameters tab, make sure you have two variables - a required input String (can be named whatever you want, but be consistent) and a derived output Feature Class.
#. Right click on the toolbox again. Select New > Model...
#. Drag the "criteriaIntersect" script into the model window
#. In the model window, select Insert > Create Variable. Select "String"
#. Using the "Connect" command from the model window toolbar (icon is two boxes connected by a line), connect your String to the script. When prompted, select "layerData" for the String.
#. Right click "String" and select "Model Parameter". Do this for "Output" as well.
#. Save your model. Now right click and select "Properties". On the Parameters tab, make sure you have two variables - a required String, and a derived Feature Class.
#. Double click on the model to run it. You'll need to provide at least one layer query URL. You can get these from running a criteria service with the debugging console open.
#. When the script succeeds, you'll be able to view the results in the "Results" pane on the far left. Right click them and select "Share As" > "Service"
#. Select the server you'd like to share this service on. You'll have to enter some configuration settings, which will probably depend on your servers configuration.
#. Once the service has finished uploading, make sure it is publicly accessible (if you want it to be). Test it to make sure everything is working. Otherwise, you're done!

Documentation
-------------
The documentation is created using a template from `Sphinx <http://www.sphinx-doc.org/en/stable/rest.html>`_ and `ReadTheDocs <http://docs.readthedocs.org/en/latest/index.html>`_ - making it
easy to extend and apply, and relatively well-documented. 

To create a new build of the documentation, navigate to the /docs/ folder, open a command window and enter "make html" - this will cause a rebuild of the documentation. All of the existing .rst files will be 
recompiled. The results are viewable locally under *path_to_docs*/docs/_build_html/index.html, and globally `here <http://glahfdst.readthedocs.org/en/latest/index.html>`_. Simply upload the documents along with a regular git
operation to keep things up to date.

Git
---
Git is a free code repository software. It's extremely useful for collobrating and sharing code. No account is required to download code, but an account is required to commit. I recommend using the GitHub program,
as it is pretty simple to use for managing changes to a branch. 