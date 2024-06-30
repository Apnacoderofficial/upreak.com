const fs = require('fs');
const axios = require('axios');
const  { getToken } = require('./token')

const eventEndpoint = "https://graph.microsoft.com/v1.0/me/events";

const createEvent = async (start_time, end_time, attendeeName, attendeeEmail) => {
  try {
    const accessToken = await getToken();
    const eventData = {
      subject: `Regarding Interview Slot of ${attendeeName}`,
      start: {
        dateTime: start_time,
        timeZone: "Asia/Kolkata"
      },
      end: {
        dateTime: end_time,
        timeZone: "Asia/Kolkata"
      },
      location: {
        displayName: "Virtual",
      },
      organizer: {
        emailAddress: {
          name: "Upreak Team",
          address: "superadmin@upreak.com",
        },
      },
      attendees: [
        {
          emailAddress: {
            address: attendeeEmail,
            name: attendeeName,
          },
          type: "required",
        },
      ],
      isOnlineMeeting: true,
      onlineMeetingProvider: "teamsForBusiness",
      allowNewTimeProposals: true,
     
    };
    const response = await axios.post(eventEndpoint, eventData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
      },
    });

    if (response.status === 201) {
      console.log("Event created successfully!");
      const eventId = response.data.id;
      const joinUrl = response.data.onlineMeeting.joinUrl;
      
      // Write the response to a file
      fs.writeFileSync('uploads/meetingresponse.json', JSON.stringify(response.data, null, 2));
      console.log('Response saved to meetingresponse.json');

      return { status : true, id: eventId, joinUrl: joinUrl };
    } else {
      console.error(`Error creating event. HTTP code: ${response.status}`);
      console.error("Response:", response.data);
      return {status : false, error : response.status};
    }
  } catch (error) {
    console.error("Error:", error.message);
    return {status : false, error : error.message};
  }
}

const deleteEvent = async (eventId) => {
    try {
      const accessToken = await getToken();
      const url = `https://graph.microsoft.com/v1.0/me/events/${eventId}`;
  
      const response = await axios.delete(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
        },
      });
  
      if (response.status === 204) {
        console.log('Event deleted successfully!');;
        return { status : true};
      } else {
        console.error(`Error deleting event. HTTP code: ${response.status}`);
        console.error('Response:', response.data);
        return { status : false , error : response.status};
      }
    } catch (error) {
      console.error('Error:', error.message);
      fs.writeFileSync('deleteMeetingresponse.json', JSON.stringify(response.data, null, 2));
      console.log('Response saved to deleteMeetingresponse.json');
      return { status : false , error : error.message};
    }
  }

module.exports = {
  createEvent,
  deleteEvent
};
