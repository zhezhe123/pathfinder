define(['d3'], function (d3) {

  var DEFAULT_NODE_WIDTH = 60;
  var DEFAULT_NODE_HEIGHT = 20;

  var DEFAULT_EDGE_SIZE = 50;

  var config = {};
  var nodeNamePropertyNames = {};

  var nodeSets = {};
  var edgeSets = {};

  var nodeTypeSymbols = {};


  return {
    setConfig: function (c) {
      config = c;

      var symbols = d3.svg.symbolTypes;

      config.nodes.forEach(function (nodeConfig, i) {

        Object.keys(nodeConfig.properties).forEach(function (key) {
          var prop = nodeConfig.properties[key];
          var propType = prop.type;
          if (typeof propType !== "undefined" && propType === "set") {
            var sets = nodeSets[nodeConfig["node_label"]];
            if (typeof sets === "undefined") {
              sets = {};
              nodeSets[nodeConfig["node_label"]] = sets;
            }
            sets[key] = prop;
          }
          if (config.nodes.length > 1) {
            nodeTypeSymbols[nodeConfig["node_label"]] = symbols[i];
          }
        });

      });

      config.edges.forEach(function (edgeConfig) {

        Object.keys(edgeConfig.properties).forEach(function (key) {
          var prop = edgeConfig.properties[key];
          var propType = prop.type;
          if (typeof propType !== "undefined" && propType === "set") {
            var sets = edgeSets[edgeConfig["label"]];
            if (typeof sets === "undefined") {
              sets = {};
              edgeSets[edgeConfig["label"]] = sets;
            }
            sets[key] = prop;
          }
        });

      });
    },

    isNodeSetProperty: function (node, property) {
      var type = this.getNodeType(node);
      var sets = nodeSets[type];
      if (typeof sets !== "undefined") {
        var set = sets[property];
        if (typeof set !== "undefined") {
          return true;
        }
      }
      return false;
    },

    getSetTypeFromSetPropertyName: function (id) {
      for (var i = 0; i < config.sets.length; i++) {
        var setConfig = config.sets[i];
        if (setConfig["set_property"] === id) {
          return setConfig["name"];
        }
      }
    },


    getSetTypeFromNodeSetProperty: function (node, property) {
      var type = this.getNodeType(node);
      var sets = nodeSets[type];
      if (typeof sets !== "undefined") {
        var set = sets[property];
        if (typeof set !== "undefined") {
          return getSetTypeFromSetTypeId(set.set);
        }
      }
    },

    isEdgeSetProperty: function (edge, property) {
      var sets = edgeSets[edge.type];
      if (typeof sets !== "undefined") {
        var set = sets[property];
        if (typeof set !== "undefined") {
          return true;
        }
      }
      return false;
    },

    getEdgeSetProperties: function (edge) {
      var sets = edgeSets[edge.type];
      if (typeof sets !== "undefined") {
        return Object.keys(sets);
      }
      return [];
    },

    getSetTypeFromEdgeSetProperty: function (edge, property) {
      var sets = nodeSets[edge.type];
      if (typeof sets !== "undefined") {
        var set = sets[property];
        if (typeof set !== "undefined") {

          return getSetTypeFromSetTypeId(set.set);
        }
      }
    },

    getConfig: function () {
      return config;
    },

    isSetEdge: function (edge) {

      var edgeConfig = this.getEdgeConfig(edge);
      if (typeof edgeConfig === "undefined") {
        return false;
      }

      var propertyKeys = Object.keys(edgeConfig.properties);

      for (var i = 0; i < propertyKeys.length; i++) {
        var key = propertyKeys[i];
        var propType = edgeConfig.properties[key].type;
        if (typeof propType !== "undefined" && propType === "flag") {
          var edgeProperty = edge.properties[key];
          if (typeof edgeProperty !== "undefined" && edgeProperty === true)
            return true;
        }
      }

      return false;
    },

    isNetworkEdge: function (edge) {
      var edgeConfig = this.getEdgeConfig(edge);
      if (typeof edgeConfig === "undefined") {
        return false;
      }

      var propertyKeys = Object.keys(edgeConfig.properties);

      for (var i = 0; i < propertyKeys.length; i++) {
        var key = propertyKeys[i];
        var property = edgeConfig.properties[key];
        if (typeof property !== "undefined" && property === "flag_network") {
          var edgeProperty = edge.properties[key];
          if (typeof edgeProperty !== "undefined" && edgeProperty === true)
            return true;

        }
      }

      return false;
    },

    getNodeWidth: function () {
      var nodeWidth = config.settings["node_width"];
      return (typeof nodeWidth === "undefined") ? DEFAULT_NODE_WIDTH : nodeWidth;
    },

    getNodeHeight: function () {
      var nodeHeight = config.settings["node_height"];
      return (typeof nodeWidth === "undefined") ? DEFAULT_NODE_HEIGHT : nodeHeight;
    },

    getEdgeSize: function () {
      var edgeSize = config.settings["edge_size"];
      return (typeof edgeSize === "undefined") ? DEFAULT_EDGE_SIZE : edgeSize;
    },

    getNodeConfig: function (node) {
      for (var i = 0; i < node.labels.length; i++) {
        var currentLabel = node.labels[i];

        for (var j = 0; j < config.nodes.length; j++) {
          var nodeConfig = config.nodes[j];
          if (nodeConfig["node_label"] === currentLabel) {
            return nodeConfig;
          }
        }
      }
    },

    getEdgeConfig: function (edge) {
      for (var j = 0; j < config.edges.length; j++) {
        var edgeConfig = config.edges[j];
        if (edgeConfig["label"] === edge.type) {
          return edgeConfig;
        }
      }
    },

    getSetConfig: function (setNode) {
      for (var i = 0; i < setNode.labels.length; i++) {
        var currentLabel = setNode.labels[i];

        for (var j = 0; j < config.sets.length; j++) {
          var nodeConfig = config.sets[j];
          if (nodeConfig["node_label"] === currentLabel) {
            return nodeConfig;
          }
        }
      }
    },

    getNodeNameProperty: function (node) {
      var nodeConfig = this.getNodeConfig(node);

      var propertyName = nodeNamePropertyNames[nodeConfig["node_label"]];

      if (typeof propertyName !== "undefined") {
        return propertyName;
      }
      var keys = Object.keys(nodeConfig.properties);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (nodeConfig.properties[key] === "name") {
          nodeNamePropertyNames[nodeConfig["node_label"]] = key;
          return key;
        }
      }
    },

    getSetNameProperty: function (setNode) {
      var setConfig = this.getSetConfig(setNode);

      var propertyName = nodeNamePropertyNames[setConfig["node_label"]];

      if (typeof propertyName !== "undefined") {
        return propertyName;
      }
      var keys = Object.keys(setConfig.properties);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (setConfig.properties[key] === "name") {
          nodeNamePropertyNames[setConfig["node_label"]] = key;
          return key;
        }
      }
    },

    getNodeType: function (node) {
      var nodeConfig = this.getNodeConfig(node);
      var type = nodeConfig["node_label"];
      if (typeof type === "undefined") {
        return "Unknown";
      }
      return type;
    },

    getNodeTypeSymbol: function (nodeType) {
      return nodeTypeSymbols[nodeType];
    },

    getTypeSymbolForNode: function (node) {
      return this.getNodeTypeSymbol(this.getNodeType(node));
    },

    getNodeTypes: function() {
      return config.nodes.map(function(nodeConfig) {
        return nodeConfig["node_label"];
      });
    }
  }


});
