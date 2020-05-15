'use strict';

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const { DateTime } = require('luxon');

class Markets extends Component {

    // Constructor
    constructor(props) {
        
        super(props);
        this.state = {
        }
    }

    // compentDidMount
    componentDidMount(){
        // Read markets
    }

    render() {
        return (
        <div className="App">
            <header className="App-header">
                <h2>Current time</h2>
                    <table classname="App-table">
                        <tr>
                            <td>
                                Markets
                            </td>
                        </tr>
                    </table>
            </header>
        </div>
        );
    }
}

export default Markets;
