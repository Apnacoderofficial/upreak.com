const fs = require('fs');
const axios = require('axios');
const  { getToken } = require('./token')

// const accessToken = "eyJ0eXAiOiJKV1QiLCJub25jZSI6ImF0ZlcwWG5aSGlUYVQwQkpsV0lnNXljTEowQ09WTWp5ZWx2OUNFTVpiUDgiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtXYmthYTZxczh3c1RuQndpaU5ZT2hIYm5BdyIsImtpZCI6ImtXYmthYTZxczh3c1RuQndpaU5ZT2hIYm5BdyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9jODIzMDY0Ni05NzdkLTQxOGMtYjg1MC0yYmVjYjQwODE1MWYvIiwiaWF0IjoxNzA3NzA5NTIwLCJuYmYiOjE3MDc3MDk1MjAsImV4cCI6MTcwNzc5NjIyMCwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkUyVmdZRWpxdlpicjlmbnQzdlVQenBWcWh2MFVLRElxVm5NdE1yZnpzSXE1b0tZUjB4VVlaemUzVDNXcTdsWGpMOExXS1J4dkFRPT0iLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIEV4cGxvcmVyIiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IlJlcGx5IiwiZ2l2ZW5fbmFtZSI6Ik5vIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMjQwNToyMDE6NDAzNDpiODNkOmE5ZDQ6Njc1ODo4MjIwOjIzNjMiLCJuYW1lIjoiTm8gUmVwbHkiLCJvaWQiOiI3N2IyY2Y4OS05MzcwLTQ5ZWYtYjA3Zi1kNTNiOTExMWQ2YzgiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDMzOTRERjMzQiIsInJoIjoiMC5BVW9BUmdZanlIMlhqRUc0VUN2c3RBZ1ZId01BQUFBQUFBQUF3QUFBQUFBQUFBQ0pBQ2cuIiwic2NwIjoiQ2FsZW5kYXJzLlJlYWQgQ2FsZW5kYXJzLlJlYWQuU2hhcmVkIENhbGVuZGFycy5SZWFkQmFzaWMgQ2FsZW5kYXJzLlJlYWRXcml0ZSBDYWxlbmRhcnMuUmVhZFdyaXRlLlNoYXJlZCBvcGVuaWQgcHJvZmlsZSBVc2VyLlJlYWQgZW1haWwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJzMjJ6YzVXLUpySXo3Q29UZTg0dHZmMVJ5UTlmMkt4emE5V2RRUFREdFVNIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IkFTIiwidGlkIjoiYzgyMzA2NDYtOTc3ZC00MThjLWI4NTAtMmJlY2I0MDgxNTFmIiwidW5pcXVlX25hbWUiOiJub3JlcGx5QHVwcmVhay5jb20iLCJ1cG4iOiJub3JlcGx5QHVwcmVhay5jb20iLCJ1dGkiOiI3bWhYcGhvRGJrR1pnYWdPZGhwc0FBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2NjIjpbIkNQMSJdLCJ4bXNfc3NtIjoiMSIsInhtc19zdCI6eyJzdWIiOiJJMU50SlFVNTZJTEttNG9yYklzUjRqM2ZleTdzSzBaZ1hvNkRwOUFHSnBvIn0sInhtc190Y2R0IjoxNjg5NjE0NDAxfQ.YyLaWuXW89ndq66VBsmmXRHSLDKRX-E_kZ0-mB5RyAblhz389pcH8fsBVNVZ_gbGhrhKz-B1PHU3QskRi2DBM7hLLWPtnNta8nHWMcIW2W9ysf8MZqFiv8qDW7zvWf6DT2psUi9_-Ph3v9JiYPy-cP-uKelfwIXczBjkxOEe_j4Fo6evK5ldtbG9SI_gzDrXLJxcXsPJPLRI1Rn4G0tNVk_Vcyps5rTrHxMRKJvKXNOZ1CLe8dQWWOXhWKdXgjtTSXFyvT8pL4Okx72D2a0vtk0mIFaAuS62N6IjIk_fxoesz-IRwYYMpQUr0v5K8FYtQ6wH-VmRVhehCojVSgwgQg";
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
