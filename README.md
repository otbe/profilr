#profilr
[![Build Status](https://travis-ci.org/otbe/profilr.svg?branch=master)](https://travis-ci.org/otbe/profilr)
[![Coverage Status](https://coveralls.io/repos/github/otbe/profilr/badge.svg?branch=master)](https://coveralls.io/github/otbe/profilr?branch=master)

*profilr* is a very tiny profiling library for your functions. It tracks down the execution time of each call and emits events.
It also supports functions that return a ```Promise```, so ```async```/```await``` can be tracked too. :)
It tries to add as less as possible overhead to the decorated or wrapped functions.

Basically *profilr* is unoptionated in what you're doing with this events. It does not log or evaluate something.
You have to add a consumer for this events. See the ```Consumers``` section.

##Install

```npm i profilr --save```

##Usage
*profilr* is written in TypeScript and typings are available. It can be used with TypeScript decorators, babel decorators and as a function wrapper.

```javascript
import { profile, useProfilr } from 'profilr';

useProfilr(true);

class MyService {
  constructor() {
    // fnName will be an empty string, but events will be labeled with 'getNumberOfRows'
    const getNumberOfRows = profile(() => 5, 'getNumberOfRows');

    // fnName will be 'getNumberOfColumns'
    const getNumberOfColumns = profile(function getNumberOfColumns() { return 5 });
  }

  @profile() // fnName will be 'expensiveComputation'
  expensiveComputation (): number {
    return 1*1;
  }

  @profile({ custom: 'foo' }) // fnName will be 'remoteApiCall'
  remoteApiCall (): Promise<number> {
    return new Promise((resolve) => resolve(5));
  }
}
```
See tests for more usage information.

##Consumers
First consumer will be a react devtool like known from redux and mobx, but its not finished yet.

Stay tuned!

##API
All functions are available at the top level import.

###useProfilr
```
useProfilr(active: boolean)
```
Enables or disables *profilr*. The decorated or wrapped functions will still have some logic from *profilr*, but the overhead
is negligible. *profilr* is enabled by default.

###profile
```profile``` is a function wrapper or class method decorator which can be used to profile your function calls.

Function wrapper signatures:
```javascript
function profile<T extends Function> (fn: T): T;
function profile<T extends Function> (fn: T, label: string): T;
function profile<T extends Function> (fn: T, options: ProfileOptions): T;
function profile<T extends Function> (fn: T, label: string, options: ProfileOptions): T;
```

Class method decorators:
```javascript
function profile (): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
function profile (label: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
function profile (options: ProfileOptions): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
function profile (label: string, options: ProfileOptions): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
```

Parameter | Description
------------ | -------------
```fn``` | Function to be profiled
```label``` | Consumers can group several functions based on this string.
```options``` | Configuration object. For now it only holds a ```custom``` field, which can be used to send custom data to a consumer.
###registerEventCallback
```
function registerEventCallback(cb: EventCallback): () => void
```
Registers a callback for events produced by *profilr*. It returns a dispose function.
Only one parameter will be passed to the callback and it looks like this example:

```javascript
{
  id: 1,                            // each profiled function has an unique id
  fnName: 'map',                    // inferred name of function
  label: 'Part of Array prototype', // label
  duration: 50,                     // duration in ms
  result: [],                       // result of this call
  options: {
    custom: 'test'                  // custom data
  }
}
```

##Dependencies
*profilr* comes without dependencies, but it needs a [Reflect Metadata API](https://www.npmjs.com/package/reflect-metadata)
polyfill if your environment does not support it.
