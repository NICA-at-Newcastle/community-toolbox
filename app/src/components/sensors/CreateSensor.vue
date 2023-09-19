<template lang="pug">
  form
    .input-wrapper
      label Sensor name
      input(placeholder="E.g. My awesome sensor" type="text" name="name" v-model="newSensor.name")
    .input-wrapper
      label Sensor description
      input(placeholder="E.g. A sensor for measuring air quality" type="text" name="description" v-model="newSensor.description")
    .input-wrapper
      label Sensor passcode (optional)
      input(placeholder="E.g. 0934" type="text" name="passcode" v-model="newSensor.passcode")
    .btn.btn-success.pull-right(@click="addSensor") Add Sensor
    .clearfix  
</template>

<script>
import API from "@/api";

export default {
  name: "create-sensor",
  data() {
    return {
      newSensor: {
        name: undefined,
        description: undefined,
        passcode: undefined
      }
    };
  },
  methods: {
    slugify(str) {
      str = str.replace(/^\s+|\s+$/g, ""); // trim
      str = str.toLowerCase();

      // remove accents, swap ñ for n, etc
      var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
      var to = "aaaaeeeeiiiioooouuuunc------";
      for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
      }

      str = str
        .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
        .replace(/\s+/g, "-") // collapse whitespace and replace by -
        .replace(/-+/g, "-"); // collapse dashes

      return str;
    },
    addSensor() {
      this.newSensor.tag = this.slugify(this.newSensor.name);
      API.sensor.addSensor(
        this.newSensor,
        response => {
          this.$log(response);
          for (const key in this.newSensor) {
            this.newSensor[key] = undefined;
          }
          // Reload categories
          this.$emit("createdSensor");
        },
        error => {
          // Add sensor failed
          this.$log(error);
          alert("Something went wrong");
        }
      );
    }
  }
};
</script>

<style lang="stylus" scoped></style>
