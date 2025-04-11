import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './DashboardDoctor.module.css';
import { currentUserLogs } from '../../api/axios';
import Calendar from 'react-calendar';



const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [testMessage, setTestMessage] = useState('');
  const [error, setError] = useState(null);
  const [myUserLogs, setMyUserLogs] = useState([])


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





  const eventData = [
    {
      date: "2025-04-10", // Use ISO format for consistency
      eventName: "Eye Checkup",
      patient: "Jose"
    },
    {
      date: "2025-04-12",
      eventName: "Dental Cleaning",
      patient: "Maria"
    },
    {
      date: "2025-04-15",
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
          <div className={styles.graphContainer}> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis nisi sint, voluptate fugiat, impedit, itaque eos eaque praesentium rerum quasi perspiciatis sapiente magnam asperiores voluptates. Iste similique necessitatibus, animi alias cum quibusdam, minima dolorum ea ad fuga aliquid veritatis, eos odio dolor sint. Soluta quae exercitationem quia corporis. Explicabo aliquid reprehenderit debitis veritatis, similique eius! Ullam distinctio sunt perferendis! Libero, dolor voluptatum eveniet facilis sapiente autem beatae perferendis totam quibusdam consequuntur! Sunt facere voluptate cum error commodi! Corporis dolorum ipsa sed eum, exercitationem doloribus omnis inventore, tempora aliquid cumque, nobis architecto impedit sequi nostrum qui deleniti non maiores quas eligendi! </div>
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
                {selectedDate.toLocaleDateString('en-CA') === dateString? 
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
        {/* TABLES OF PATIENT */}
        <ul>
          <li>table of patients</li>
          <li>table of patients</li>
          <li>table of patients</li>
          <li>table of patients</li>

        </ul>


        

      </div>

      
    </div>
  );
};

export default Dashboard;