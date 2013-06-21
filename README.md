# face-detect-demo
This is a fairly simple face detection demo using Nodejs and the SkyBiometry API.

## How it works
An HTML5 page accesses the user's webcam and shows the current video image.  When the user presses the "Take Picture" button, the current image is sent to the server, which then uploads the image to another server via FTP.  When the client is notified that the upload is complete, another server request calls the SkyBiometry API, using the image URL as input.  The results of SkyBiometry's processing are sent back to the client, which draws a box on the captured image.

## Why this is cool
As you can see (looking though my bad code), the SkyBiometry API is pretty easy to work with.  On top of face detection, SkyBiometry can also perform face recognition, meaning that it can identify individuals if enough training images have been provided.  This means that you could possibly implement some of facial recognition-based authorization scheme (in concert with other methods, of course).

## What you need to run it yourself
* Nodejs
* A SkyBiometry account, which will provide you with your own **api_key** and **api_secret** values.
* FTP access to your webserver (or you can hack the code to store the image somewhere else)

## Why you'd want to do something different
This demo was thrown together relatively quickly, and does a few things that aren't quite "kosher".  These are some of the things that would need to be changed for a real-world implementation:

* The SkyBiometry API wants an image URL as input, meaning that the webcam image must live somewhere online. For this demo, I have chosen to store them on my webserver via FTP.  I'd imagine that an actual implementation would use something a bit more suited to rapid storage and retrieval, like Amazon S3.
* This demo only writes and reads a single image at a time, and is not at all concurrent.  The image name should be linked directory to each user instance, at least.
* The webcam image is stored on the server before being sent out to the FTP site.  The webcam image should be streamed directly to the FTP site (or wherever it will be stored).
* After SkyBiometry has processed the input image, the input image should be deleted.

