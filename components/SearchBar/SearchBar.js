import { useState, useEffect } from "react";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import styles from "./SearchBar.module.css";

export default function SearchBar({
  value,
  onChange,
  onSearch,
  onLocationChange,
}) {
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    if (country && state && city) {
      onLocationChange({
        country: country.name,
        state: state.name,
        city: city.name,
      });
    }
  }, [country, state, city, onLocationChange]);

  return (
    <div className={styles.flexRow}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for attractions"
        className={styles.searchInput}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />

      <CountrySelect
        className={styles.selectField}
        inputClassName={styles.selectField}
        placeholder="Country"
        onChange={(c) => {
          setCountry(c);
          setState(null);
          setCity(null);
        }}
      />

      <StateSelect
        countryid={country?.id}
        className={styles.selectField}
        inputClassName={styles.selectField}
        placeholder="State/Province"
        onChange={(s) => {
          setState(s);
          setCity(null);
        }}
        disabled={!country}
      />

      <CitySelect
        countryid={country?.id}
        stateid={state?.id}
        className={styles.selectField}
        inputClassName={styles.selectField}
        placeholder="City"
        onChange={setCity}
        disabled={!state}
      />

      <button onClick={onSearch} className={styles.searchButton}>
        Search
      </button>
    </div>
  );
}
