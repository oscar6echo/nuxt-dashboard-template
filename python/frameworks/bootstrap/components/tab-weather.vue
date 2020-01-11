<template>
  <div class="my-wrapper-block">
    <div class="d-flex flex-column align-items-center">
      <h3 class="modt my-title my-2">{{ title }}</h3>

      <h6 class="modt my-subtitle mb-4">
        Location from
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API"
          >Browser GeoLocation API</a
        >
        - Weather from
        <a href="https://openweathermap.org/current">Open Weather API</a>
      </h6>

      <div class="d-flex flex-row mt-2 mb-4">
        <div class="card my-location m-1">
          <div class="card-body">
            <h5 class="card-title">Location</h5>
            <p class="card-text">
              {{ browserLocationText }}
            </p>
            <JsonFormat1 v-if="location" :obj="location" />
          </div>
        </div>
        <div class="card my-weather m-1">
          <div class="card-body ">
            <h5 class="card-title">Weather</h5>
            <p class="card-text">
              {{ weatherText }}
            </p>
            <JsonFormat1 v-if="weather" :obj="weather" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { capitalCase } from 'change-case';
import JsonFormat1 from '~/components/misc/json-format-1';

const KEY_API_WEATHER_DATA = '95f5486bb09de74ca9c4054c5939b49e';

export default {
  name: 'TabWeather',
  components: { JsonFormat1 },
  props: {},
  data() {
    return {
      browserLocationText: 'Checking your browser',
      weatherText: 'No weather data',
      location: null,
      weather: null
    };
  },
  computed: {
    title() {
      return capitalCase('weather');
    }
  },
  watch: {
    async location() {
      if (!this.location) return;
      const { latitude, longitude } = this.location;
      this.weather = await this.getWeatherData({ latitude, longitude });
      if (this.weather) {
        const dt = new Date(this.weather.dt * 1000).toLocaleString();
        this.weatherText = 'Received on ' + dt;
      } else {
        this.weatherText = 'No data received';
      }
    }
  },
  created() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        this.browserLocationText =
          'According to your browser, your location is:';
      });
    } else {
      this.browserLocationText = 'Your browser does not support geolocation';
    }
  },

  methods: {
    async getWeatherData({ latitude, longitude }) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${KEY_API_WEATHER_DATA}`;
      const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
      const urlWithProxy = CORS_PROXY + url;

      const headers = {
        accept: 'application/json',
        'x-requested-with': 'localhost:3000'
      };
      const config = {
        method: 'get',
        url: urlWithProxy,
        headers
      };

      const data = await this.$axios.$request(config);
      return data;
    }
  }
};
</script>

<style lang="scss" scoped>
.my-wrapper-block {
  padding-left: 50px;
  padding-right: 50px;
}

.my-location {
  width: 330px;
}

.my-weather {
  width: 330px;
  height: 800px;
  overflow-y: auto;
}
</style>

<style></style>
