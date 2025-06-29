import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './DashboardDoctor.module.css';
import { currentUserLogs, listOfPatientAPI } from '../../api/axios';
import Calendar from 'react-calendar';

import styled from 'styled-components';
const PAGE_SIZE = 2;

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [testMessage, setTestMessage] = useState('');
  const [error, setError] = useState(null);
  const [myUserLogs, setMyUserLogs] = useState([])


  //list of patients
  const [patients, setPatients] = useState([]);
  const [patientsError, setPatientsError] = useState(null);

  // PPAGINATION PROPS props
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);



  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };



  //for calendar container only
  const CalendarContainer = styled.div`
  /* ~~~ container styles ~~~ */
  margin: auto;
  background-color: #d4f7d4;
  padding: 10px;
  border-radius: 3px;


  /* ~~~ navigation styles ~~~ */
  .react-calendar__navigation {
    display: flex;

    .react-calendar__navigation__label {
      font-weight: bold;
    }

    .react-calendar__navigation__arrow {
      flex-grow: 0.333;
    }
  }

  /* ~~~ neighboring month & weekend styles ~~~ */
  .react-calendar__month-view__days__day--neighboringMonth {
    opacity: 0.7;
  }
  .react-calendar__month-view__days__day--weekend {
    color: red;
  }


  /* ~~~ active day styles ~~~ */
  .react-calendar__tile--range {
      box-shadow: 0 0 6px 2px black;
  }


  /* ===== Mobile (≤600px) ===== */
  @media (max-width: 900px) {
    max-width: 240px;       /* narrower wrapper */
    padding: 2px;
    .react-calendar {
      font-size: 0.75rem;
    }

    .react-calendar__tile {
      padding: 1px;
      height: 32px;
      line-height: 36px;
    }

    /* you can also shrink navigation arrows/text */
    .react-calendar__navigation__label {
      font-size: 0.85rem;
    }
    .react-calendar__navigation__arrow {
      font-size: 0.85rem;
    }
  }
`;






  // Fetch current user logs using the API
  useEffect(() => {
    const fetchUserLogs = async () => {
      try {
        const response = await currentUserLogs();
        console.log(response.data)
        // Assuming response.data holds the logs array
        setMyUserLogs(response.data);

      } catch (err) {
        setError(err.message || 'Failed to fetch logs');
      }
    };

    fetchUserLogs();
  }, []);



  // useEffect(() => {
  //   const fetchPatient = async () => {
  //     try {
  //       const response = await listOfPatientAPI();
  //       setPatients(response.data);

  //     } catch (error) {
  //       setPatientsError(err.message || 'Failed to load patients');
  //     }
  //   }
  //   fetchPatient()
  // }, [])

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await listOfPatientAPI(currentPage);
        const { count, results } = response.data;
        setPatients(response.data.results || []);
        setTotalItems(response.data.count || 0);
        setTotalPages(Math.ceil(response.data.count / PAGE_SIZE));
      } catch (err) {
        console.error(err);
        setPatientsError('Failed to load patients');
      }
    };
    fetchPatients();
  }, [currentPage]);


  const eventData = [
    {
      date: "2025-06-10", // Use ISO format for consistency
      eventName: "Eye Checkup",
      patient: "Jose"
    },
    {
      date: "2025-06-12",
      eventName: "Dental Cleaning",
      patient: "Maria"
    },
    {
      date: "2025-06-15",
      eventName: "General Consultation",
      patient: "Juan"
    }
  ];

  const eventDates = useMemo(() =>
    eventData.map(event => event.date),
    [eventData]);

  const filteredEvents = useMemo(() => {
    // const selectedDateString = selectedDate.toISOString().split('T')[0]; //"2011-10-05T14:48:00.000Z"
    const selectedDateString = selectedDate.toLocaleDateString('en-CA');

    return eventData.filter(event =>
      event.date === selectedDateString
    );
  }, [selectedDate, eventData]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };



  return (
    <div className={styles.dashboardContainer}>

      <div className={styles.metricsContainer}>
        {/* CARD COMPONENTS */}

        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.cardNumber}>3</div>
            <div className={styles.cardText}>Total Admitted Patients</div>
          </div>

          <div className={styles.cardIcon}></div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.cardNumber}>3</div>
            <div className={styles.cardText}>Total Admitted Patients</div>
          </div>

          <div className={styles.cardIcon}></div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.cardNumber}>3</div>
            <div className={styles.cardText}>Total Admitted Patients</div>
          </div>

          <div className={styles.cardIcon}></div>
        </div>

      </div>



      <div className={styles.doctorDashboardContainer}>
        <div className={styles.doctorHistoryContainer}>

          <ul className={styles.historyList}>
            {myUserLogs.map((event, index) => (
              <li key={index} className={styles.historyItem}>
                <div className={styles.eventIcon}>

                </div>
                <div className={styles.eventDetails}>
                  <span className={styles.eventTimestamp}>{event.timestamp}</span>
                  <span className={styles.eventDescription}>{event.details.message}</span>
                </div>
              </li>
            ))}
          </ul>

        </div>

        <div className={styles.graphContainer}>
          <div className={styles.graphContainer}> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis nisi sint, voluptate fugiat, impedit, itaque eos eaque praesenstium rerum quasi perspiciatis sapiente magnam asperiores voluptates. Iste similique necessitatibus, animi alias cum quibusdam, minima dolorum ea ad fuga aliquid veritatis, eos odio dolor sint. Soluta quae exercitationem quia corporis. Explicabo aliquid reprehenderit debitis veritatis, similique eius! Ullam distinctio sunt perferendis! Libero, dolor voluptatum eveniet facilis sapiente autem beatae perferendis totam quibusdam consequuntur! Sunt facere voluptate cum error commodi! Corporis dolorum ipsa sed eum, exercitationem doloribus omnis inventore, tempora aliquid cumque, nobis architecto impedit sequi nostrum qui deleniti non maiores quas eligendi! </div>
        </div>

        <div className={styles.calendarContainer}>





          {/* REACT CALENDAR SECTION */}
          {/* DO NOT OVERTHINK.. think the default REACT CALENDAR STYLING IS THIS 
          <div class="myCustomCalendar react-calendar">
            <div class="react-calendar__navigation"> ... </div>
            <div class="react-calendar__month-view">
              <button class="react-calendar__tile"> ... </button>
              <!-- More tiles -->
            </div>
          </div> */}

          {/* so to customize personalized calendar, do this in CSS*/}





          <CalendarContainer>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              //tile content returns list of dates pretty sure
              tileContent={({ date, view }) => {
                if (view === 'month') {
                  console.log(date)
                  const dateString = date.toLocaleDateString('en-CA'); //the each day on the calendar
                  return (
                    <>
                      {selectedDate.toLocaleDateString('en-CA') === dateString ?
                        (
                          <div className={styles.tileParentSelectedDate}>
                            <div className={styles.selectedDate}></div>
                          </div>
                        )
                        :
                        (
                          <div className={styles.tileParent}>
                          </div>
                        )
                      }


                      {eventDates.includes(dateString) && (
                        <div className={styles.tileParent}>
                          <div className={styles.eventMarker}></div>
                        </div>
                      )}
                    </>
                  );
                }
                return null;
              }}
            />
          </CalendarContainer>


          {/* Event display section */}
          {filteredEvents.length > 0 ? (
            <div className={styles.eventList}>
              {filteredEvents.map((event, index) => (
                <div key={index} className={styles.eventItem}>
                  <div className={styles.eventDate}>
                    {event.date}
                  </div>
                  <div className={styles.eventContent}>
                    <div className={styles.eventName}>
                      {event.eventName}
                    </div>
                    <div className={styles.eventPatient}>
                      {event.patient}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noEvents}>
              No scheduled events
            </div>
          )}
        </div>
      </div>






      <div className={styles.patientTableContainer}>

        {patientsError && (
          <p className={styles.errorText}>{patientsError}</p>
        )}

        <table className={styles.patientTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Admission Date</th>
              <th>Status</th>
              <th>Phone</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {patients && patients.length > 0 ? (
              patients.map((patient, idx) => (
                <tr key={patient.id}>
                  <td>{idx + 1}</td>
                  <td>{patient.name}</td>
                  <td>
                    {new Date(patient.admission_date).toLocaleDateString()}
                  </td>
                  <td>{patient.status}</td>
                  <td>{patient.phone}</td>
                  <td>
                    <button
                      className={styles.btnEdit}
                      onClick={() => /* handle edit */ null}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.btnTrash}
                      onClick={() => /* handle delete */ null}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>




        {/* Pagination Controls */}

        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, totalItems)} of {totalItems} patients
          </div>

          <div className={styles.paginationControls}>
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              Previous
            </button>

            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={styles.paginationButton}
            >
              Next
            </button>
          </div>
        </div>




      </div>



    </div>
  );
};

export default Dashboard;