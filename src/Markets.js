'use strict';

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const { DateTime } = require('luxon');

class Markets extends Component {

    // Constructor
    constructor(props) {
        let price = '1';
        super(props);
        this.state = {
            marketprices: price
        }
    }

    // compentDidMount
    componentDidMount(){
        // Read markets
    }

    render() {
        const marketprices = this.state.bind(marketprices);
        return (
        <div className="Markets">
            <header className="Markets-header">
                <h2>Current time</h2>
                    <table classname="Markets-table">
                        <tr>
                            <td>
                                Markets {marketprices}
                            </td>
                        </tr>
                    </table>
            </header>
        </div>
        );
    }
}

export default Markets;
