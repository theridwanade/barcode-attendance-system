export interface EventDetails {
      _id?: string;
      title: string;
      description: string;
      endDate: string;
      startDate: string;
      eventCreatedAt: string;
      venue: {
          name: string;
          address: string;
      };
      invitedContacts: string[];
}