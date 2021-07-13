import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import _ from 'lodash';
import { Card } from './Card';

const CUR_API_KEY= "358b617a0e9aa4d997b009677e6081f0";
const FORE_API_KEY = "aLvrEtcCcbfRGGJWX7D63QOhg4PJlj7q";

const Container = styled.div`
    height: 650px;
    width: 950px;
    margin: 50px auto;
    background-color: #D5ECF4;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px;
    border: 2px solid #D5ECF4;
    background-color: #F5FBFD;
`;

const SearchBar = styled.form`
`;

const WeatherContainer = styled.div`
    margin: 30px;
    min-height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #424242;
`;

const WeatherDataContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 1.5;
    font-size: 25px;
    color: #424242;
`;

const ForcastContainer = styled.div`
    height: 200px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    font-size: 15px;
    color: #616161;
`;

const CardContainer = styled.div`
    display: flex;
    justify-content: space-between; 
`;

export class Weather extends Component {
    state = {
        curWeatherData: null,
        forecastData: null,
        cityName: null
    };

    onSearchSubmit = event => {
        event.preventDefault();

        const zipcode = document.getElementById('zipcode').value;

        axios.get(`http://api.openweathermap.org/data/2.5/weather?zip=${zipcode},us&units=imperial&appid=${CUR_API_KEY}`)
        .then(({ data }) => {
            
            const curCondition = data;
            this.setState({ curWeatherData: curCondition }); // A
        })
        .catch(error => console.log('error', error));

        axios.get(`http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${FORE_API_KEY}&q=${zipcode}`)
        .then(({ data }) => {
            console.log(data);
            const locationKey = _.get(data, "[0][Key]");

            axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${FORE_API_KEY}`)
                .then(response => {
                    const forecast = _.get(response, "data.DailyForecasts");
                    // const todayData = forecast.shift();
                    console.log(response);
                    this.setState({ 
                        forecastData: forecast
                    }); // B 
                })
        })
        .catch(error => console.log('error', error));
    }


    render() {
        const { curWeatherData, forecastData } = this.state;
        return ( 
            <Container>
                <Header>
                    Weather App
                    <SearchBar onSubmit={this.onSearchSubmit}>
                        <input id="zipcode" type="text" name="zipcode" />
                        <input type="submit" value="Enter" />
                    </SearchBar>
                </Header>
                <WeatherContainer>
                    {
                        curWeatherData ? (
                            <WeatherDataContainer>
                                <div>Current Weather Condition</div>
                                <div>{_.get(this.state, "curWeatherData.name")}</div>
                                <div>{_.get(this.state, 'curWeatherData.weather[0].main')}</div>
                                <div>{_.get(this.state, 'curWeatherData.main.temp')} °F</div>
                            </WeatherDataContainer>
                        ) : (
                            <div>Enter Zipcode</div>
                        )
                    }                 
                </WeatherContainer>
                {
                    forecastData && (
                        <ForcastContainer> 
                            <div>Five Day Forecast</div>
                            <CardContainer>
                            {   
                                this.state.forecastData &&
                                    this.state.forecastData.map((forecast, index) => 
                                        <Card
                                            key={`${forecast}-${index}`}
                                            day={new Date(_.get(forecast, 'Date')).toDateString()}
                                            // day={new Date(_.get(forecast, 'Date')).toLocaleDateString('en-US',{ weekday: 'long'})}
                                            index={index}
                                            condition={_.get(forecast, 'Day.IconPhrase')}
                                            min={_.get(forecast, 'Temperature.Minimum.Value')}
                                            max={_.get(forecast, 'Temperature.Maximum.Value')}
                                        />
                                    )
                            }
                        </CardContainer>
                        </ForcastContainer>
                    )
                }
            </Container>
        );
    }
};
