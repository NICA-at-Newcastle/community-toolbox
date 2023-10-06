<template lang="pug">
  form
    .input-wrapper
      label Sensor name
      input(placeholder="E.g. My awesome sensor" type="text" name="name" v-model="newSensor.name")
    .input-wrapper
        label Sensor Type (select or add new)
        sensor-type-selector(v-if="sensorTypes.length > 0" v-bind:type.sync="newSensor._type" v-bind:type_name.sync="newSensor.type_name" v-bind:types="sensorTypes")        
        input.type-input(v-if="!newSensor.type_name" placeholder="E.g. Air Quality, Traffic" type="text" name="type" v-model="newSensor._type")   
    .input-wrapper
      label Sensor Tag
      input(placeholder="E.g. Asset tag or unique identifier" type="text" name="tag" v-model="newSensor.tag")   
    .input-wrapper
      label Sensor description
      input(placeholder="E.g. A sensor for measuring air quality" type="text" name="description" v-model="newSensor.description")    
    .input-wrapper
      label Sensor passcode (optional)
      input(placeholder="E.g. 0934" type="text" name="passcode" v-model="newSensor.passcode")
    .input-wrapper
        label Sensor Image
        file-upload(v-bind:uploaded-file.sync="newSensor.image")    
    .btn.btn-success.pull-right(@click="addSensor") Add Sensor
    .clearfix  
</template>

<script>
import API from "@/api";
import FileUpload from "@/components/FileUpload";
import SensorTypeSelector from "@/components/sensors/SensorTypeSelector";

export default {
  name: "create-sensor",
  components: {
    FileUpload,
    SensorTypeSelector
  },
  data() {
    return {
      newSensor: {
        name: undefined,
        description: undefined,
        _type: undefined,
        tag: undefined,
        passcode: undefined,
        image: undefined
      },
      sensorTypes: []
    };
  },
  mounted() {
    this.fetchTypes();
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
      if (typeof this.newSensor._type !== "object") {
        this.newSensor.typeTag = this.slugify(this.newSensor._type);
      }
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
    },
    fetchTypes() {
      API.sensor.types(
        response => {
          // types success
          this.$log(response);
          this.sensorTypes = response.data;
        },
        error => {
          // types fail
          this.$log(error);
        }
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
.type-input
  margin-top: 10px
.btn
  margin-top 60px
</style>
