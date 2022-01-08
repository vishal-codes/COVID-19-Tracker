import React, { useEffect, useState } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import "leaflet/dist/leaflet.css";

import InfoBox from './components/InfoBox';
import Table from './components/Table';
import { sortData } from './util.js';
import { prettyPrintStat } from './util.js';
import Map from './components/Map';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("global");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: 30.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const mappedCountry = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(mappedCountry);
          setMapCountries(data);
        })
    }
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryId = event.target.value;
    setCountry(countryId);
    const url = countryId === "global" ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryId}?yesterday=true&strict=true`;
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryId);
        setCountryInfo(data);
        countryId === "global" ? setMapCenter({ lat: 34.80746, lng: 30.4796 }) : setMapCenter({ lat: data.countryInfo.lat, lng: data.countryInfo.long });
        countryId === "global" ? setMapZoom(3) : setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_left_header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app_left_dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="global">Global</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}> {country.name} </MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
  
        <div className="app_left_stats">
          <InfoBox
            onClick={() => setCasesType('cases')}
            active={casesType === 'cases'}
            title="Todays Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            green
            onClick={() => setCasesType('recovered')}
            active={casesType === 'recovered'}
            title="Recovered Today"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            onClick={() => setCasesType('deaths')}
            active={casesType === 'deaths'}
            title="Deaths Today"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card >
        <CardContent>
          <h2 style={{ fontWeight: "400" }}>Total cases till date </h2>
          <Table countries={tableData} />
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName="WHO"
            options={{ height: "400px" }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;