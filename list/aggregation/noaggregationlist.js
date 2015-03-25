define(['jquery', '../../../../bower_components/d3/d3', '../../listeners', '../pathlist', '../../sorting', '../../setinfo', '../../selectionutil', '../../pathUtil', '../../config', './aggregatesorting', './aggregate'],
  function ($, d3, listeners, PathList, sorting, setInfo, selectionUtil, pathUtil, config, aggregateSorting, aggregate) {
    'use strict';

    function NoAggregationList() {
      aggregate.AggregateList.call(this);
      this.pathList = new PathList();
    }

    NoAggregationList.prototype = Object.create(aggregate.AggregateList.prototype);


    NoAggregationList.prototype.getSize = function () {

      return this.pathList.getSize();
    };

    NoAggregationList.prototype.init = function () {
      this.pathList.init();
    };


    NoAggregationList.prototype.destroy = function () {
      this.pathList.destroy();
    };

    NoAggregationList.prototype.addPath = function (path) {
      this.pathList.addPath(path);
    };

    NoAggregationList.prototype.setPaths = function (paths) {
      this.pathList.setPaths(paths);
    };


    NoAggregationList.prototype.render = function (parent) {
      this.pathList.render(parent);
    };


    return NoAggregationList;

  }
);
