import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { dataSources, getClient } from '../../libs/ocap';
import { Grid, Image } from 'semantic-ui-react'

import Layout from '../../components/Layout';
import Loading from '../../components/Loading';

import './style.css';

import {
    G2,
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend,
    View,
    Guide,
    Shape,
    Facet,
    Util
  } from "bizcharts";

class Hack extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: dataSources[1],
      message: null,
      timestamp: null,
      subscribed: false,
      selectedYearMon: "2018-09",
      selectedValue: 500,
      data: [{"yearMonth":"2018-9-15","value":76},{"yearMonth":"2018-9-14","value":150},{"yearMonth":"2018-9-13","value":157},{"yearMonth":"2018-9-12","value":305},{"yearMonth":"2018-9-11","value":245},{"yearMonth":"2018-9-10","value":248},{"yearMonth":"2018-9-9","value":365},{"yearMonth":"2018-9-8","value":767},{"yearMonth":"2018-9-7","value":1340},{"yearMonth":"2018-9-6","value":140},{"yearMonth":"2018-9-5","value":62},{"yearMonth":"2018-9-4","value":56},{"yearMonth":"2018-9-3","value":48},{"yearMonth":"2018-9-2","value":60},{"yearMonth":"2018-9-1","value":73},{"yearMonth":"2018-8-31","value":316},{"yearMonth":"2018-8-30","value":216},{"yearMonth":"2018-8-29","value":75},{"yearMonth":"2018-8-28","value":123},{"yearMonth":"2018-8-27","value":104},{"yearMonth":"2018-8-26","value":78},{"yearMonth":"2018-8-25","value":56},{"yearMonth":"2018-8-24","value":62},{"yearMonth":"2018-8-23","value":75},{"yearMonth":"2018-8-22","value":81},{"yearMonth":"2018-8-21","value":89},{"yearMonth":"2018-8-20","value":64},{"yearMonth":"2018-8-19","value":61},{"yearMonth":"2018-8-18","value":128},{"yearMonth":"2018-8-17","value":109},{"yearMonth":"2018-8-16","value":89},{"yearMonth":"2018-8-15","value":70},{"yearMonth":"2018-8-14","value":99},{"yearMonth":"2018-8-13","value":71},{"yearMonth":"2018-8-12","value":52},{"yearMonth":"2018-8-11","value":108},{"yearMonth":"2018-8-10","value":69},{"yearMonth":"2018-8-9","value":72},{"yearMonth":"2018-8-8","value":81},{"yearMonth":"2018-8-7","value":74},{"yearMonth":"2018-8-6","value":94},{"yearMonth":"2018-8-5","value":78},{"yearMonth":"2018-8-4","value":81},{"yearMonth":"2018-8-3","value":176},{"yearMonth":"2018-8-2","value":103},{"yearMonth":"2018-8-1","value":139},{"yearMonth":"2018-7-31","value":143},{"yearMonth":"2018-7-30","value":94},{"yearMonth":"2018-7-29","value":45},{"yearMonth":"2018-7-28","value":58},{"yearMonth":"2018-7-27","value":97},{"yearMonth":"2018-7-26","value":81},{"yearMonth":"2018-7-25","value":813},{"yearMonth":"2018-7-24","value":2257},{"yearMonth":"2018-7-23","value":268},{"yearMonth":"2018-7-22","value":95},{"yearMonth":"2018-7-21","value":67},{"yearMonth":"2018-7-20","value":89},{"yearMonth":"2018-7-19","value":108},{"yearMonth":"2018-7-18","value":143},{"yearMonth":"2018-7-17","value":117},{"yearMonth":"2018-7-16","value":103},{"yearMonth":"2018-7-15","value":79},{"yearMonth":"2018-7-14","value":61},{"yearMonth":"2018-7-13","value":130},{"yearMonth":"2018-7-12","value":127},{"yearMonth":"2018-7-11","value":108},{"yearMonth":"2018-7-10","value":156},{"yearMonth":"2018-7-9","value":120},{"yearMonth":"2018-7-8","value":96},{"yearMonth":"2018-7-7","value":104},{"yearMonth":"2018-7-6","value":90},{"yearMonth":"2018-7-5","value":178},{"yearMonth":"2018-7-4","value":92},{"yearMonth":"2018-7-3","value":92},{"yearMonth":"2018-7-2","value":54},{"yearMonth":"2018-7-1","value":120},{"yearMonth":"2018-6-30","value":46},{"yearMonth":"2018-6-29","value":77},{"yearMonth":"2018-6-28","value":57},{"yearMonth":"2018-6-27","value":81},{"yearMonth":"2018-6-26","value":72},{"yearMonth":"2018-6-25","value":206},{"yearMonth":"2018-6-24","value":125},{"yearMonth":"2018-6-23","value":89},{"yearMonth":"2018-6-22","value":136},{"yearMonth":"2018-6-21","value":117},{"yearMonth":"2018-6-20","value":190},{"yearMonth":"2018-6-19","value":118},{"yearMonth":"2018-6-18","value":74},{"yearMonth":"2018-6-17","value":84}],
      cols: {
        value: {
          min: 0
        },
        yearMonth: {
          range: [0, 1]
        }
      }
    };

    console.log(getClient(this.state.dataSource.name));
  }

  async componentDidMount() {
    const client = getClient(this.state.dataSource.name);

    const dailyMap = new Map();
    const calculator = (txes) => {
        txes.forEach(tx => {
            let ymd = tx.time.substr(0, 10);
            if (dailyMap.has(ymd)) {
                dailyMap.set(ymd, dailyMap.get(ymd) + 1);
            } else {
                console.log(dailyMap);
                dailyMap.set(ymd, 1);
            }
        });
    };

    // 4. paged result with shortcut query
    var {transactionsByToken: transactions} = await client.transactionsByToken({ token: 'abt', paging: {size:2} });
    let hasNext = (typeof transactions.next === 'function')
    calculator(transactions.data)

    while (hasNext) {
        var {transactionsByToken: transactions} = await transactions.next();
        calculator(transactions.data)

        let hasNext = (typeof transactions.next === 'function');
    }
    console.log(dailyMap);

    this.setState({ subscribed: true });
  }

  render() {
    const { subscribed, message, timestamp, dataSource } = this.state;

    return (
      <Layout>
        <Grid divided='vertically'>
            <Grid.Row columns={1}>
                <Grid.Column textAlign="center" style={{ margin: "40px" }}>
                    <h1>ABT Daily Transaction Count</h1>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column textAlign="center">
                    <h1>{this.state.selectedYearMon}</h1>
                </Grid.Column>
                <Grid.Column textAlign="center">
                    <h1>{this.state.selectedValue} Transactions</h1>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={1}>
                <Grid.Column>
                    <Chart height={400} data={this.state.data} scale={this.state.cols} forceFit>
                        <Axis name="yearMonth" />
                        <Axis name="value" />
                        <Tooltip
                            crosshairs={{
                                type: "y"
                            }}
                        />
                        <Geom 
                            type="line" 
                            position="yearMonth*value" 
                            size={2}
                            tooltip={['yearMonth*value', (yearMonth, value)=>{
                                this.setState({
                                    selectedYearMon:yearMonth,
                                    selectedValue: value
                                })
                                return {
                                    yearMonth,
                                    value
                                }
                            }]}/>
                        <Geom
                            type="point"
                            position="yearMonth*value"
                            size={4}
                            shape={"circle"}
                            style={{
                            stroke: "#fff",
                            lineWidth: 1
                            }}
                        />
                    </Chart>
                </Grid.Column>
            </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default withRouter(Hack);
