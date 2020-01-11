<template>
  <div class="my-wrapper-block">
    <div class="d-flex flex-column align-center">
      <div class="display-1 modt my-title mt-1 mb-2">{{ title }}</div>
      <div class="subtitle-1 modt my-subtitle mb-3">
        Location from
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API"
          >Browser GeoLocation API</a
        >
        - Weather from
        <a href="https://openweathermap.org/current">Open Weather API</a>
      </div>

      <div class="d-flex flex-row justify-center mt-2 mb-4">
        <v-card flat outlined class="my-location mx-2">
          <v-card-text>
            <div class="headline">Location</div>
            <div>{{ browserLocationText }}</div>
            <JsonFormat1 v-if="location" :obj="location" />
          </v-card-text>
        </v-card>
        <v-card flat outlined class="my-weather mx-2">
          <v-card-text>
            <div class="headline">Weather</div>
            <div>{{ weatherText }}</div>
            <JsonFormat1 v-if="weather" :obj="weather" />
          </v-card-text>
        </v-card>
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
  width: 350px;
}

.my-weather {
  width: 350px;
  height: 800px;
  overflow-y: auto;
}
</style>

<style></style>
