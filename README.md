# Rotcet
A cinema website

## Live version
[Rotcet Cinema Demo](https://rotcetcinemademo.com)

## Prerequisites

This project requires NodeJS (version 18), NPM and Python 3.9.

## Table of contents

- [Project Name](#rotcet)
  - [Live version](#live-version)
  - [Prerequisites](#prerequisites)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
    - [Serving the app](#serving-the-app)
    - [Running the tests](#running-the-tests)
    - [Building a distribution version](#building-a-distribution-version)
  - [Built Using](#built-using)

## Installation

Start with cloning this repo on your local machine.

Run:

```sh
$ pip install -r requirements.txt
```

And in src/RotcetReact:

```sh
$ npm install
```

## Usage

### Serving the app

In src/RotcetDjango
```sh
$ python manage.py runserver
```

In src/RotcetReact
```sh
$ npm run dev
```
This task will create a development version of the project
inside RotcetDjango/static/frontend

### Running the tests

```sh
$ npm test
```

```sh
$ python manage.py test
```

### Building a distribution version

```sh
$ npm run build
```

This task will create a distribution version of the project
inside RotcetDjango/static/frontend

## Built Using

* React
* Django
* Django Rest Framework
* SCSS
* Webpack
