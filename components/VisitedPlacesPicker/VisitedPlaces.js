import { useState } from 'react';
import { Country, City } from 'country-state-city';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import styles from './VisitedPlaces.module.css';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export default function VisitedPlaces({ visited = [], onUpdate = () => {} }) {
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [localVisited, setLocalVisited] = useState(visited);

    const handleAddPlace = () => {
        if (!selectedCountry || !selectedCity) return;
        const place = {
            countryCode: selectedCountry,
            countryName: Country.getCountryByCode(selectedCountry)?.name,
            city: selectedCity
        };
        const exists = localVisited.some(
            (p) => p.city === place.city && p.countryCode === place.countryCode
        );
        if (!exists) {
            const updated = [...localVisited, place];
            setLocalVisited(updated);
            onUpdate(updated);
        }
        setSelectedCity('');
    };

    const highlightedCountries = [...new Set(
        localVisited
            .map(p => Country.getCountryByCode(p.countryCode)?.iso3)
            .filter(Boolean)
    )];

    const handleCountryClick = (isoCode) => {
        const cities = localVisited.filter(p => p.countryCode === isoCode);
        if (cities.length > 0) {
            alert(`Visited cities in ${Country.getCountryByCode(isoCode)?.name}:\n\n` + cities.map(c => `- ${c.city}`).join('\n'));
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h3>Visited Places</h3>
                <button className={styles.editBtn} onClick={() => setShowModal(true)}>Edit</button>
            </div>
            <p className={styles.stats}>{
                `${highlightedCountries.length} countries | ${localVisited.length} cities visited`
            }</p>
            <ComposableMap className={styles.map} projectionConfig={{ scale: 140 }}>
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            const isVisited = highlightedCountries.includes(geo.id);
                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    onClick={() => handleCountryClick(geo.id)}
                                    className={styles.geography}
                                    style={{
                                        default: {
                                            fill: isVisited ? '#0070f3' : '#EAEAEC',
                                            stroke: '#D6D6DA',
                                            outline: 'none'
                                        },
                                        hover: {
                                            fill: '#999',
                                            outline: 'none'
                                        },
                                        pressed: {
                                            fill: '#005bbb',
                                            outline: 'none'
                                        }
                                    }}
                                />
                            );
                        })
                    }
                </Geographies>
            </ComposableMap>

            {showModal && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modal}>
                        <h4>Add Visited City</h4>
                        <select
                            value={selectedCountry}
                            onChange={(e) => {
                                setSelectedCountry(e.target.value);
                                setSelectedCity('');
                            }}
                        >
                            <option value=''>Select Country</option>
                            {Country.getAllCountries().map((c) => (
                                <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                            ))}
                        </select>

                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            disabled={!selectedCountry}
                        >
                            <option value=''>Select City</option>
                            {selectedCountry &&
                                City.getCitiesOfCountry(selectedCountry).map((c) => (
                                    <option key={c.name} value={c.name}>{c.name}</option>
                                ))}
                        </select>

                        <button onClick={handleAddPlace} className={styles.addBtn}>+ Add</button>
                        <button onClick={() => setShowModal(false)} className={styles.cancelBtn}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}