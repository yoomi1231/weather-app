import React, { Component } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import { Icons } from './Icons';

const Container = styled.div`
    padding: 15px;
    border-right: 1px solid #F5FBFD;
    text-align: center;
    width: 140px;
    height: 200px;
    line-height: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    &:last-child {
        border-right: none;
    }
`;

const TemperatureContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 100px;
`;

export class Card extends Component {
    render() {
        const { day, condition, min, max } = this.props;
        const WeatherIcon = _.get(Icons, `${condition}`, null);

        return (
            <Container>
                <div>{day}</div>
                <WeatherIcon size={40} />
                <div>{condition}</div>
                <TemperatureContainer>
                    <div>{min} °F</div>
                    <div>{max} °F</div>
                </TemperatureContainer>
            </Container>
        )
    }
}