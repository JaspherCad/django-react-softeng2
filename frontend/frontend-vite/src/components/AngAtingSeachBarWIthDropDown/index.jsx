import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { customDebounceHook } from '../hooks/customDebounceHook';
import { SearchBillingsApi } from '../../api/axios';
import { filter } from 'lodash';
import PropTypes from 'prop-types'



//TLDR
//this searchbar send QUERY to a GIVEN API thru props
//onSelectSuggestion handles what to do

//onSelectSuggestion(filtered) =>???

const SearchBar = ({ searchTerm, setSearchTerm, placeholder, onSelectSuggestion, suggestedOutput = [], searchApi, isIDIncludedInResultSuggestion, isDropdownVisible, setIsDropdownVisible, maxDropdownHeight = '300px', }) => {
  //suggestedOutput is list of string
  //searchTerm, setSearchTerm =>  has been moved to parent
  const [results, setResults] = useState([]); // backend data
  // const [isDropdownVisible, setIsDropdownVisible] = useState(false); // => has been moved to parent
  const [loading, setLoading] = useState(false);


  //early errors if searchTerm and setSearhTerm is missing
  if (typeof searchTerm === 'undefined' || typeof setSearchTerm !== 'function') {
    throw new Error('BOI! searchbar requires searchTerm (string) and setSearchTerm (function) props. insert here the useStates of seatchTerm and setSearchTerm');
  }




  //use debounce to delay user input into backend search
  //inside we have useEffect ok?
  const debouncedSearchTerm = customDebounceHook(searchTerm, 1000);

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
          //include id no matter what, required for api kasi
          if (item.hasOwnProperty('id')) {
            filteredItem['id'] = item['id'];
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
          cursor: 'pointer',
          // backgroundColor: 'green'
        }}
      >

        {/* IF isIDIncludedInResultSuggestion === TRUE then include key=id else skip id key-value in results */}

        {/* filter here item here I guess DEPENDING on isIDIncludedInResultSuggestion */}
        {Object.entries(item).filter(([key]) => {
          if (key === 'id' && !isIDIncludedInResultSuggestion) {
            return false;
          }
          return true;
        })

          .map(([key, value]) => (
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

              {/*check if value is an object [MEANING THERE ARE SUB VALUES] then subvalue*/}
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
                //otherwise, render the value directly.
                <div style={{ color: '#666' }}>{value}</div>
              )}
            </div>
          ))}
      </li>
    ));
  };



  //SEARCH API CALLS
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.trim() !== '') {
      const searchAPICall = async () => {
        setLoading(true)
        try {
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
    <div style={{ position: 'relative', width: '100%' }}>
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
            position: 'absolute',
            top: 'calc(100% + 2px)',
            left: 0,
            width: '100%',

            maxHeight: maxDropdownHeight,

            overflowY: 'auto',
            margin: 0,
            padding: 0,
            listStyle: 'none',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            zIndex: 1000,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
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


SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  onSelectSuggestion: PropTypes.func,
  suggestedOutput: PropTypes.array,
  searchApi: PropTypes.func,
  isIDIncludedInResultSuggestion: PropTypes.bool,
  isDropdownVisible: PropTypes.bool.isRequired,
  setIsDropdownVisible: PropTypes.func.isRequired,
  maxDropdownHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

};

