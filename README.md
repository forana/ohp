# ohp

A web framework of sorts to get you up and running quickly with minimal amounts of dynamic content. Pronounced 'ope', like the midwestern greeting to inanimate objects.

Think of this kind of like PHP. It's slightly less icky, even, and gets you to similar places.

## Why?

Every so often, I have an idea for a silly web-based project. The professional in me says that I should use whatever the current community favorite framework is. This almost always takes me to Node, which takes me to a 12-layer dip of convoluted frameworks and transpilers and polyshim endofunctors that, by the time I'm up to speed and gotten code working, I'm tired, I'm overcaffeinated, I'm frustrated, the day is ruined, and I never actually get back to my silly idea. The world needs more silly projects, so here's a silly project to make other silly projects easier.

## What is it _really_?

It's a simple node-based web server that can automatically render [EJS templates](http://ejs.co/). It's not fast and it's not pretty, but it works. I don't recommend running it in production (or really outside of an isolated container).

## Installation

You'll need [npm](https://www.npmjs.com/get-npm).

```sh
npm install -g ohp
```

## Running

```sh
ohp <path-to-file-root>
```

For example, to run the [hello-world example](https://github.com/forana/ohp/tree/master/examples/hello-world) from this root of this repo:

```sh
ohp examples/hello-world
```

For command-line options, run `ohp --help`.

## Running examples

Follow installation above. Clone this repo, then, from the root:

```sh
ohp examples/hello-world
```

If you don't want to install `ohp` globally, you can use [yarn](https://yarnpkg.com/en/docs/install/) instead:

```sh
yarn && yarn start examples/hello-world
```

Either way, navigate to `http://localhost:8080/` to check it out.

## Dynamic content

`ohp` bundles [EJS](http://ejs.co/) - any file ending with `.ejs` will be rendered as an EJS template (other files are just piped on through). Directories use `index.html.ejs`, `index.ejs`, or `index.html` in that order. Files can be requested without the `.ejs` extension and `ohp` will find them - for example, a request for `/example.html` will check if `/example.html.ejs` exists, and use it if it does.

## Logging

`ohp` logs to standard out. Pipe that somewhere else if you need it somewhere else.

## License

MIT
