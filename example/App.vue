<template>
  <h1>VueBusy</h1>

  <div class="flex">
    <div class="flex-1">
      <h3>1. Basic - show loader while busy</h3>
      <Spinner color="green" v-if="isBusy('basic-activity')" />
      <button @click="simulateActivity({ name: 'basic-activity' })" :disabled="isBusy('basic-activity')">Start</button>
    </div>
  </div>
  <div class="flex">
    <div class="flex-1">
      <h3>2. Optionally pass outcome & extra data when finished</h3>
      <Spinner color="red" v-if="isBusy('generic-api-activity')" />
      <div v-if="didFail('generic-api-activity')">
        <div class="danger">{{ getActivityData("generic-api-activity").message }}</div>
        <button @click="simulateActivity({ name: 'generic-api-activity' })" :disabled="isBusy('generic-api-activity')">
          Start again but succeed this time (same activity name)
        </button>
      </div>
      <button @click="simulateActivityFailure({ name: 'generic-api-activity' })" :disabled="isBusy('generic-api-activity')">Start & fail</button>
    </div>
  </div>
  <div class="flex">
    <div class="flex-1">
      <h3>3. Handle specific outcomes globally</h3>
      <p>
        This will show a window alert via a Vue watcher if the outcome is 'network-error'. <br />
        This intentionally uses the same activity name as the example above to demonstrate a way of handling outcomes generally – so you'll see that
        spinner show up.
      </p>
      <button @click="simulateActivity({ name: 'generic-api-activity', outcome: 'network-error' })" :disabled="isBusy('generic-api-activity')">
        Start
      </button>
    </div>
  </div>
  <div class="flex">
    <div class="flex-1">
      <h3>4. Manage complex, parallel activities</h3>
      <button @click="startMany">Start all activities (w/ random durations)</button>
      <div class="flex">
        <div class="flex-1" v-for="activity in Object.keys(activities)" :key="activity">
          <span>Activity {{ activity }}</span>
          <Spinner v-if="isBusy(activity)" />
          <div v-if="getFinishedActivities(activity).length > 0">
            {{ durationSec(activity) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import Spinner from "./components/Spinner.vue";

const randomBetween = (min: number, max: number): number => {
  return ~~(Math.random() * max) + min;
};

export default defineComponent({
  name: "App",
  components: {
    Spinner,
  },
  data() {
    return {
      activities: {
        A: randomBetween(1, 10),
        B: randomBetween(1, 10),
        C: randomBetween(1, 10),
        D: randomBetween(1, 10),
        E: randomBetween(1, 10),
        F: randomBetween(1, 10),
        G: randomBetween(1, 10),
      },
    };
  },
  computed: {
    ...mapGetters({
      isBusy: "busy/isBusy",
      getActivityOutcome: "busy/getOutcome",
      getActivityData: "busy/getData",
      getActivitiesByOutcome: "busy/filterByOutcome",
      getActivityDuration: "busy/getDuration",
      getFinishedActivities: "busy/getFinished",
    }),
    networkErrorActivities(): string[] {
      return this.getActivitiesByOutcome("network-error");
    },
  },
  methods: {
    didFail(activity: string): boolean {
      return this.getActivityOutcome(activity) === "error";
    },
    durationSec(activity: string): string {
      return `${Math.round(this.getActivityDuration(activity) / 1000)} sec`;
    },
    startMany() {
      for (const [name, waitTimeSec] of Object.entries(this.activities)) {
        this.simulateActivity({ name, waitTimeSec });
      }
    },
    // eslint-disable-next-line prettier/prettier
    ...mapActions([
      "simulateActivity",
      "simulateActivityFailure",
    ]),
  },
  watch: {
    networkErrorActivities(activities: string[], prevActivities: string[]) {
      // This Array diff is required to ensure we don't repeatedly show an alert for the same request once
      // it's already been handled
      const uniqueActivities = activities.filter((name) => prevActivities.indexOf(name) < 0);
      if (uniqueActivities.length > 0) {
        window.alert("Global handler: We experienced a network error!");
      }
    },
  },
});
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.spinner {
  margin: auto;
}

.flex {
  display: flex;
  margin-bottom: 40px;
}

.flex-1 {
  flex: 1 1 0%;
}

button {
  border-radius: 3px;
  margin: 5px;
  padding: 8px;
}

button[disabled] {
  opacity: 0.5;
}

.danger {
  color: red;
}
</style>
