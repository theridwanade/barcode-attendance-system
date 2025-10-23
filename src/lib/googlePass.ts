import { PassClassEventTicketType, PassObjectEventTicketType } from '../types/passTypes.ts';
import { google } from 'googleapis';
import fs from "node:fs/promises";
import path from "node:path";

const Dirname = path.dirname(new URL(import.meta.url).pathname);
const svcKeyPath = path.join(Dirname, "..", "..", "service_account.json");

const googlePassSvcKey = JSON.parse(
    await fs.readFile(svcKeyPath, { encoding: "utf-8" })
);

const issuerId = '3388000000023034056';

// Initialise Google wallet API client
const auth = new google.auth.GoogleAuth({
    credentials: googlePassSvcKey,
    scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
})

const walletClient = google.walletobjects({
    version: 'v1',
    auth: auth,
})

const createClass = async (classData: PassClassEventTicketType) => {
    let response;

    try {
        response = await walletClient.eventticketclass.get({
            resourceId: classData.id,
        })
        console.log(`Class ${classData.id} already exists!`);

        return classData.id;
    } catch (err: Error | any) {
        if (err.response && err.response.status !== 404) {
            console.log(err);
            return classData.id;
        }
    }

    let newClass = classData;

    response = await walletClient.eventticketclass.insert({
        requestBody: newClass
    });

    console.log('Class insert response');
    console.log(response);

    return classData.id;
}

const createObject = async (classId: `${string}.${string}`, objectData: PassObjectEventTicketType) => {
    let response;

    try {
        response = await walletClient.eventticketobject.get({
            resourceId: objectId,
        })
        console.log(`Object ${objectId} already exists!`);

        return objectId;
    } catch (err: Error | any) {
        if (err.response && err.response.status !== 404) {
            console.log(err);
            return objectId;
        }
    }

    response = await walletClient.eventticketobject.insert({
        requestBody: objectData
    });
    console.log('Object insert response');
    console.log(response);

    return objectId;
}

const passClassData: PassClassEventTicketType = {
    id: `${issuerId}.event_ticket_v1.0.4`,
    issuerName: "theridwanade",
    reviewStatus: "UNDER_REVIEW",
    eventName: {
        defaultValue: {
            language: 'en-US',
            value: 'Devfest'
        }
    },
    title: {
        defaultValue: {
            language: 'en-US',
            value: 'Devfest Ticket'
        }
    },
    subtitle: {
        defaultValue: {
            language: 'en-US',
            value: 'Tech conference 2025 for Ilorin'
        }
    },
    venue: {
        name: {
            defaultValue: {
                language: 'en-US',
                value: 'Ilorin Convention Center'
            }
        },
        address: {
            defaultValue: {
                language: 'en-US',
                value: '123 Main St, Ilorin'
            }
        }
    },
    dateTime: {
        start: '2025-12-01T18:00:00Z',
        end: '2025-12-01T21:00:00Z'
    },
    multipleDevicesAndHoldersAllowedStatus: "ONE_USER_ALL_DEVICES"
}

const classId = await createClass(passClassData);
const objectId = `${issuerId}.event_ticket_v1_object_001`;

const passObjectData: PassObjectEventTicketType = {
    id: objectId,
    classId: classId,
    state: "ACTIVE",
    barcode: {
        type: "QR_CODE",
        value: "TICKET-1234567890, don't even know whats happening here, just testing",
    },
    cardTitle: {
        defaultValue: {
            language: 'en-US',
            value: 'Devfest Ticket'
        }
    },
    ticketHolderName: "Ridwan Oyeniyi"
}

const passObjectId = await createObject(classId, passObjectData);

console.log(`Pass Object created with ID: ${passObjectId}`);





