// /functions/save-events.js
const fs = require('fs');
const path = require('path');

const EVENTS_FILE = path.join(__dirname, '..', 'events.json');

exports.handler = async (event) => {
  let events = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf-8'));

  if(event.httpMethod === 'GET'){
    return { statusCode: 200, body: JSON.stringify(events) };
  }

  if(!event.body) return { statusCode: 400, body: 'Missing body' };
  const data = JSON.parse(event.body);

  switch(event.httpMethod){
    case 'POST':
      events.push(data);
      break;
    case 'PUT':
      events[data.index] = data.event;
      break;
    case 'DELETE':
      events.splice(data.index,1);
      break;
    default:
      return { statusCode: 400, body: 'Invalid method' };
  }

  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
  return { statusCode: 200, body: JSON.stringify(events) };
};
