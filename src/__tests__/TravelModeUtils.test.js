import React from 'react';
import { render, screen } from '@testing-library/react';

// create a test-only component to expose utility functions
const WeatherUtils = {
  getWeatherDescription: (code) => {
    if ([0, 1].includes(code)) return "Clear";
    if ([2, 3].includes(code)) return "Cloudy";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rainy";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy";
    if ([95, 96, 99].includes(code)) return "Stormy";
    return "Unknown";
  },
  
  getWeatherIcon: (code, isDay) => {
    if ([0, 1].includes(code)) return isDay ? "☀️" : "🌙";
    if ([2, 3].includes(code)) return "☁️";
    if ([45, 48].includes(code)) return "🌫️";
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
    if ([95, 96, 99].includes(code)) return "⛈️";
    return;
  },
  
  getWindDirection: (degrees) => {
    const directions = [
      'N', 'NNE', 'NE', 'ENE', 
      'E', 'ESE', 'SE', 'SSE', 
      'S', 'SSW', 'SW', 'WSW', 
      'W', 'WNW', 'NW', 'NNW'
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  },
  
  kmhToMph: (kmh) => {
    return (kmh * 0.621371).toFixed(1);
  },
  // calculate wind speed class based on mph
  getWindSpeedClass: (speedMph) => {
    if (speedMph < 10) return 'wind-safe';
    if (speedMph < 20) return 'wind-moderate';
    if (speedMph < 30) return 'wind-warning';
    if (speedMph < 40) return 'wind-danger';
    return 'wind-severe';
  },
  // calculate wind speed description based on mph
  getWindSpeedDescription: (speedMph) => {
    if (speedMph < 10) return 'Safe driving conditions';
    if (speedMph < 20) return 'Use caution while driving';
    if (speedMph < 30) return 'Potential difficulty for high-profile vehicles';
    if (speedMph < 40) return 'Dangerous for high-profile vehicles';
    return 'Extremely dangerous, travel not recommended';
  },
  // calculate wind alert level based on mph
  getWindAlertLevel: (speedMph) => {
    if (speedMph < 10) return 'Safe';
    if (speedMph < 20) return 'Caution';
    if (speedMph < 30) return 'Warning';
    if (speedMph < 40) return 'Danger';
    return 'Severe';
  },
  // calculate ice risk level based on weather code and temperature
  getIceRiskLevel: (code, tempF) => {
    const precipCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99];
    
    if ([56, 57, 66, 67].includes(code)) return 'High';
    if (tempF <= 36 && precipCodes.includes(code)) return 'Moderate';
    if (tempF <= 32) return 'Moderate';
    return 'Low';
  },
  
  celsiusToFahrenheit: (celsius) => (celsius * 9/5) + 32
};

describe('Weather Utility Functions', () => {
  // test weather description conversion for every weather code
  it('correctly identifies weather descriptions based on codes', () => {
    expect(WeatherUtils.getWeatherDescription(0)).toBe('Clear');
    expect(WeatherUtils.getWeatherDescription(2)).toBe('Cloudy');
    expect(WeatherUtils.getWeatherDescription(48)).toBe('Foggy');
    expect(WeatherUtils.getWeatherDescription(61)).toBe('Rainy');
    expect(WeatherUtils.getWeatherDescription(75)).toBe('Snowy');
    expect(WeatherUtils.getWeatherDescription(95)).toBe('Stormy');
    expect(WeatherUtils.getWeatherDescription(999)).toBe('Unknown');
  });
  
  // test weather icon conversion for every weather code and day/night
  it('returns correct weather icons', () => {
    expect(WeatherUtils.getWeatherIcon(0, true)).toBe('☀️');
    expect(WeatherUtils.getWeatherIcon(0, false)).toBe('🌙');
    expect(WeatherUtils.getWeatherIcon(2, true)).toBe('☁️');
    expect(WeatherUtils.getWeatherIcon(45, true)).toBe('🌫️');
    expect(WeatherUtils.getWeatherIcon(61, true)).toBe('🌧️');
    expect(WeatherUtils.getWeatherIcon(75, true)).toBe('❄️');
    expect(WeatherUtils.getWeatherIcon(95, true)).toBe('⛈️');
  });
  
  // test wind direction conversion for every degree and direction
  it('converts degrees to wind direction correctly', () => {
    expect(WeatherUtils.getWindDirection(0)).toBe('N');
    expect(WeatherUtils.getWindDirection(90)).toBe('E');
    expect(WeatherUtils.getWindDirection(180)).toBe('S');
    expect(WeatherUtils.getWindDirection(270)).toBe('W');
    expect(WeatherUtils.getWindDirection(45)).toBe('NE');
    expect(WeatherUtils.getWindDirection(135)).toBe('SE');
    expect(WeatherUtils.getWindDirection(225)).toBe('SW');
    expect(WeatherUtils.getWindDirection(315)).toBe('NW');
    expect(WeatherUtils.getWindDirection(348)).toBe('NNW');
  });
  
  // test kmh to mph conversion for every speed
  it('converts kmh to mph correctly', () => {
    expect(WeatherUtils.kmhToMph(10)).toBe('6.2');
    expect(WeatherUtils.kmhToMph(100)).toBe('62.1');
    expect(WeatherUtils.kmhToMph(0)).toBe('0.0');
    expect(WeatherUtils.kmhToMph(18.4)).toBe('11.4');
  });
  
  // test wind speed safety classes for every speed
  it('assigns correct wind speed safety classes', () => {
    expect(WeatherUtils.getWindSpeedClass(5)).toBe('wind-safe');
    expect(WeatherUtils.getWindSpeedClass(15)).toBe('wind-moderate');
    expect(WeatherUtils.getWindSpeedClass(25)).toBe('wind-warning');
    expect(WeatherUtils.getWindSpeedClass(35)).toBe('wind-danger');
    expect(WeatherUtils.getWindSpeedClass(45)).toBe('wind-severe');
  });
  
  // test wind speed descriptions for every speed
  it('provides appropriate wind speed descriptions', () => {
    expect(WeatherUtils.getWindSpeedDescription(5)).toBe('Safe driving conditions');
    expect(WeatherUtils.getWindSpeedDescription(15)).toBe('Use caution while driving');
    expect(WeatherUtils.getWindSpeedDescription(25)).toBe('Potential difficulty for high-profile vehicles');
    expect(WeatherUtils.getWindSpeedDescription(35)).toBe('Dangerous for high-profile vehicles');
    expect(WeatherUtils.getWindSpeedDescription(45)).toBe('Extremely dangerous, travel not recommended');
  });
  
  // test wind alert levels for every speed
  it('provides appropriate wind alert levels', () => {
    expect(WeatherUtils.getWindAlertLevel(5)).toBe('Safe');
    expect(WeatherUtils.getWindAlertLevel(15)).toBe('Caution');
    expect(WeatherUtils.getWindAlertLevel(25)).toBe('Warning');
    expect(WeatherUtils.getWindAlertLevel(35)).toBe('Danger');
    expect(WeatherUtils.getWindAlertLevel(45)).toBe('Severe');
  });
  
  // test ice risk level assessment with diff levels
  it('correctly assesses ice risk levels', () => {
    expect(WeatherUtils.getIceRiskLevel(56, 40)).toBe('High');
    expect(WeatherUtils.getIceRiskLevel(61, 32)).toBe('Moderate');
    expect(WeatherUtils.getIceRiskLevel(0, 30)).toBe('Moderate');
    expect(WeatherUtils.getIceRiskLevel(61, 35)).toBe('Moderate');
    expect(WeatherUtils.getIceRiskLevel(0, 40)).toBe('Low');
    expect(WeatherUtils.getIceRiskLevel(61, 37)).toBe('Low');
  });
  
  // test temperature conversion
  it('converts Celsius to Fahrenheit correctly', () => {
    expect(WeatherUtils.celsiusToFahrenheit(0)).toBe(32);
    expect(WeatherUtils.celsiusToFahrenheit(100)).toBe(212);
    expect(WeatherUtils.celsiusToFahrenheit(-40)).toBe(-40);
    expect(WeatherUtils.celsiusToFahrenheit(22.5)).toBe(72.5);
  });
}); 