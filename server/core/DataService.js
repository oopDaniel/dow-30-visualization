/**
 * DataService: Make sure data is accessible
 * 
 *  'init()' before making any DB query  
 */

import {
    DOW30,
    END_POINT,
    API_URL,
    API_POSTFIX,
} from './../const';
import Request  from './request';
import DB       from './database';

export class DataService {

    static init() {
        DOW30.forEach( (companyID) => this.initData(companyID) );
    }

    static initData(id) {
        console.log(`processing ${id}`)
        const options = this.getRequestOptions(id);
        return Request(options, id)
            .then(
                this.makeBackup,
                this.useBackup,
            )
            .then(this.toDB);
    }

    static getRequestOptions(id) {
        return {
            host: END_POINT,
            port: 443,
            path: `${API_URL}${id}${API_POSTFIX}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }

    /// --  TODO: implement functions below 

    /// In lest API was inaccessible
    static makeBackup(d) {
        console.log('Make backup!');
        return d;
    }

    static useBackup(d) {
        console.log('Use backup!');
        return d;
    }

    static toDB(data) {
        console.log('toDB!')
        return 'good';
    }


} 