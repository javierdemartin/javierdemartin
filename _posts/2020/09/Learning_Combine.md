---
title: Learning Combine 
author: Javier de Martín
date: 2020-09-26
published: false
---

# Learning Combine

I have been struggling to properly learn Combine. There's something that hasn't clicked on my head **yet** on how to build things with this framework. By no means I am an expert, I am only writing this to gather the resources I've been using and that might also be helpful for you. Or probably me in the future too...

## What **you should** know?

1. Publisher and Subscribers
2. Operators
3. Subjects

### Publisher and Subscriber

[Publisher](https://developer.apple.com/documentation/combine/publisher#) and [Subscriber](https://developer.apple.com/documentation/combine/subscriber) are described as protocols.

A Publisher provides data when available and upon request. A Publisher thas has not had any suscription requests will not provide any data.


## Tidbits

* The `map` operator doesn't change or interact with the failure type, only passing it along.
* Combine is designed in a way that the suscriber controls the flow of data. Also controlling processing that happens in the pipeline. This is known as **back-pressure**.
* The suscriber drives the processing within a pipeline by providing information about how much information wants or can accept.
* A suscriber conected to a publisher requests data with a specific [demand](https://developer.apple.com/documentation/combine/subscribers/demand).
* Combine supports cancellation as all of the Subscribers conform to the Cancellable protocol.
* Rando publishers: Just empty record observable object, future, sequence. published, share, deferred, fail, multicast...
