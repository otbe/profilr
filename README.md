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
Its written in TypeScript and typings are available. It can be used with TypeScript decorators and babel decorators.

```javascript
import { profile, useProfilr } from 'profilr';

useProfilr(true);

class MyService {
  constructor() {
    // will be reported as 'getNumberOfRows'
    const getNumberOfRows = profile(() => 5, 'getNumberOfRows');

    // will be reported as 'getNumberOfColumns'
    const getNumberOfColumns = profile(function getNumberOfColumns() { return 5 });
  }

  @profile() // will be reported as 'expensiveComputation'
  expensiveComputation (): number {
    return 1*1;
  }

  @profile('fetchUsers', { custom: 'foo' }) // will be reported as 'fetchUsers' and with custom data
  remoteApiCall (): number {
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
```useProfilr(active: boolean)```
Enables or disables *profilr*. The decorated or wrapped functions will still have some logic from *profilr*, but the overhead
is negligible. *profilr* is enabled by default.

###profile
Function wrappers:
```javascript
function profile<T extends Function> (fn: T): T;
function profile<T extends Function> (fn: T, label: string): T;
function profile<T extends Function> (fn: T, options: ProfileOptions): T;
function profile<T extends Function> (fn: T, label: string, options: ProfileOptions): T;
```

Parameter | Description
------------ | -------------
```fn``` | Function to be profiled
```label``` | String that will be used to identify the function. In most cases this needed, but *profilr* will try to infer this from the function name.
```options``` | Configuration object. For now it only holds a ```custom``` field, which can be used to send custom data to a consumer.

Class method decorators:
```javascript
function profile (): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
function profile (label: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
function profile (options: ProfileOptions): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
function profile (label: string, options: ProfileOptions): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;

```

Same as for function wrappers, but this time ```label``` is not needed at most times, because *profilr* will infer this
from the method name.

###registerEventCallback
```
function registerEventCallback(cb: EventCallback): () => void
```
Registers a callback for events produced by *profilr*. The object thats passed to this callback,
looks like this example:

```
{
  label: 'getArray', // label (name) of function
  duration: 50,      // duraiton in ms
  result: [],        // result of this call
  options: {
    custom: 'test' // custom data
  }
}
```

##Dependencies
*profilr* comes without dependencies :)
