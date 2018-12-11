# sn-repository-events

------
### This package is not under active development. You can find our latest packages in the [sensenset/sn-client](https://github.com/sensenet/sn-client) monorepo.
------


[![Gitter chat](https://img.shields.io/gitter/room/SenseNet/SN7ClientAPI.svg?style=flat)](https://gitter.im/SenseNet/SN7ClientAPI)
[![Build Status](https://travis-ci.org/SenseNet/sn-repository-events.svg?branch=master)](https://travis-ci.org/SenseNet/sn-repository-events)
[![codecov](https://codecov.io/gh/SenseNet/sn-repository-events/branch/master/graph/badge.svg)](https://codecov.io/gh/SenseNet/sn-repository-events)
[![Greenkeeper badge](https://badges.greenkeeper.io/SenseNet/sn-repository-events.svg)](https://greenkeeper.io/)
[![NPM version](https://img.shields.io/npm/v/@sensenet/repository-events.svg?style=flat)](https://www.npmjs.com/package/@sensenet/repository-events)
[![NPM downloads](https://img.shields.io/npm/dt/@sensenet/repository-events.svg?style=flat)](https://www.npmjs.com/package/@sensenet/repository-events)
[![License](https://img.shields.io/github/license/SenseNet/sn-client-js.svg?style=flat)](https://github.com/sn-repository-events/LICENSE.txt)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat)](http://commitizen.github.io/cz-cli/)

This NPM package contains *event observables* that can be used for tracking sensenet repository events.

## Installation

```shell
npm install @sensenet/repository-events
```

## Usage

```ts
const repository = new Repository({});
const eventHub = new EventHub(repository);

// subscribe to a Content Created event
eventHub.onContentCreated.subscribe((createdContent) => {
    console.log("New Content created:", createdContent);
});
```

The available events are:
 - onContentCreated
 - onContentCreateFailed
 - onContentModified
 - onContentModificationFailed
 - onContentLoaded
 - onContentDeleted
 - onContentDeleteFailed
 - onCustomActionExecuted
 - onCustomActionFailed
 - onContentMoved
 - onContentMoveFailed
