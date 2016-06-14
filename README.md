#profilr
[![Build Status](https://travis-ci.org/otbe/profilr.svg?branch=master)](https://travis-ci.org/otbe/profilr)
[![Coverage Status](https://coveralls.io/repos/github/otbe/profilr/badge.svg?branch=master)](https://coveralls.io/github/otbe/profilr?branch=master)

*profilr* is a very tiny profiling library for your functions. It tracks down the execution time of each call and emits events.
It also supports functions that return a ```Promise```, so ```async```/```await``` can be tracked too. :)
It tries to add as less as possible overhead to the decorated or wrapped functions.

Basically *profilr* is unoptionated in what you're doing with this events. It does not log or evaluate something.
You have to add a consumer for this events. See the ```Consumers``` section.

##Install

```npm i profilr --save-dev```

##Usage
Its written in TypeScript and typings are available. It can be used with TypeScript decorators and babel decorators.

```javascript
import { profile, useProfilr } from 'profilr'

useProfilr(true);

class MyService {
  constructor() {
    const getNumberOfRows = profile(() => 5, { label: 'getNumberOfRows' }); // will be reported as 'getNumberOfRows'
    const getNumberOfColumns = profile(function getNumberOfColumns() { return 5 }); // will be reported as 'getNumberOfColumns'
  }

  @profile() // will be reported as 'expensiveComputation'
  expensiveComputation (): number {
    return 1*1;
  }

  @profile({ label: 'fetchUsers' }) // will be reported as 'fetchUsers'
  remoteApiCall (): number {
    return new Promise((resolve) => resolve(5));
  }
}
```

##Consumers


##API
All functions are available at the top level import.

###useProfilr
```useProfilr(active: boolean)```
Enables or disable *profilr*. The decorated or wrapped functions will still have some logic from *profilr*, but the overhead
is negligibly.

###profile
Function wrappers:
```
function profile<T extends Function> (fn: T): T
function profile<T extends Function> (fn: T, custom: Object): T
function profile<T extends Function> (fn: T, label: string, custom?: Object): T
```

```fn``` is the function to be profiled.
```label``` is a string that will be used to identify the function. In most cases this needed,
but *profilr* will try to infer this from the function name. See ```Usage```
```custom``` is an object that will be passed to the consumer.

Class method decorators:
```
function profile (): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
function profile (custom: Object): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
function profile (label: string, custom?: Object): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
```

Same as for function wrappers, but this time ```label``` is not needed, because *profilr* will infer this
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
  custom: custom     // custom data
}
```

##Dependencies
*profilr* comes without dependencies :)
