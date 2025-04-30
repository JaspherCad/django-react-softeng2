import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { customDebounceHook } from '../hooks/customDebounceHook';
import { SearchBillingsApi } from '../../api/axios';
import { filter } from 'lodash';



//TLDR
//this searchbar send QUERY to a GIVEN API thru props
//onSelectSuggestion handles what to do

//onSelectSuggestion(filtered) =>???

const SearchBar = ({ placeholder, onSelectSuggestion, suggestedOutput=[], searchApi }) => {
  //suggestedOutput is list of string

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]); // backend data
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  //use debounce to delay user input into backend search
                      //inside we have useEffect ok?
  const debouncedSearchTerm = customDebounceHook(searchTerm, 500); 

  const renderOnlySuggestedOutput = () => {
    // Ensure results and suggestedOutput are valid arrays
    const filtered = Array.isArray(suggestedOutput)
      ? results.map((item) => {
          //create a filtered object based on suggestedOutput keys
          const filteredItem = {};
          Object.keys(item).forEach((key) => {
            if (suggestedOutput.includes(key)) {
              filteredItem[key] = item[key];
              //hashmap entry this 
            }
          });
          return filteredItem;
        })
      : results;

    //filtered 2 => we are going to iterate each object in here since the .filter will return {} into obj we do this
    //filted item = {}
    //results.map(item =>{
     //  Object.keys(item).forEach(key => {
      //  if (suggestedOupiut.includes(key){
      //         filtetedItem[key] = item[key]})
      //})
     //})
    
  
     return filtered.map((item, index) => (
      <li
        key={index}
        onClick={() => onSelectSuggestion(item)}
        style={{
          padding: '10px',
          borderBottom: '1px solid #ddd',
          cursor: 'pointer'
        }}
      >
        {Object.entries(item).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '8px' }}>
            {/* Parent key */}
            <div
              style={{
                fontWeight: 'bold',
                color: '#333',
                display: 'block',
                marginBottom: '4px'
              }}
            >
              {key}:
            </div>
    
            {/* Check if value is an object */}
            {typeof value === 'object' && value !== null ? (
              <div
                style={{
                  paddingLeft: '20px',
                  backgroundColor: '#f9f9f9',
                  borderLeft: '2px solid #ccc'
                }}
              >
                {Object.entries(value).map(([subKey, subValue]) => (
                  <div key={subKey} style={{ color: '#555', marginBottom: '2px' }}>
                    {subKey}: {subValue}
                  </div>
                ))}
              </div>
            ) : (
              // Otherwise, render the value directly.
              <div style={{ color: '#666' }}>{value}</div>
            )}
          </div>
        ))}
      </li>
    ));
  };


  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.trim() !== ''){
      const searchAPICall = async () => {
        setLoading(true)
        try{
          //call the api
          const response = await searchApi(debouncedSearchTerm) //q = debouncedSearchTerm
          console.log(response)
          setResults(response.data);
          setIsDropdownVisible(true);
        } catch (error) {
          console.error('Error searching:', error);
          setResults([]);
          setIsDropdownVisible(false);
        }
        setLoading(false);
      };

      searchAPICall(debouncedSearchTerm);
    } else {
      setResults([]);
      setIsDropdownVisible(false);
    }
  }, [debouncedSearchTerm]); //only changes when this term changed (500ms)







  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  


  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        value={searchTerm}
        onChange={handleInputChange}
        style={{
          width: '100%',
          padding: '8px',
          boxSizing: 'border-box'
        }}
      />
      {isDropdownVisible && results.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            border: '1px solid #ddd',
            borderTop: 'none',
            height: 'auto',
            overflowY: 'auto',
            backgroundColor: '#fff',
            position: 'absolute',
            width: '100%',
            zIndex: 1000
          }}
        >
          {renderOnlySuggestedOutput()}
        </ul>
      )}
      {loading && <div style={{ marginTop: '4px' }}>Loading...</div>}
    </div>
  );
};

export default SearchBar;
