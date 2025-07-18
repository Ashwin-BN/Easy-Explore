import { useState, useEffect } from "react";
import iso2to3 from "@/components/VisitedPlacesPicker/iso2to3";
import { Country, City } from "country-state-city";
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import styles from "./VisitedPlaces.module.css";

const iso2ToIso3Map = new Map(
    Country.getAllCountries().map(c => [c.isoCode.toUpperCase(), c.iso3])
);

export default function VisitedPlaces({ visited = [], onUpdate = () => {} }) {
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [localVisited, setLocalVisited] = useState([]);
    const geoUrl = "https://raw.githubusercontent.com/subyfly/topojson/master/world-countries.json";

    // Deduplicate visited cities
    useEffect(() => {
        const seen = new Set();
        const deduped = visited.filter(entry => {
            const key = `${entry.countryCode}:${entry.city}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
        setLocalVisited(deduped);
    }, [visited]);

    const handleAddPlace = () => {
        if (!selectedCountry || !selectedCity) return;

        const country = Country.getCountryByCode(selectedCountry);
        if (!country) return;

        const newPlace = {
            countryCode: selectedCountry,
            countryName: country.name,
            city: selectedCity,
        };

        const duplicate = localVisited.some(
            (p) => p.city === newPlace.city && p.countryCode === newPlace.countryCode
        );
        if (duplicate) return;

        const updated = [...localVisited, newPlace];
        setLocalVisited(updated);
        onUpdate(updated);

        setSelectedCity("");
        setSelectedCountry("");
        setShowModal(false);
    };

    const highlightedCountries = new Set(
        localVisited
            .map(p => iso2to3[p.countryCode?.toUpperCase()])
            .filter(Boolean)
    );

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h3>Visited Places</h3>
                <button className={styles.editBtn} onClick={() => setShowModal(true)}>
                    + Add
                </button>
            </div>

            <p className={styles.stats}>
                {`${new Set(localVisited.map((p) => p.countryCode)).size} countries | ${localVisited.length} cities visited`}
            </p>

            <ComposableMap className={styles.map} projectionConfig={{ scale: 140 }}>
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            const isVisited = highlightedCountries.has(geo.id);
                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    onClick={() => {
                                        const match = Country.getAllCountries().find(c => c.iso3 === geo.id);
                                        if (!match) return;

                                        const iso2 = match.isoCode; // ISO2 code for matching cities
                                        const cities = localVisited.filter(p => p.countryCode === iso2);

                                        if (cities.length > 0) {
                                            alert(`Visited cities in ${match.name}:\n\n` + cities.map(c => `- ${c.city}`).join('\n'));
                                        }
                                    }}
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
                        <h4>Add a Visited City</h4>

                        <select
                            value={selectedCountry}
                            onChange={(e) => {
                                setSelectedCountry(e.target.value);
                                setSelectedCity("");
                            }}
                        >
                            <option value="">Select Country</option>
                            {Country.getAllCountries().map((c) => (
                                <option key={c.isoCode} value={c.isoCode}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            disabled={!selectedCountry}
                        >
                            <option value="">Select City</option>
                            {selectedCountry &&
                                City.getCitiesOfCountry(selectedCountry).map((c) => (
                                    <option key={c.name} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                        </select>

                        <div className={styles.modalButtons}>
                            <button className={styles.addBtn} onClick={handleAddPlace}>
                                Add
                            </button>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}