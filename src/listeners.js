/**
 * Created by Christian on 19.02.2015.
 */
define(function () {
  return {

    updateType: {
      SET_INFO_UPDATE: "SET_INFO_UPDATE",
      QUERY_UPDATE: 'QUERY_UPDATE',
      REMOVE_FILTERED_PATHS_UPDATE: 'REMOVE_FILTERED_PATHS_UPDATE',
      DATASET_UPDATE: "DATASET_UPDATE",
      UPDATE_ON_NODE_MAPPING: "UPDATE_ON_NODE_MAPPING"
    },

    add: function (listener, type) {

      if (typeof this[type] === "undefined") {
        this[type] = [];
      }

      this[type].push(listener);
    },

    notify: function (type, updatedObject, source) {

      if (typeof this[type] !== "undefined") {
        this[type].forEach(function (listener) {
          listener(updatedObject, source);
        });
      }
    },

    remove: function (listener, type) {
      if (typeof this[type] === "undefined") {
        return;
      }
      var index = this[type].indexOf(listener);
      if (index > -1) {
        this[type].splice(index, 1);
      }
    },

    clear: function (type) {
      if (typeof this[type] !== "undefined") {
        this[type] = [];
      }
    }
  }
});
