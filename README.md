# Pencil Task

This is a task interview delivery. I won't put a lot of description here unless I get the permission from the task owners first.

## Prerequisites

If you are going to run it locally you need to have the following installed already

* Docker        v24.0.2
* DockerCompose v2.18.1
* npm           v9.5.1
* node          v18.16.0

## Installation

* You need to fork my repository: `https://github.com/AmrAdelKhalil/Pencil_task` and install the repository OR you can download it.
* Get inside the project using `cd` command

## Usage

* You can access the deployed application using
```
https://pencil-simple-task.onrender.com/search?q=Movement%20of%20Substances
```
Feel free to change the `q` parameter in the URL
> Pleaes notice it might take sometime for the response as it is a free tier app

* You can run it locally using `docker-compose`
```
docker-compose up --build
```
then you can access the application using the following URL:
```
http://localhost:8080/search?q=Movement%20of%20Substances
```

## Insights about the task

* To make the task easy I only returned a json contains the questions ids only
* I used a tree structure in mongoDB between documents to correlate between them
* I inserted the questions ids directly as a normalization to make it easy fast to read and compromised the writing/updating (for the task level).
* I used `$graphLookup` which is fast to retreive the tree sub tree.

## What does this task miss

* Test cases
* DB wrapper
* Background task for seeding the DB instead of direct call
