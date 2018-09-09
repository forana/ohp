# Docker example

This is a super basic example of how to use `ohp` in docker. To run this, you'll need a [Docker client](https://www.docker.com/get-started).

## Setup

Run in this directory:

```sh
docker build -t ohp-example .
docker run --rm -it -p 8080:8080 ohp-example
```

Navigate to `http://localhost:8080/` to see the example running.
