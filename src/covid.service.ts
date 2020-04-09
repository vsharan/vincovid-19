import { Injectable, Logger } from '@nestjs/common';
const axios = require('axios');

@Injectable()
export class CovidService {

    private readonly logger = new Logger(CovidService.name);

    async getCovidData() {
        return axios.get(process.env.COVID_DATA_URL)
            .then((response) => {
                // handle success
                this.logger.debug(response.data);
                return response.data;
            })
            .catch((error) => {
                // handle error
                this.logger.debug(error);
                return error;
            })
    }

}