// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, { Component } from "react";
import { connect } from "react-redux";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import KeplerGl from "kepler.gl";
import nycTrips from "./data/nyc-trips.csv";
import nycTripsSubset from "./data/nyc-subset.csv";
import nyConfig from "./data/nyc-config.json";
import { addDataToMap } from "kepler.gl/actions";
import Processors from "kepler.gl/processors";
import KeplerGlSchema from "kepler.gl/schemas";
import Button from "./button";
import downloadJsonFile from "./file-download";

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

class App extends Component {
  componentDidMount() {
    const data = Processors.processCsvData(nycTrips);
    const dataset = {
      data,
      info: {
        id: "my-data",
      },
    };

    this.props.dispatch(addDataToMap({ datasets: dataset, config: nyConfig }));
  }

  getMapConfig = () => {
    const { keplerGl } = this.props;
    const { map } = keplerGl;
    return KeplerGlSchema.getConfigToSave(map);
  };

  exportMapConfig = () => {
    const mapConfig = this.getMapConfig();
    downloadJsonFile(mapConfig, "kepler.gl.json");
  };

  replaceData = () => {
    const data = Processors.processCsvData(nycTripsSubset);
    const dataset = {
      data,
      info: {
        id: "my_data",
      },
    };
    const config = this.getMapConfig();
    this.props.dispatch(addDataToMap({ datasets: dataset, config }));
  };

  render() {
    return (
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          minHeight: "70vh",
        }}
      >
        <Button onClick={this.exportMapConfig}>Export Config</Button>
        <Button onClick={this.replaceData}>Replace Data</Button>
        <AutoSizer>
          {({ height, width }) => (
            <KeplerGl
              mapboxApiAccessToken={MAPBOX_TOKEN}
              id="map"
              width={width}
              height={height}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}

const mapStateToProps = (state) => state;
const dispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, dispatchToProps)(App);
