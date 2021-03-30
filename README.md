# VueBusy (vue-busy-module)

Application busy/loading state management as a Vuex module.

* Written for Vue 3 and Vuex 4
* Native Typescript support
* Dead simple, fully-tested implementation. Bring your own loader/spinner.

## Installation

```sh
yarn add vue-busy-module
```

## Basic Usage

### 1. Add the plugin to your Vuex store

```ts
import VueBusyModule from "vue-busy-module";

export default createStore({
  /* ... */
  plugins: [VueBusyModule],
});
```

### 2. Dispatch VueBusy actions to indicate the start & completion of activities

```ts
actions: {
  async fetchItems({ dispatch }, payload) {
    dispatch("busy/start", { name: "fetching-items" });

    try {
      const response = await MyApp.fetchService(/* ... */)
      /* ... */
      dispatch("busy/finish", { name: "fetching-items", outcome: "success" });
    } catch (e) {
      // Both `outcome` and `data` are optional
      dispatch("busy/finish", { name: "fetching-items", outcome: "fail", data: { error: e } });
    }
  }
}
```

### 3. Use Vuex helpers in templates to control your custom "Loading" UI elements

This package intentionally does not come with any loaders or spinner UI elements (though you can borrow the
[Spinner](example/components/Spinner.vue) component in the example app if you want).

```vue
<template>
  <Spinner v-if="isBusy('fetching-items')" />
</template>

<script lang="ts">
export default defineComponent({
  computed: {
    ...mapGetters({
      isBusy: "busy/isBusy",
    }),
  }
});
</script>
```

### See more code samples in [example Vue app](/example/App.vue).


## Other examples

### Provide extra `data` when starting and finishing activities

Allows you to pass basic activity metadata to loading/waiting UI without coupling it to business logic.

NOTE: `data` is reset whenever an activity is (re-)started. Finish data is **merged** with start data.

```ts
// in your store
dispatch("busy/start", { name: "get-songs", data: { albumName: "The Wall" } });
dispatch("busy/finish", { name: "get-songs", outcome: "success", data: { numSongs: 26 } });
```
```vue
<!-- in your Vue template -->
<div v-if="isBusy('get-songs')">
  Fetching songs for album {{ getData('get-songs').albumName }}...
</div>
<div v-else-if="getOutcome('get-songs') === 'success'">
  Got {{ getData('get-songs').numSongs }} for album {{ getData('get-songs').albumName }}.
</div>
```

### Group related activities together using your own naming convention

Getters `getBusy` and `getFinished` accept `"*"` wildcards and return matching activities.

```vue
<!-- in your Vue template -->
<div v-if="albumFetches.length > 0">
  Currently fetching {{ albumFetches.length }} records...
</div>
```
```ts
// in component:
computed: {
  ...mapGetters({
    getBusyActivities: "busy/getBusy",
  }),
  albumFetches() {
    this.getBusyActivities("fetch/album/*");
  }
}

// in store:
dispatch("busy/start", { name: "fetch/album/the-wall" })
dispatch("busy/start", { name: "fetch/album/dark-side-of-the-moon" })
dispatch("busy/start", { name: "fetch/album/wish-you-were-here" })
```

## API

The Vuex module is namespaced `busy`, i.e. `busy/isBusy`, `busy/start`, etc.

### Actions

#### `busy/start`

Indicates an activity has started. Accepts payload:

* `name` (required) - unique name of the activity
* `data` (optional) - object hash of activity metadata

Once an activity is started, it is never removed from the state tree. This is by design.
Thus, each time `start` is dispatched with the same name, the `data` and start time are overwritten.


#### `busy/finish`
Indicates an activity has finished. Accepts payload:

* `name` (required) - unique name of the activity
* `outcome` (optional) - string to capture activity status/result
* `data` (optional) - object hash of activity metadata, merged with `data` from original `start` dispatch

The underlying `FINISH` mutation will throw an error if the activity does not exist in the state tree. But, once
it does exist (i.e. it's started for the first time), there is no enforcement of call sequence. Dispatching `finish`
on an already finished activity will overwrite its `outcome` and finish time and will append `data`.


### Getters

```ts
// Returns true if activity is in progress (started but not yet finished).
// Returns false if activity does not exist or has finished.
// NOTE: `name` must be exact – use `getBusy` for wildcard matching instead.
isBusy(name: string) => boolean;

// Returns data object for a particular activity.
// Returns undefined if activity doesn't exist or data was not provided.
getData(name: string) => unknown;

// Returns outcome string for a particular activity.
// Returns undefined if activity doesn't exist or no outcome was specified.
getOutcome(name: string) => string | undefined;

// Returns difference between finish time and start time
getDuration(name: string) => number | undefined;

// Returns names of all activities which finished with a specific outcome.
// Pass `null` to get finished activities where NO outcome was specified.
filterByOutcome(outcome: string | null) => string[];

// Returns names of all unfinished activities.
// Pass `nameFilter` argument with one or more asterisk wildcards (*) to filter results.
getBusy(nameFilter?: string) => string[];

// Returns names of all finished activities.
// Pass `nameFilter` argument with one or more asterisk wildcards (*) to filter results.
getFinished(nameFilter?: string) => string[];
```

## Development

`yarn test` - Run test suite

`yarn serve` - Serve example app at localhost:8000

`yarn build` - Build dist
